const router = require("express").Router();
const Drone = require("../models/Drone");
const Battery = require("../models/Battery");
const {protect} = require('../middleware/authMiddleware') 

const { createStore } = require('redux')

function droneState(state, action) {
  switch (action.type) {
    case 'IDLE':
      return action.payload
    default:
      return state
  }
}

let store = createStore(droneState)

//subscribe to state
store.subscribe(() => console.log(store.getState()))


//REGISTER BATTERY LEVEL
//@desc register battery level for loaded drones
//@route /api/power/attery
//@access Private
router.post("/battery", protect, async (req, res) => {
  
  try {
    const { serialNumber, battery } = req.body

    if (battery < 25) {
      store.dispatch({type: 'IDLE', payload: 'IDLE'})
      res.status(400).json("The battery level is too low...Loading will not proceed.")  
    }

    if (serialNumber.length > 100) {
      res.status(400).json("Please enter a serial number of not be more than 100 characters")
      // throw new Error('')
    }

    const droneBattery = new Battery({
      serialNumber: req.body.serialNumber,
      battery: req.body.battery,
    });

    const droneBatteryLevel = await droneBattery.save();;
    //res.status(200).json(user);
    res.send({
      status: 200,
      result: "Success",
      message: "Battery checked..",
      serialNumber: req.body.serialNumber,
      battery: req.body.battery,
  })
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET BATTERY LEVEL OF A SPECIFIC DRONE
//@desc Get battery level of a drone
//@route /api/power/:id
//@access Private
router.get("/:id", protect, async (req, res) => {
    try {
      const batteryDetail = await Battery.findById(req.params.id);
    
      res.status(200).json(batteryDetail);
    } catch (err) {
      res.status(500).json(err);
    }
});

//GET BATTERY LEVEL OF ALL THE AVAILABLE DRONES
//@desc Get battery level of all the drones
//@route /api/power/:id
//@access Private 
router.get("/", async (req, res) => {
  store.dispatch({type: 'LOADING', payload: 'Loading'})
    try{
        const batteryDetails = await Battery.find()
        res.status(200).json(batteryDetails)
    } catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedBattery = await Battery.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedBattery);
  } catch (err) {
    res.status(500).json(err);
  }
});  

//DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    await Battery.findByIdAndDelete(req.params.id);
    res.status(200).json("Battery information has been removed...");
  } catch (err) {
    res.status(500).json(err);
  }
}); 


module.exports = router;