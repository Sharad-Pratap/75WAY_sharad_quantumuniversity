import { Request, Response } from "express";
import Product, { IProduct } from "../db/productModel";
import { UploadedFile } from "express-fileupload";
import cloudinary from "../cloudinary/config";
import { UploadApiResponse } from "cloudinary";

// adding a product

export const addProduct = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const file = req.files.imageUrl as UploadedFile;

    if (!file.tempFilePath) {
      return res.status(500).json({ error: "Temporary file path is missing." });
    }

    // Upload file to Cloudinary
    const result: UploadApiResponse = await cloudinary.uploader.upload(
      file.tempFilePath,
      {
        resource_type: "auto",
        public_id: file.name.substring(0, file.name.lastIndexOf(".")),
      }
    );

    // Create a new product
    const newProduct: IProduct = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      imageUrl: result.secure_url,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);

    // Check for duplicate key (unique constraint) violation
    // if (error.code === 11000) {
    //   return res.status(400).json({ error: 'Product with the same name already exists' });

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// getting products

export const getProduct = async (req: Request, res: Response) => {
  try {
    const productName = req.body.name;

    if (!productName) {
      res.json({ message: "Enter the product the name" });
      return;
    }

    const data: IProduct | null = await Product.findOne({ name: productName });

    if (!data) {
      res.json({ message: "Product does not exist" });
      return;
    }

    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e });
  }
};

export const getAllProducts = async () => {
  try {
    // Fetch your products from the MongoDB database
    const products: IProduct[] = await Product.find();
    console.log(products); // displaying the products in console
    return products;
  } catch (error) {
    throw error;
  }
};
