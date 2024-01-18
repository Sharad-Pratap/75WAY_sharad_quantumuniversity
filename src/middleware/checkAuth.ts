import { Request, Response } from "express";
import User, { IUser } from "../db/userModel";
import {jwtDecode} from "jwt-decode";

interface MyToken {
    userId: string;
    iat: number;
    exp: number;
    token: string;
}

const roles = ["owner"];


const checkAuth = async (req: Request, res: Response, next: () => void) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
    //Checking the role by firstly revieving the token and then
    //decoding it to verify the role based on email id signed in jwt.
    const decodedToken = jwtDecode<MyToken>(token);
    const _id = decodedToken.userId;
    
    const checkUser: IUser | null = await User.findOne({ _id : _id });

    const role: string = checkUser?.role!;

    if (!roles.includes(role)) {
        return res.status(403).json({ error: "You do not have the permission to visit this page" });
    }
    next();
}
export default checkAuth;
