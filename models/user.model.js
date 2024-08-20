const mongoose = require("mongoose") 

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    }, 
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
        // required: true
    },

    //adding google id
    googleId: {
        type: String
    },

    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
    ],
    profilepic: {
        type: String,
        default: "no profile pic"
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"USer"
        
    }], 
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:"USer"
        
    }],
  
    chats:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]


},{timestamps:true})

module.exports = mongoose.model("USer", userSchema)