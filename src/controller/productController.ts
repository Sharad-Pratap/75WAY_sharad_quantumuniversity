import { Request, Response } from 'express';
import ProductModel from '../model/productModel';
import productServices from '../helper/productservices';

const addProduct = async (req: Request, res: Response) => {
  try {
    // Extract product details from the request body
    const { name, description, price, quantity, imageUrl } = req.body;

    // Validate input
    if (!name || !description || !price || !quantity || !imageUrl) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new product
    const newProduct = await ProductModel.create({
      name,
      description,
      price,
      quantity,
      imageUrl,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);

    // Check for duplicate key (unique constraint) violation
    // if (error.code === 11000) {
    //   return res.status(400).json({ error: 'Product with the same name already exists' });

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export default addProduct;