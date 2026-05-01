import mongoose, { Schema, Document } from "mongoose";

export interface IUserToken extends Document {
    tid: string;
    token: string;
    uid: string; // References the uid from KodUser
    expiry: Date;
    createdAt: Date;
}

const userTokenSchema = new Schema<IUserToken>(
    {
        tid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        uid: {
            type: String,
            required: true,
            trim: true,
        },
        expiry: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

// Optional: Add a TTL index to automatically remove tokens from DB once they expire
userTokenSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

export const UserToken = mongoose.model<IUserToken>("UserToken", userTokenSchema);
