import express from 'express';
import {placeOrder} from '../controllers/orderController';
import checkLogin from '../middleware/checkLogin';

const router = express.Router();

router.post('/placeOrder', checkLogin, placeOrder);


export default router;