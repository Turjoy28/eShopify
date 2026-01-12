import SSLCommerzPayment from "sslcommerz-lts"
import Order from '../models/order.model.js';
import Coupon from '../models/coupons.model.js';

// Initialize SSLCommerz
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

// ========================================
// 1. INITIATE PAYMENT
// ========================================
export const createCheckoutSession = async (req, res) => {
    try {
        const { products, customerInfo, couponCode } = req.body;
        const userId = req.user._id;

        // Validate required fields
        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No products in cart" });
        }

        if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            return res.status(400).json({
                error: "Customer information required: name, email, phone"
            });
        }

        // Calculate total amount
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const amount = item.price * item.quantity;
            totalAmount += amount;

            orderProducts.push({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            });
        }

        // Apply coupon discount if provided
        let discount = 0;
        let finalAmount = totalAmount;
        let appliedCoupon = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({
                code: couponCode,
                userId: userId,
                isActive: true
            });

            if (coupon) {
                // Check if coupon is expired
                if (coupon.expirationDate < new Date()) {
                    coupon.isActive = false;
                    await coupon.save();
                    return res.status(400).json({ error: "Coupon has expired" });
                }

                // Calculate discount
                discount = (totalAmount * coupon.discountPercentage) / 100;
                finalAmount = totalAmount - discount;

                appliedCoupon = {
                    code: coupon.code,
                    discountPercentage: coupon.discountPercentage,
                    discountAmount: discount
                };
            } else {
                return res.status(400).json({ error: "Invalid or inactive coupon code" });
            }
        }

        // Generate unique transaction ID
        const transactionId = `TXN-${Date.now()}-${userId}`;

        // Create order in database with pending status
        const order = new Order({
            user: userId,
            products: orderProducts,
            totalAmount: finalAmount,
            originalAmount: totalAmount,
            sslCommerzTransactionId: transactionId,
            paymentStatus: 'pending',
            paymentGateway: 'sslcommerz',
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            customerAddress: customerInfo.address || '',
            // Add coupon details if applied
            ...(appliedCoupon && {
                couponCode: appliedCoupon.code,
                discountPercentage: appliedCoupon.discountPercentage,
                discountAmount: appliedCoupon.discountAmount,
            }),
        });

        await order.save();

        // TEMPORARY: Use example.com for testing (SSLCommerz accepts this in sandbox)
        // REPLACE WITH NGROK URL WHEN TESTING CALLBACKS
        const baseUrl = process.env.SERVER_URL || 'http://example.com';

        // SSLCommerz Payment Data
        const data = {
            total_amount: finalAmount,
            currency: 'BDT',
            tran_id: transactionId,
            // Temporary URLs - Replace with ngrok URLs for real testing
            success_url: `${baseUrl}/api/payment/success`,
            fail_url: `${baseUrl}/api/payment/fail`,
            cancel_url: `${baseUrl}/api/payment/cancel`,
            ipn_url: `${baseUrl}/api/payment/ipn`,

            shipping_method: 'NO',
            product_name: 'eShop Order',
            product_category: 'Electronic',
            product_profile: 'general',

            // Customer Information
            cus_name: customerInfo.name,
            cus_email: customerInfo.email,
            cus_add1: customerInfo.address || 'Dhaka',
            cus_add2: '',
            cus_city: customerInfo.city || 'Dhaka',
            cus_state: customerInfo.state || 'Dhaka',
            cus_postcode: customerInfo.postcode || '1000',
            cus_country: 'Bangladesh',
            cus_phone: customerInfo.phone,
            cus_fax: '',

            // Shipping Information
            ship_name: customerInfo.name,
            ship_add1: customerInfo.address || 'Dhaka',
            ship_add2: '',
            ship_city: customerInfo.city || 'Dhaka',
            ship_state: customerInfo.state || 'Dhaka',
            ship_postcode: customerInfo.postcode || '1000',
            ship_country: 'Bangladesh',
        };

        // Initialize SSLCommerz
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

        // Initiate payment
        const apiResponse = await sslcz.init(data);

        // SSLCommerz will return a gateway URL
        if (apiResponse.GatewayPageURL) {
            res.status(200).json({
                success: true,
                message: "Payment session created",
                gatewayUrl: apiResponse.GatewayPageURL,
                orderId: order._id,
                paymentDetails: {
                    originalAmount: totalAmount,
                    discountAmount: discount,
                    finalAmount: finalAmount,
                    ...(appliedCoupon && { coupon: appliedCoupon }),
                },
            });
        } else {
            await Order.findByIdAndUpdate(order._id, { paymentStatus: 'failed' });
            res.status(400).json({ error: "Failed to initialize payment" });
        }

    } catch (error) {
        console.error("Payment creation error:", error);
        res.status(500).json({
            error: "Failed to create payment session",
            details: error.message
        });
    }
};

