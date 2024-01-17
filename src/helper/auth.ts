
import { Request } from "express";
import dotenv from 'dotenv';
import jwt, { JsonWebTokenError, JwtPayload, VerifyCallback } from "jsonwebtoken";

dotenv.config();

export interface UserRequest<T = {}> extends Request<T> {
  [x: string]: any;
  user?: {
    _id: string; // Assuming MongoDB ObjectIds are used, which are strings
  };
}

const accessTokenSecret = process.env.access_token_secret ?? '';
const refreshTokenSecret = process.env.refresh_token_secret ?? '';

export const generateAccessToken = (_id: string) => {
  return jwt.sign({ _id: _id }, accessTokenSecret, { expiresIn: "15m" });
};

export const generateRefreshToken = (_id: string) => {
  return jwt.sign({ _id }, refreshTokenSecret, { expiresIn: "7d" });
};

export const generateTokens = (_id: string) => {
  const accessToken = generateAccessToken(_id);
  const refreshToken = generateRefreshToken(_id);
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (refreshToken: string): string => {
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as JwtPayload;
    return decoded._id;
  } catch (error) {
    console.error("Error during token verification:", error);
    throw new Error("Invalid refresh token");
  }
};

export const verifyAccessToken = (accessToken: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    const callback: VerifyCallback = (
      err: JsonWebTokenError | null,
      decoded: JwtPayload | string | object | undefined
    ) => {
      if (err) {
        console.log("error coming karan", err);
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    };

    jwt.verify(accessToken, accessTokenSecret, callback);
  });
};

export const authenticateToken = async (req: any, res: any, next: any) => {
  const accessToken = req.cookies.accessToken;
  console.log(accessToken);
  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await verifyAccessToken(accessToken);
    req.user = { user_id: user.user_id };
    console.log(req.user);
    next();
  } catch (error) {
    console.error("Error verifying access token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
