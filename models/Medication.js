//mongoose

const mongoose = require("mongoose"); 

const MedicationSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
    codeId: {
      type: String,
      required: true,
      unique: true,
    },
    weightLimit: {
      type: Number,
      unique: true,
    },
    source: {
      type: String,
    },
    destination: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", MedicationSchema);
