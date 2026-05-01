import * as jwt from "jsonwebtoken";

export const generateRefreshToken = (
    uid: string,
    email: string,
    role: string
): string => {
    return jwt.sign(
        {
            uid: uid,
            email: email,
            role: role,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: (process.env.REFRESH_TOKEN_EXPIRY as any) || "7d",
        }
    );
};
