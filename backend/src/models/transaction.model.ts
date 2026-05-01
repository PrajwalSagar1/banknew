import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
    userId: string; // The uid from KodUser
    type: "credit" | "debit" | "transfer";
    amount: number;
    description: string;
    recipientUid?: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["credit", "debit", "transfer"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        recipientUid: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Transaction = mongoose.model<ITransaction>(
    "Transaction",
    transactionSchema
);
