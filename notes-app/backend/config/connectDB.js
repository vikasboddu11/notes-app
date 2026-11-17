const mongoose = require("mongoose")

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be configured")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error("MongoDB connection failed:", error.name)
        throw new Error("Unable to connect to MongoDB")
    }

    console.log("MongoDB connected successfully")
}

module.exports = connectDB