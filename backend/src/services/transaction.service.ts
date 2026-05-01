import mongoose from "mongoose";
import { KodUser } from "../models/kodUser.model";
import { Transaction } from "../models/transaction.model";
import { DepositInput, WithdrawInput, TransferInput } from "../schemas/transaction.schema";

export class TransactionService {
    static async getTransactions(uid: string) {
        return await Transaction.find({ userId: uid }).sort({ createdAt: -1 });
    }

    static async deposit(uid: string, input: DepositInput) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const user = await KodUser.findOneAndUpdate(
                { uid },
                { $inc: { balance: input.amount } },
                { new: true, session }
            );

            if (!user) throw new Error("User not found");

            const transaction = new Transaction({
                userId: uid,
                type: "credit",
                amount: input.amount,
                description: input.description,
            });
            await transaction.save({ session });

            await session.commitTransaction();
            return { user, transaction };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async withdraw(uid: string, input: WithdrawInput) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const user = await KodUser.findOne({ uid }).session(session);
            if (!user) throw new Error("User not found");

            if (user.balance < input.amount) {
                throw new Error("Insufficient balance");
            }

            user.balance -= input.amount;
            await user.save({ session });

            const transaction = new Transaction({
                userId: uid,
                type: "debit",
                amount: input.amount,
                description: input.description,
            });
            await transaction.save({ session });

            await session.commitTransaction();
            return { user, transaction };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    static async transfer(senderUid: string, input: TransferInput) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const sender = await KodUser.findOne({ uid: senderUid }).session(session);
            if (!sender) throw new Error("Sender not found");

            if (sender.balance < input.amount) {
                throw new Error("Insufficient balance");
            }

            const recipient = await KodUser.findOne({ uid: input.recipientUid }).session(session);
            if (!recipient) {
                throw new Error("Recipient UID not found");
            }

            if (sender.uid === input.recipientUid) {
                throw new Error("Cannot transfer to your own account");
            }

            // Atomic balance updates
            sender.balance -= input.amount;
            recipient.balance += input.amount;
            await sender.save({ session });
            await recipient.save({ session });

            // Create two records
            const transactionSender = new Transaction({
                userId: sender.uid,
                type: "transfer",
                amount: input.amount,
                description: `Transfer to ${recipient.username} (${recipient.uid}): ${input.description}`,
                recipientUid: recipient.uid,
            });
            await transactionSender.save({ session });

            const transactionRecipient = new Transaction({
                userId: recipient.uid,
                type: "transfer",
                amount: input.amount,
                description: `Received from ${sender.username} (${sender.uid}): ${input.description}`,
                recipientUid: sender.uid,
            });
            await transactionRecipient.save({ session });

            await session.commitTransaction();
            return { sender, transaction: transactionSender };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
