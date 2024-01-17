import { Request, Response } from "express";
// import userService from "../services/userService";
import {v2 as cloudinary} from 'cloudinary';
import bcrypt from "bcrypt";
import { createUser, getUserByEmail, getUsers } from "../db/user";
import userModel from "../db/user"


import {
  UserRequest,
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyRefreshToken,
} from "../helper/auth";

cloudinary.config({ 
  cloud_name: 'dmdgpmdn4', 
  api_key: '487479267911425', 
  api_secret: '-4lMVvd_HbihH-x6bmgxPwNWBupI' 
});
interface UserController {
  register: (req: Request, res: Response) => Promise<void>;
  login: (req: Request, res: Response) => Promise<void>;
  refreshToken: (req: Request, res: Response) => Promise<void>;
  getUsers: (req: Request, res: Response) => Promise<void>;
  // getProfile: (req: Request, res: Response) => Promise<void>;
}

type CloudinaryResult = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
  api_key: string;
};

const userController = {
  register: async (req: UserRequest, res: Response) => {
    try {
      const { name,
        gender,
        age,
        mobile,
        email,
        profilePicture,
        address,
        role,
        password } = req.body;

      // checking if user already exists.
      const existingUser = await getUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ error: "User exists already" });
      }

      // Check if req.files and req.files.profilePicture are defined
    // if (!req.files || !req.files.profilePicture) {
    //   return res.status(400).json("Please provide a 'profilePicture' file");
    // }

    // const files = Array.isArray(req.files.profilePicture) ? req.files.profilePicture : [req.files.profilePicture];

      if (!name || !gender || !age || !mobile || !email || !address ||!role || !password || !profilePicture) {
        return res.status(400).json({ error: "All fields are required" });
      }

   

      // password hashing
      const hashedPassword = await bcrypt.hash(password, 10);



      // Saving user data to the database
      const newUser = await createUser({
        name,
        gender,
        age,
        mobile,
        email,
        profilePicture,
        address,
        role,
        password:hashedPassword
      }
      );
      console.log(newUser._id);
      // Generating tokens
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      // res.status(201).json({ user: newUser, accessToken, refreshToken });
      res.status(200).json("User registrered successfully");
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      console.log(email);
      console.log(password);

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      

      // Checking if the user exists
      const user = await userModel.findOne({email});
      console.log("this is email");
     
      console.log(password);
      if (!user) {
        console.log("this is password", password);
        return res.status(401).json({ error: "Invalid email" });
      }

      // Checking if the provided password matches the hashed password in the database
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );
      if (!passwordMatch) {
        console.log("another one",password)
        console.log("this is user password",user.password);
        return res.status(401).json({ error: "Invalid password" });
      }

      // Generating tokens
      const { accessToken, refreshToken } = generateTokens(user._id);
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      res.json("logged in success");

      // res.json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getAllUsers: async (req: Request, res: Response) => {
    try {
      const allUsers = await getUsers();
      res.json(allUsers);
    } catch (error) {
      console.error("Error retrieving all users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // getProfile: async (req: Request, res: Response) => {
  //   try {rs
  //     // Accessing the user ID from the decoded access token
  //     const userId = req.user?.userId;
  //     console.log("UserID", userId);

  //     // Fetching the user profile based on the user ID
  //     if (userId !== undefined) {
  //       const userProfile = await userService.getProfile(userId);
  //       console.log("UserProfile", userProfile);
  //       if (!userProfile) {
  //         return res.status(404).json({ error: "User not found" });
  //       }

  //       res.json(userProfile);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user profile:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // },

    
};

export default userController;
