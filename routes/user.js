const router = require("express").Router();
const Drone = require("../models/Drone");

//REGISTER
//@desc post a drone-user
//@route /api/drone/start
//@access Public
router.post("/start", async (req, res) => {
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

    //Creating new user drone
      const newUser = new Drone({
        serialNumber: req.body.serialNumber,
        model: req.body.model,
      });
  
      const user = await newUser.save();
      //res.status(200).json(user);
      res.send({
        status: 200,
        result: "Success",
        message: "New drone created successfully",
        serialNumber: req.body.serialNumber,
        model: req.body.model,
    })
    } catch (err) {
      res.status(500).json(err);
    }
});

//GET A DRONE
//@desc get a drone-user
//@route /api/drone/:id
//@access Public
router.get("/:id", async (req, res) => {
    try {
      const drone = await Drone.findById(req.params.id);
    
      res.status(200).json(drone);
    } catch (err) {
      res.status(500).json(err);
    }
});


// GET DRONES 
//@desc get all the drone-users
//@route /api/drone
//@access Public
router.get("/", async (req, res) => {
    try{
        const drones = await Drone.find()
        res.status(200).json(drones)
    } catch(err){
        res.status(500).json(err)
    }
})

//UPDATE
//@desc Update a drone-user
//@route /api/drone/:id
//@access Public
router.put('/:id', async(req, res) => {
  try {
      const updatedUser = await Drone.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
  }
})

//DELETE
//@desc Delete a drone-user
//@route /api/drone/:id
//@access Public
router.delete('/:id', async(req, res) => {
  try {
      await Drone.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted...");
    } catch (err) {
      res.status(500).json(err);
  }
})

module.exports = router;