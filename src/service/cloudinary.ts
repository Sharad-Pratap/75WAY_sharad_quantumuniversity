import { Request, Response } from "express";
import { UserRequest } from "../helper/auth";
import { v2 as cloudinary } from "cloudinary";
import multer = require("multer");


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


const image_url =  async (req: UserRequest, res: Response) => {

      // Multer configuration
      const storage = multer.memoryStorage();
      const upload = multer({ storage: storage });
  
      // Use multer middleware to handle file uploads
      const uploadMiddleware = upload.array("photo");
  
      uploadMiddleware(req, res, async (err) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res.status(500).json("Failed to upload photo");
        }
  
        const files = req.files as unknown as Express.Multer.File[];
  
        // upload image to Cloudinary
        const uploadPromises = files.map((file) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
              if (error) {
                console.error("Error uploading image to Cloudinary:", error);
                reject(error);
              } else {
                console.log(result);
                resolve(result);
              }
            });
  
            // Pipe the file buffer to the Cloudinary upload stream
            stream.write(file.buffer);
            stream.end();
          });
        });
  
        try {
          const cloudinaryResults = await Promise.all(uploadPromises);
  
          if (!cloudinaryResults || cloudinaryResults.length === 0) {
            return res.status(500).json("Failed to upload photo to Cloudinary");
          }
  
          // Assert the type for each element
          const firstCloudinaryResult = cloudinaryResults[0] as CloudinaryResult;
  
          const image_url = firstCloudinaryResult?.secure_url;
          console.log("image_url",image_url);
          res.status(200).json(image_url);
        } catch (error) {
          console.error("Error storing image URL in PostgreSQL:", error);
          res.status(500).json({ error: "Error storing image URL in database" });
        }
      });
    };
  
  
  export default image_url;