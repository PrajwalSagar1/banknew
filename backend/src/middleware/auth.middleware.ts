import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { KodUser, IKodUser } from "../models/kodUser.model";

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: IKodUser;
        }
    }
}

interface DecodedToken {
    sub: string; // username
    uid: string;
    role: string;
}

export const verifyJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request - No token provided",
            });
        }

        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as DecodedToken;

        // Verify using uid stored in token
        const user = await KodUser.findOne({ uid: decodedToken?.uid });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token",
            });
        }

        req.user = user;
        next();
    } catch (error: any) {
        let message = "Invalid Access Token";
        if (error.name === "TokenExpiredError") {
            message = "Access Token Expired";
        }

        return res.status(401).json({
            success: false,
            message,
        });
    }
};
