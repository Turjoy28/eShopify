import express from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import coupon from "../controllers/coupon.controller.js"
const router=express.Router();

router.get("/",authMiddleware.protectRoute,coupon.getCoupon);
router.get("/validate",authMiddleware.protectRoute,coupon.validateCoupon);

export default router;