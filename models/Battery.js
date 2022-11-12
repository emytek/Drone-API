//mongoose

const mongoose = require("mongoose");

const BatterySchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    battery: {
        type: Number,
    },
    state: {
      type: String,   
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model( "Battery", BatterySchema);
