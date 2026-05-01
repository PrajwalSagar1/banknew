import mongoose from "mongoose";

// Globals are maintained across serverless invocations for a single container instance
let cached: mongoose.Mongoose | null = null;

const connectDB = async () => {
    if (cached) {
        console.log("Using cached MongoDB connection");
        return cached;
    }

    try {
        console.log("Attempting to connect to MongoDB...");
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI as string
        );
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);

        cached = connectionInstance;
        return connectionInstance;
    } catch (error) {
        console.error("MONGODB connection FAILED ", error);
        // Do not process.exit in serverless environments, throw instead
        throw new Error("Failed to connect to MongoDB");
    }
};

export default connectDB;
