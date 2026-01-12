import express from "express";
import {
    createCheckoutSession,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN,
    getOrderStatus
} from "../controllers/payment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create payment session (protected - user must be logged in)
router.post("/create-checkout-session",authMiddleware.protectRoute, createCheckoutSession);

// SSLCommerz callback URLs (NOT protected - SSLCommerz calls these)
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);

// Get order status (protected - user must be logged in)
router.get("/order/:orderId", authMiddleware.protectRoute, getOrderStatus);

export default router;