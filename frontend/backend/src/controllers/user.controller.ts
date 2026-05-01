import { Request, Response } from "express";

export class UserController {
    static async getMe(req: Request, res: Response) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - User not found in request",
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    name: user.username,
                    email: user.email,
                    accountNumber: user.phone,
                    balance: user.balance,
                },
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
