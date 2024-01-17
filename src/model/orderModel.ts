import mongoose, { Schema, Document, Types } from 'mongoose';

// Define ObjectId type explicitly
const { ObjectId } = mongoose.Types;


interface Order extends Document {
  product: mongoose.Schema.Types.String;
  quantity: number;
  user: mongoose.Schema.Types.ObjectId;
}

const orderSchema = new Schema<Order>({
  product: { type: String, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  user: { type: ObjectId, ref: 'User', required: true },
});

const OrderModel = mongoose.model<Order>('Order', orderSchema);

export default OrderModel;
export  {Order}
