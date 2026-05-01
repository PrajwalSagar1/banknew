import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";

export class TransactionController {
    static async getHistory(req: Request, res: Response) {
        try {
            const transactions = await TransactionService.getTransactions(req.user!.uid);
            return res.status(200).json({
                success: true,
                data: transactions,
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    static async deposit(req: Request, res: Response) {
        try {
            const result = await TransactionService.deposit(req.user!.uid, req.body);
            return res.status(200).json({
                success: true,
                message: "Deposit successful",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async withdraw(req: Request, res: Response) {
        try {
            const result = await TransactionService.withdraw(req.user!.uid, req.body);
            return res.status(200).json({
                success: true,
                message: "Withdrawal successful",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async transfer(req: Request, res: Response) {
        try {
            const result = await TransactionService.transfer(req.user!.uid, req.body);
            return res.status(200).json({
                success: true,
                message: "Transfer successful",
                data: result,
            });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
