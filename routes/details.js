const router = require("express").Router();
const Details = require("../models/Details"); 
const {protect} = require('../middleware/authMiddleware') 

//REGISTER
//@desc Post drone details
//@route /api/info/details
//@access Private
router.post("/details", protect, async (req, res) => {
    try {
      const { serialNumber, code, name, weight } = req.body

      if (serialNumber.length > 100) {
        res.status(400).json("Please enter a serial number of not be more than 100 characters")
      }

      if (weight > 500) {
        res.status(400).json("Please enter a weight of not more than 500 gr")
      }

      function onlyLettersAndNumbers(str) {
        return /^[A-Za-z0-9-_]*$/.test(str);
      }

      const onlyCaps = (str) => {
        return /^[A-Z_0-9]*$/.test(str);
      }

      const checkName = (onlyLettersAndNumbers(name));
      const checkCode = (onlyCaps(code));
      if (!checkName) {
        res.status(400).json("Your name should include only letters and numbers; - and _ are also allowed")
      }
      if (!checkCode) {
        res.status(400).json("Only uppercase letters are allowed; underscore can also be used")
      }

      const addDetails = new Details({
        serialNumber: req.body.serialNumber,
        code: req.body.code,
        name: req.body.name,
        weight: req.body.weight,
      });   
  
      const newDetail = await addDetails.save();
      //res.status(200).json(user);
      res.send({
        status: 200,
        result: "Success",
        message: "Details of the drone are listed...",
        serialNumber: req.body.serialNumber,
        code: req.body.code,
        name: req.body.name,
        weight: req.body.weight,
    })
    } catch (err) {
      res.status(500).json(err);
    }
});

// GET ALL THE DETAILS OF THE AVAILABLE DRONES 
//@desc get details of available drones
//@route /api/info
//@access Private
router.get("/", protect, async (req, res) => {
  try{
      const getDetails = await Details.find()
      res.status(200).json(getDetails)
  } catch(err){
      res.status(500).json(err)
  }
})

//GET DETAILS OF A SPECIFIC DRONE
//@desc Get detail of a drone
//@route /api/info/:id
//@access Private
router.get("/:id", async (req, res) => {
  try {
    const findDetail = await Details.findById(req.params.id);
  
    res.status(200).json(findDetail);
  } catch (err) {
    res.status(500).json(err);
  }
});   

//UPDATE
//@desc update drone details
//@route /api/info/:id
//@access Private
router.put("/:id", protect, async (req, res) => {
    try {
      const updatedDetail = await Details.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedDetail);
    } catch (err) {
      res.status(500).json(err);
    }
});  

//DELETE
//@desc delete drone details
//@route /api/info/:id
//@access Private
router.delete("/:id", protect, async (req, res) => {
    try {
      await Details.findByIdAndDelete(req.params.id);
      res.status(200).json("Drone details has been deleted...");
    } catch (err) {
      res.status(500).json(err);
    }
}); 


module.exports = router;


