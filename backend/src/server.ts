import dotenv from 'dotenv';
// Load environment variables as the first operation
dotenv.config();

import { app } from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

/**
 * Server Bootstrap
 * 1. Connect to Database
 * 2. Start Express Server
 */
const startServer = async () => {
    try {
        console.log("🚀 Starting KodnestBank Backend...");

        // Connect to MongoDB
        await connectDB();

        // Start Listening
        app.listen(PORT, () => {
            console.log(`✅ Server is running at: http://localhost:${PORT}`);
            console.log(`📡 CORS Whitelist: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
        });

    } catch (err) {
        console.error("❌ Fatal Error during server bootstrap:", err);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
});

startServer();
