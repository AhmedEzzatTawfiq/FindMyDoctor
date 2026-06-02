import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error("MONGO_URI is not set in environment variables");
    }

    mongoose.connection.on("connected", () => console.log("Database connected"));
    mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));
    mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err.message));

    await mongoose.connect(mongoUri, {
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connection established successfully");
};

export default connectDB;