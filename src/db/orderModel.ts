import mongoose, { Schema, Document, Types } from 'mongoose';




export interface IOrder extends Document {
  product: mongoose.Schema.Types.String;
  quantity: number;
  user: mongoose.Schema.Types.ObjectId;  //! check for future reference here objectId is written
}

const orderSchema = new Schema<IOrder>({
  product: { type: String, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  user: { type: String, ref: 'User', required: true },
});

export default mongoose.model<IOrder>('Order', orderSchema);


