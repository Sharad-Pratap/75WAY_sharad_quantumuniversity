import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

export default mongoose.model<IProduct>('Product', productSchema);