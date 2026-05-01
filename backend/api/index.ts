import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import { app } from '../src/app';
import connectDB from '../src/config/db';

export default async function handler(req: Request, res: Response) {
    try {
        // Ensure the database is connected before handling the request
        await connectDB();

        // Pass the request to the Express app
        return app(req, res);
    } catch (error) {
        console.error("Serverless Handler Error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
