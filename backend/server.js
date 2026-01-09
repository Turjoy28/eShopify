import dotenv from 'dotenv'
import express from "express";
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from 'cookie-parser';
import productRoute from "./routes/product.routes.js "
import cartRoutes from "./routes/cart.routes.js"
import couponRoutes from "./routes/coupons.routes.js"

 dotenv.config();


const app=express();









app.use(express.json());
 app.use(cookieParser());
 app.use("/api/auth", authRoutes);
 app.use("/api/products", productRoute);
 app.use("/api/cart",cartRoutes );
 app.use("api/coupons",couponRoutes);



const PORT= process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log( "server is running on http://localhost:" +PORT)
    connectDB();

})