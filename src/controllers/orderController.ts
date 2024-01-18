import { Request, Response } from "express";
import Product, {IProduct} from '../db/productModel';
import Order , {IOrder} from "../db/orderModel";
import { jwtDecode } from "jwt-decode";
import User, {IUser} from "../db/userModel";

interface Token {
    "userId": string;
    "iat": number;
    "exp": number;
    "token" : string;
  } 

export const placeOrder = async (req: Request, res: Response) => {
    try {
        
        //fetching userId from token
        const token = req.cookies.accessToken;

        const decodedToken = jwtDecode<Token>(token);
        const _id = decodedToken.userId;

        const userData : IUser | null = await User.findOne({_id : _id});
        const username = userData?.name;

        const {product_name, quantity} = req.body;
        
        const product : IProduct | null = await Product.findOne({name:product_name})
        
        //checking if product exist
        if(!product){
            return res.status(402).json({
                error:'product doesnot exist'
            });
        }

        //checking if product is not in stock 
        if(product.quantity < quantity){
            return res.status(402).json({
                error:'Buy quantity exceeds stock quantity'
            });
        }
 
        product.quantity=product.quantity-quantity;
        await product.save();


        const newOrder : IOrder  = new Order({
            product : product_name,
            quantity : quantity,
            user : username
        });
        const result = await newOrder.save();
        
        res.status(201).json({"Order Detail" : result});
    }catch(error){
        console.error(`Error: ${error}`);
        res.status(500).json({error:'failed to buy product'});
    }
}