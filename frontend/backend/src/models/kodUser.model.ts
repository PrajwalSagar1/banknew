import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IKodUser extends Document {
    uid: string;
    username: string;
    email: string;
    password: string;
    balance: number;
    phone: string;
    role: 'Customer' | 'Manager' | 'Admin';
    createdAt: Date;
    updatedAt: Date;
    isPasswordCorrect(password: string): Promise<boolean>;
}

const kodUserSchema = new Schema<IKodUser>(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        username: {
            type: String,
            required: [true, "Username is required"],
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
        balance: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        role: {
            type: String,
            enum: ['Customer', 'Manager', 'Admin'],
            default: 'Customer',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
kodUserSchema.pre("save", async function (next) {
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
kodUserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, (this as any).password);
};

// Ensure password is not returned in JSON
kodUserSchema.set("toJSON", {
    transform: (_, ret) => {
        delete (ret as any).password;
        return ret;
    },
});

export const KodUser = mongoose.model<IKodUser>("KodUser", kodUserSchema);
