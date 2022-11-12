const router = require("express").Router();
const Battery = require("../models/Battery");
const {protect} = require('../middleware/authMiddleware') 


//GET THE LATEST BATTERY LEVEL INPUTS ADDED
//@desc Get latest detail of battery level - querying to get a new added battery level
//@route /api/audit/:id
//@access Private
router.get("/new", protect, async (req, res) => {
    const qNew = req.query.new;     //add the route: /?new=true
    try {
      let newBatteryInputs;
  
      if (qNew) {
        newBatteryInputs = await Battery.find().sort({ createdAt: -1 }).limit(1);   //to get the latest product added
      } 
  
      res.status(200).json(newBatteryInputs);
    } catch (err) {
      res.status(500).json(err);
    }
});


//history/audit event log
//@Analysing report of battery level inputs for each period (monthly)
//@route /api/audit/:id
//@access Private
router.get("/", protect, async (req, res) => { 
    // res.send("test") 
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const checkBatteryLevels = await Battery.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },   //comparing the income of the last two months
        {
          $project: {
            month: { $month: "$createdAt" },
            batteryLevel: "$battery",
          },
        },
        {
          $group: {   //when we group our data, we sum all the amounts per month
            _id: "$month",
            total: { $sum: "$batteryLevel" },
          },
        },
      ]);
      res.status(200).json(checkBatteryLevels);
    } catch (err) {
      res.status(500).json(err);
    }
}); 




module.exports = router;