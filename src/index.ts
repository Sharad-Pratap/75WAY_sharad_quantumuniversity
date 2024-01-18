import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoutes';
import fileUpload from 'express-fileupload';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import { sendCronMail } from './controllers/sendMailController';
import Product from "./db/productModel";
import cron from 'node-cron';
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from './swagger/swagger';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.Router());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))
app.use("/api-docs" , swaggerUi.serve , swaggerUi.setup(swaggerSpecs));


app.use("/api", authRoute);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);


mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASEURL as string).then(() => {
    console.log("database connection established");
}).catch((error) => {
    console.log(error);
});

// Schedule the task to run every day at 6 PM
cron.schedule('0 18 * * *', async () => {
    
    const products = await Product.find();

    for (const product of products) {
      if (product.quantity < 10) {
  await sendCronMail();
      }}
}, {
  timezone: 'Asia/Kolkata', // Set the timezone to your desired timezone
});


app.listen(3001, ()=>{
    console.log("server running on port 3001");
})
