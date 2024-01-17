import mongoose, { Document, Schema } from 'mongoose';

interface Product extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const productSchema = new Schema<Product>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const ProductModel = mongoose.model<Product>('Product', productSchema);

export default ProductModel;
export {Product};
