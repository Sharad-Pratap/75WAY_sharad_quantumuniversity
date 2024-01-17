import mongoose, { Document, Schema } from 'mongoose';


interface User extends Document {
  name: string;
  gender: string;
  age: number;
  mobile: string;
  email: string;
  profilePicture: string;
  address: string;
  role: string;
  password : string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, required: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['customer', 'owner'], required: true },
  password : { type : String, required : true },
});

const UserModel = mongoose.model<User>('User', userSchema);


export const getUsers = () => UserModel.find();
export const getUserByEmail = (email : string) => UserModel.findOne({ email });
export const getUserById = (id:String) => UserModel.findById(id);
export const createUser = (values : Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id:id});
export const updateUserById = (id: string, values: Record<string,any>) => UserModel.findByIdAndUpdate(id,values);
export default UserModel;