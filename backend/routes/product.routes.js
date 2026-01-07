import express from 'express'
import Products from "../controllers/product.controller.js"
const router=express.Router();

router.get("/",protectRoute,adminRoute,Products.getAllProducts);