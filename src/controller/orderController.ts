import { Request, Response } from "express";
import { getUserById } from '../db/user'
import ProductModel from "../model/productModel";


export const placeOrder = async (req: any, res: Response) => {
    try {
        

        const user = await getUserById;
        console.log(user);
        if(!user){
            return res.status(402).json({
                error:'user does not exists'
            })
        }
        const product_name=req.body.name;
        console.log(product_name)
        const quantity=req.body.quantity;
        console.log(quantity);

        const product=await ProductModel.findOne({name:product_name})
 
        if(!product){
            return res.status(402).json({
                error:'product doesnot exist'
            });
        }
        if(product.quantity < quantity){
            return res.status(402).json({
                error:'buy quantity exceeds stock quantity'
            });
        }
 
        product.quantity=product.quantity-quantity;
 
        const updateProduct = await product.save();
        console.log('Product Update: ', updateProduct);
        res.status(201).json({product:updateProduct});
    }catch(error){
        console.error(`Error: ${error}`);
        res.status(500).json({error:'failed to buy product'});
    }
}