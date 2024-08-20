const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true, 
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USer",
  },
  photo: {
    type: String,
    required: true,
  },
  comments: [
    {
      comment: {
        type: String,
      },
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USer",
      },
      createAt: {
        type: Date,
        default: Date.now
      }
    },
  ],
  likes:{
    type:Number
  }
 
},{timestamps: true});

module.exports = mongoose.model("Post", postSchema);
