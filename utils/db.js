const mongoose =require("mongoose")
const mongodbUri = process.env.MONGODB_URI

const dbConnection = async()=>{
    try {
        await mongoose.connect(`${mongodbUri}/instaclone`)
        
    } catch (error) {
        console.log("dbConnection error",error);
    }
}

module.exports = dbConnection