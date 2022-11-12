const router = require("express").Router();
const Deliver = require("../models/Deliver"); 
const {protect} = require('../middleware/authMiddleware') 

const { createStore } = require('redux')

function droneState(state, action) {
  switch (action.type) {
    case 'DELIVERING':
      return action.payload
    case 'DELIVERED':
      return action.payload
    default:
      return state
  }
}

let store = createStore(droneState)

//subscribe to state
store.subscribe(() => console.log(store.getState())) 

//REGISTER
//@desc Post delivery state
//@route /api/deliver/
//@access Private
router.post("/", protect, async (req, res) => {
    store.dispatch({type: 'DELIVERING', payload: 'DELIVERING'})
    try {
      const { serialNumber, code } = req.body

    // Validation
    if (!serialNumber || !code) {
      res.status(400).json("Please include the empty fields")
    }

    const deliveredDroneExists = await Deliver.findOne({ serialNumber })

    if (deliveredDroneExists) {
      res.status(400).json("Delivered Drone already exist!")
    }

      const newDelivery = new Deliver({
        serialNumber: req.body.serialNumber,
        code: req.body.code,
      });
  
      const delivery = await newDelivery.save();
      //res.status(200).json(user);
      res.send({
        status: 200,
        result: "Success",
        message: "Delivered successfully",
        serialNumber: req.body.serialNumber,
        code: req.body.code,
    })
    } catch (err) {
      res.status(500).json(err);
    }

    store.dispatch({type: 'DELIVERED', payload: 'DELIVERED'})
});

module.exports = router;