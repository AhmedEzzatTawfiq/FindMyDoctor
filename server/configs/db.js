import mongoose from "mongoose";
import dns from "node:dns/promises";


dns.setServers(['8.8.8.8', '1.1.1.1']);


const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Connected to MongoDB")
    })

    mongoose.connection.on('error', (error) => {
        console.log("Error in connecting to MongoDB");
        console.log(error.message);
    })

    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log("Error in connecting to MongoDB");
        console.log(error.message);
    }
};

export default connectDB;