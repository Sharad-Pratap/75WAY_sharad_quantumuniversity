import express, { Request, Response } from 'express';
import productServices from '../helper/productservices'; // Adjust the path to your services file

const router = express.Router();



// Route to get a product by ID
router.get('/products/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const product = await productServices.getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new product
router.post('/products', async (req: Request, res: Response) => {
  const productData = req.body;

  try {
    const newProduct = await productServices.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a product by ID
router.put('/products/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;
  const productData = req.body;

  try {
    const updatedProduct = await productServices.updateProductById(productId, productData);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a product by ID
router.delete('/products/:id', async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await productServices.deleteProductById(productId);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
