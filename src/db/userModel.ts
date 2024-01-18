import mongoose, { Document, Schema } from 'mongoose';


export interface IUser extends Document {
  name: string;
  gender: string;
  age: number;
  mobile: string;
  email: string;
  profilePicture: string;
  role: string;
  password : string;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, required: true },
  role: { type: String, enum: ['customer', 'owner'], required: true },
  password : { type : String, required : true },
});

export default mongoose.model<IUser>('User', userSchema);

