import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    accountNumber: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
        },
        accountNumber: {
            type: String,
            required: true,
            unique: true,
            minlength: [12, "Account number must be 12 digits"],
            maxlength: [12, "Account number must be 12 digits"],
        },
        balance: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!(this as any).isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        (this as any).password = await bcrypt.hash((this as any).password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, (this as any).password);
};

// Ensure password is not returned in JSON
userSchema.set("toJSON", {
    transform: (_, ret) => {
        delete (ret as any).password;
        return ret;
    },
});

export const User = mongoose.model<IUser>("User", userSchema);
