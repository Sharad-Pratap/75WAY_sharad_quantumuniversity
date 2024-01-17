import ProductModel, {Product} from '../model/productModel';
import express from 'express';

const productServices = {
  getProducts: async (): Promise<Product[]> => {
    try {
      // Fetch your products from the MongoDB database
      const products: Product[] = await ProductModel.find();
      console.log(products);  // displaying the products in console
      return products;
    } catch (error) {
      throw error;
    }
    
  },
      getProductById : async (_id: string): Promise<Product | null> => {
        try {
          const product = await ProductModel.findById(_id);
          return product;
        } catch (error) {
          throw error;
        }
      },
      createProduct : async (values: Record<string, any>): Promise<Product> => {
        try {
          const product = await new ProductModel(values).save();
          return product.toObject();
        } catch (error) {
          throw error;
        }
      },
      deleteProductById : async (id: string): Promise<Product | null> => {
        try {
          const deletedProduct = await ProductModel.findOneAndDelete({ _id: id });
          return deletedProduct;
        } catch (error) {
          throw error;
        }
    },
    updateProductById : async (_id: string, values: Record<string, any>): Promise<Product | null> => {
        try {
          const updatedProduct = await ProductModel.findByIdAndUpdate(_id, values, { new: true });
          return updatedProduct;
        } catch (error) {
          throw error;
        }
      }




}
export default productServices;
export {};
