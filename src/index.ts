import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './router/authentication'
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();



const app: Application = express();

app.use(cors({
    credentials: true,
}));

app.use(bodyParser.json());

app.use(express.json());

app.use('/', userRoutes );
app.listen(3000, () => {
    console.log("server running on port 3000");
});

mongoose.Promise = Promise;

mongoose.connect(process.env.DATABASEURL as string).then(() => {
    console.log("database connection established");
}).catch((error) => {
    console.log(error);
});

import cron from 'node-cron';
import { sendCronMail } from './controller/sendMail'; // Update this import based on your file structure
import ProductModel from './model/productModel';

// Schedule the task to run every day at 6 PM
cron.schedule('0 18 * * *', async () => {
    
    const products = await ProductModel.find();

    for (const product of products) {
      if (product.quantity < 10) {
  await sendCronMail();
      }}
}, {
  timezone: 'Asia/Kolkata', // Set the timezone to your desired timezone
});