// ========================================
// 2. PAYMENT SUCCESS HANDLER
// ========================================
export const paymentSuccess = async (req, res) => {
    try {
        const { tran_id, val_id } = req.body;

        // Validate payment with SSLCommerz
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id });

        if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
            // Update order status
            const order = await Order.findOneAndUpdate(
                { sslCommerzTransactionId: tran_id },
                { paymentStatus: 'paid' },
                { new: true }
            );

            if (!order) {
                return res.redirect(`${process.env.CLIENT_URL}/payment/error?message=Order not found`);
            }

            // Redirect to success page
            res.redirect(`${process.env.CLIENT_URL}/payment/success?orderId=${order._id}`);
        } else {
            res.redirect(`${process.env.CLIENT_URL}/payment/error?message=Payment validation failed`);
        }

    } catch (error) {
        console.error("Payment success handler error:", error);
        res.redirect(`${process.env.CLIENT_URL}/payment/error?message=Something went wrong`);
    }
};

// ========================================
// 3. PAYMENT FAIL HANDLER
// ========================================
export const paymentFail = async (req, res) => {
    try {
        const { tran_id } = req.body;

        await Order.findOneAndUpdate(
            { sslCommerzTransactionId: tran_id },
            { paymentStatus: 'failed' }
        );

        res.redirect(`${process.env.CLIENT_URL}/payment/failed`);
    } catch (error) {
        console.error("Payment fail handler error:", error);
        res.redirect(`${process.env.CLIENT_URL}/payment/error`);
    }
};

// ========================================
// 4. PAYMENT CANCEL HANDLER
// ========================================
export const paymentCancel = async (req, res) => {
    try {
        const { tran_id } = req.body;

        await Order.findOneAndUpdate(
            { sslCommerzTransactionId: tran_id },
            { paymentStatus: 'cancelled' }
        );

        res.redirect(`${process.env.CLIENT_URL}/payment/cancelled`);
    } catch (error) {
        console.error("Payment cancel handler error:", error);
        res.redirect(`${process.env.CLIENT_URL}/payment/error`);
    }
};

// ========================================
// 5. IPN HANDLER
// ========================================
export const paymentIPN = async (req, res) => {
    try {
        const { tran_id, val_id } = req.body;

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id });

        if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
            await Order.findOneAndUpdate(
                { sslCommerzTransactionId: tran_id },
                { paymentStatus: 'paid' }
            );
        }

        res.status(200).send('IPN received');
    } catch (error) {
        console.error("IPN handler error:", error);
        res.status(500).send('IPN error');
    }
};

// ========================================
// 6. GET ORDER STATUS
// ========================================
export const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        }).populate('products.product');

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json({
            orderId: order._id,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount,
            originalAmount: order.originalAmount,
            discountAmount: order.discountAmount,
            couponCode: order.couponCode,
            discountPercentage: order.discountPercentage,
            products: order.products,
            createdAt: order.createdAt,
        });

    } catch (error) {
        console.error("Get order status error:", error);
        res.status(500).json({ error: "Failed to fetch order status" });
    }
};

export default createCheckoutSession;