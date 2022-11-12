const router = require("express").Router();
const Medication = require("../models/Medication");
const Drone = require("../models/Drone");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {protect} = require('../middleware/authMiddleware') 

const { createStore } = require('redux')

function droneState(state, action) {
  switch (action.type) {
    case 'LOADING':
      return action.payload
    case 'LOADED':
      return action.payload
    default:
      return state
  }
}

let store = createStore(droneState)

//dispatch

//subscribe to state
store.subscribe(() => console.log(store.getState()))    

// REGISTER
//@desc Register a drone-user
//@route /api/medication/register
//@access Public
router.post("/register", async(req, res) => {
  try { 
    const { serialNumber, model, weightLimit, battery } = req.body

    // Validation
    if (!serialNumber || !model) {
      res.status(400).json("Please include the empty fields")
    }

    if (serialNumber.length > 100) {
      res.status(400).json("The serial number should not be more than 100 characters")
    }

    if (weightLimit > 500) {
      res.status(400).json("The weight limit should not be more than 500 gr")
    }

    // Find if drone already exists
    const droneExists = await Drone.findOne({ serialNumber })

  
    if (droneExists) {
      res.status(400).json("Drone already exist!")
    }

    // Hash code
    const salt = await bcrypt.genSalt(10)
    const hashedCode = await bcrypt.hash(serialNumber, salt)

    // Create drone
    const newLoad = await Drone.create({
      serialNumber: hashedCode,
      model: req.body.model,
    })

    if (newLoad) { 
      res.status(201).json({
        _id: newLoad._id,
        serialNumber: hashedCode,
        model: req.body.model,
        message: "New drone registered successfully",
        token: generateToken(newLoad._id)
      })
    }
  } 
  catch(err) {
    res.status(400).json(err)
  }
})

//REGISTER
//@desc preload a drone-user
//@route /api/medication/preload
//@access Public
router.post("/preload", async(req, res)  => {
  const { serialNumber, model } = req.body

  const userDrone = await Drone.findOne({ model })

  // Check serialNumber and model match
  if (userDrone && (await bcrypt.compare(serialNumber, userDrone.serialNumber))) {
  res.status(200).json({
    _id: userDrone._id,
    serialNumber: userDrone.serialNumber,
    model: req.body.model,
    message: "This drone is ready to load",
    token: generateToken(userDrone._id)
  })
} else {
  res.status(401).json("Wrong Credentials!")
}
})

//LOAD
//@desc Load a drone
//@route /api/medication/load
//@access Private
router.post("/load", protect, async (req, res) => {
  const { serialNumber, codeId, model, weightLimit } = req.body
  store.dispatch({type: 'LOADING', payload: 'LOADING'})

  if (weightLimit > 500) {
    res.status(400).json("Cannot proceed with loading...This has exceeded the weight limit")
  }

    try {
      const newDrone = new Medication({
        result: "success",
        serialNumber: req.body.serialNumber,
        codeId: req.body.codeId,
        model: req.body.model,
      });
  
      const user = await newDrone.save();
      res.send({
        status: 200,
        result: "Success",
        message: "Drone loaded successfully",
        serialNumber: req.body.serialNumber,
        codeId: req.body.codeId,
      });
    } catch (err) {
      res.status(500).json(err);
    }

    store.dispatch({type: 'LOADED', payload: 'LOADED'})
});

//GET ALL LOADED DRONES
//@desc Get all the loaded drones
//@route /api/medication/
//@access Private
router.get("/", protect, async (req, res) => {
    try{
        const loadedDrones = await Medication.find()
        res.status(200).json(loadedDrones)
    } catch(err){
        res.status(500).json(err)
    }
})

//GET A LOADED DRONE
//@desc Get a loaded drone
//@route /api/medication/:id
//@access Private
router.get("/:id", protect, async (req, res) => {
    try {
      const loadedDrone = await Medication.findById(req.params.id);
    
      res.status(200).json(loadedDrone);
    } catch (err) {
      res.status(500).json(err);
    }
});

//UPDATE
//@desc Update a loaded drone
//@route /api/medication/:id
//@access Private
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedDrone = await Medication.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedDrone);
  } catch (err) {
    res.status(500).json(err);
  }
});  

//DELETE
//@desc Delete a loaded drone
//@route /api/medication/:id
//@access Private
router.delete("/:id", protect, async (req, res) => {
  try {
    await Medication.findByIdAndDelete(req.params.id);
    res.status(200).json("The loaded drone has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
}); 

// Generate token
//jsonwebtoken
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
}

module.exports = router;