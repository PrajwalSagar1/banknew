import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const result = await AuthService.register(req.body);

            // Set cookies
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            });
        } catch (error: any) {
            return res.status(error.message.includes("exists") || error.message.includes("registered") ? 409 : 400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async login(req: Request, res: Response) {
        // 1. Get data from request (handled by AuthService as well, but here we invoke it)
        try {
            const result = await AuthService.login(req.body);

            // 5. Send token to client (store in cookie)
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
            });

            // 6. Send success response
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            });
        } catch (error: any) {
            // If login fails → send error message
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async refresh(req: Request, res: Response) {
        try {
            const token = req.body.refreshToken || req.cookies.refreshToken;

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Refresh token is required",
                });
            }

            const result = await AuthService.refresh(token);

            res.cookie("accessToken", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 15 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async logout(req: Request, res: Response) {
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
}
