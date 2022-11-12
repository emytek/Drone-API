//mongoose

const mongoose = require("mongoose");

const DeliverSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },

    code: {
      type: String
    },

    state: {
        type: String
    },
  }
);

module.exports = mongoose.model("Deliver", DeliverSchema);

