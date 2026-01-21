import dotenv from 'dotenv'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import cookieParser from 'cookie-parser';
import productRoute from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import couponRoutes from "./routes/coupons.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import analyticsRoutes from "./routes/analytics.routes.js"


const app=express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));









app.use(express.json({limit:"50mb"}));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics",analyticsRoutes)

const PORT= process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log( "server is running on http://localhost:" +PORT)
    connectDB();

})