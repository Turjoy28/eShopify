import dotenv from 'dotenv'
import express from "express";
 import authRoutes from "./routes/auth.routes.js"
dotenv.config();


const app=express();










 app.use("/api/auth", authRoutes);





const PORT= process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log( "server is running on http://localhost:" +PORT)
})