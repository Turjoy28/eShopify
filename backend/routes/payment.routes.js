import express from "express";
import {
    createCheckoutSession,
    createCODOrder,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    paymentIPN,
    getOrderStatus,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder
} from "../controllers/payment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create payment session (SSLCommerz)
router.post("/create-checkout-session", authMiddleware.protectRoute, createCheckoutSession);

// Create Cash on Delivery order
router.post("/create-cod-order", authMiddleware.protectRoute, createCODOrder);

// SSLCommerz callback URLs (NOT protected - SSLCommerz calls these)
router.post("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.post("/ipn", paymentIPN);

// Customer order routes (protected - user must be logged in)
router.get("/my-orders", authMiddleware.protectRoute, getMyOrders);
router.get("/order/:orderId", authMiddleware.protectRoute, getOrderStatus);

// Admin order management routes (protected - Admin only)
router.get("/admin/orders", authMiddleware.protectRoute, authMiddleware.adminRoute, getAllOrders);
router.patch("/admin/orders/:orderId/status", authMiddleware.protectRoute, authMiddleware.adminRoute, updateOrderStatus);
router.patch("/admin/orders/:orderId/payment-status", authMiddleware.protectRoute, authMiddleware.adminRoute, updatePaymentStatus);
router.delete("/admin/orders/:orderId", authMiddleware.protectRoute, authMiddleware.adminRoute, deleteOrder);

export default router;