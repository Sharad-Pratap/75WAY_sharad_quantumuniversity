import {v2 as cloudinary} from 'cloudinary';
import { Request,Response } from 'express';
import UserModel from '../db/user';


          
cloudinary.config({ 
  cloud_name: 'di4jyusxf', 
  api_key: '577412118699267', 
  api_secret: 'HiVzZCHnGAWFvnR2-AROJ4wF1rw' 
});



let uploadImage = async (req:Request, res:Response) => {
  try {
        if (req.file) {
          console.log(req.file.path);
          
          const result = await cloudinary.uploader.upload(req.file.path);
          console.log(result);
          res.json({ url: result.secure_url });
        } else {
          res.status(400).json({ message: "No file provided" });
        }
  } catch (error) {
    res.status(400).json({ message: "Image upload failed" });
  }
  
};

export {uploadImage};