import { KodUser, IKodUser } from "../models/kodUser.model";
import { UserToken } from "../models/userToken.model";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { generateAccessToken } from "../utils/generateAccessToken";
import { generateRefreshToken } from "../utils/generateRefreshToken";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

interface AuthResponse {
    user: IKodUser;
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    static async register(input: RegisterInput): Promise<AuthResponse> {
        const { uid, username, email, password, phone, role } = input;

        const existingUid = await KodUser.findOne({ uid });
        if (existingUid) {
            throw new Error("UID already exists");
        }

        const existingUser = await KodUser.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new Error("Email or Username already registered");
        }

        const user = await KodUser.create({
            uid,
            username,
            email,
            password,
            phone,
            role: role || 'Customer',
            balance: 0
        });

        const accessToken = generateAccessToken(user.username, user.role, user.uid);
        const refreshToken = generateRefreshToken(user.uid, user.email, user.role);

        // Store token in UserToken table
        await UserToken.create({
            tid: `TID-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            token: accessToken,
            uid: user.uid,
            expiry: new Date(Date.now() + 15 * 60 * 1000) // 15 mins matching access token
        });

        return { user, accessToken, refreshToken };
    }

    static async login(input: LoginInput): Promise<AuthResponse> {
        const { username, password } = input;

        // Compare username and password from database
        const user = await KodUser.findOne({ username });
        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            throw new Error("Invalid username or password");
        }

        // Generate JWT token
        // username as Subject, role as Claim
        const accessToken = generateAccessToken(user.username, user.role, user.uid);
        const refreshToken = generateRefreshToken(user.uid, user.email, user.role);

        // Store JWT token in UserToken table
        await UserToken.create({
            tid: `TID-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            token: accessToken,
            uid: user.uid,
            expiry: new Date(Date.now() + 15 * 60 * 1000) // 15 mins matching access token
        });

        return { user, accessToken, refreshToken };
    }

    static async refresh(token: string): Promise<{ accessToken: string }> {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as any;

            const user = await KodUser.findOne({ uid: decoded.uid });
            if (!user) {
                throw new Error("User not found");
            }

            const accessToken = generateAccessToken(user.username, user.role, user.uid);

            // Store new access token in UserToken table
            await UserToken.create({
                tid: `TID-REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                token: accessToken,
                uid: user.uid,
                expiry: new Date(Date.now() + 15 * 60 * 1000)
            });

            return { accessToken };
        } catch (error) {
            throw new Error("Invalid or expired refresh token");
        }
    }
}
