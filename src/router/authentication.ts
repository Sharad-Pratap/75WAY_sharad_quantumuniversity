import { Request, Response } from 'express';
import express from 'express';
import userController from '../controller/userController';
import addProduct from "../controller/productController"
import productServices from '../helper/productservices';
import { placeOrder } from '../controller/orderController';
import { getAllUsers } from '../controller/users';
import { sendCronMail } from '../controller/sendMail';
import { upload } from '../helper/uploadmulter';
import { uploadImage } from '../helper/uploadcoudinary';
import { isAuthenticated } from '../middleware';


const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/addproduct', addProduct);
router.post('/placeorder', placeOrder);
router.get('/users', getAllUsers )
router.post('/sendmail', sendCronMail);

router.post("/upload", isAuthenticated,upload.single('image'),uploadImage )

router.get('/products', async (req: Request, res: Response) => {
    try {
      const products = await productServices.getProducts();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


export default router;