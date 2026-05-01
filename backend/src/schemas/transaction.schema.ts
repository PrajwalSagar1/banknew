import { z } from "zod";

export const depositSchema = z.object({
    amount: z.number().positive("Amount must be greater than zero"),
    description: z.string().min(1, "Description is required"),
});

export const withdrawSchema = z.object({
    amount: z.number().positive("Amount must be greater than zero"),
    description: z.string().min(1, "Description is required"),
});

export const transferSchema = z.object({
    recipientUid: z.string().min(1, "Recipient UID is required"),
    amount: z.number().positive("Amount must be greater than zero"),
    description: z.string().min(1, "Description is required"),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type TransferInput = z.infer<typeof transferSchema>;
