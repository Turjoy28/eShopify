import express from 'express'
import Products from "../controllers/product.controller.js"
import authMiddleware from '../middleware/auth.middleware.js';
const router=express.Router();

router.get("/",authMiddleware.protectRoute,authMiddleware.adminRoute,Products.getAllProducts);
router.get("/featured",Products.getFeaturedProducts);
router.get("/recommendations",Products.getRecommendations);
router.get("/category/:category",Products.getProductsByCategory);
router.patch("/:id",authMiddleware.protectRoute,authMiddleware.adminRoute,Products.toggleFeaturedProduct);
router.post("/",authMiddleware.protectRoute,authMiddleware.adminRoute,Products.createProduct);
router.delete("/:id",authMiddleware.protectRoute,authMiddleware.adminRoute,Products.deleteProduct);


export default router;