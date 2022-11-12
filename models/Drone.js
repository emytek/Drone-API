//mongoose

const mongoose = require("mongoose");

const DroneSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    model: {
      type: String,
      unique: true,
    },
    weightLimit: {
      type: Number,
    },
    battery: {
      type: Number,
    },
   state: {
    type: String,
   },
   isAdmin: {
    type: Boolean,
    default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drone", DroneSchema);

//type: mongoose.Types.ObjectId
//const Appoitment = mongoose.model('Appoitment', Appointment);
//module.exports = { Appoitment };