//mongoose

const mongoose = require("mongoose");

const DetailsSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },

    code: {
      type: String
    },
    name: {
      type: String,
      default: 1
    },
    weight: {
      type: Number,
      default: 1
    },
    image: {
      type: String,
      default: 1
    },
    state: {
      type: String
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model("Details", DetailsSchema);
