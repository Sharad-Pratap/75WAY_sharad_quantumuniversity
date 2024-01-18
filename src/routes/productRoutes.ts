import express from 'express';
import {addProduct, getProduct} from '../controllers/productController';
import checkLogin from '../middleware/checkLogin';
import checkAuth from '../middleware/checkAuth';

const router = express.Router();

router.post('/addProduct',checkLogin, checkAuth, addProduct);
router.get('/getProduct', getProduct)

export default router;