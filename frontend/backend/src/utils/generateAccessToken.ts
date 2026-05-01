import * as jwt from "jsonwebtoken";

export const generateAccessToken = (
    username: string,
    role: string,
    uid: string
): string => {
    return jwt.sign(
        {
            sub: username,
            role: role,
            uid: uid
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: (process.env.ACCESS_TOKEN_EXPIRY as any) || "15m",
        }
    );
};
