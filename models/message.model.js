const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true, 
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USer",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Message", messageSchema);
