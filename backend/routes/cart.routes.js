import express from "express"
import cart from "../controllers/cart.controller.js"
import authMiddleware from "../middleware/auth.middleware.js";
const router=express.Router();


router.get("/",authMiddleware.protectRoute,cart.getCartProducts);
router.post("/",authMiddleware.protectRoute,cart.addToCart);
router.delete("/",authMiddleware.protectRoute,cart.removeAllCart);
router.put("/:id",authMiddleware.protectRoute,cart.updateQuantity);

export default router;
