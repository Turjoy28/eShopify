import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { CreditCard, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
    const { cart, total, subtotal, coupon, clearCart } = useCartStore();
    const { user } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);

    const [customerInfo, setCustomerInfo] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "Dhaka",
        state: "Dhaka",
        postcode: "1000",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        // Validate required fields
        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!customerInfo.phone.match(/^01[3-9]\d{8}$/)) {
            toast.error("Please enter a valid Bangladesh phone number");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare products data
            const products = cart.map((item) => ({
                productId: item._id,
                price: item.price,
                quantity: item.quantity,
            }));

            // Create checkout session
            const response = await axios.post("/payment/create-checkout-session", {
                products,
                customerInfo,
                couponCode: coupon?.code || null,
            });

            if (response.data.success && response.data.gatewayUrl) {
                // Redirect to SSLCommerz payment gateway
                window.location.href = response.data.gatewayUrl;
            } else {
                toast.error("Failed to initiate payment");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error.response?.data?.error || "Failed to process checkout");
        } finally {
            setIsLoading(false);
        }
    };

    const savings = subtotal - total;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-16">
                <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
                <Link
                    to="/"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Cart
                </Link>

                <motion.h1
                    className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    Checkout
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Customer Information */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Customer Details Form */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <Truck className="text-emerald-400" size={24} />
                                Shipping Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customerInfo.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={customerInfo.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={customerInfo.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="01XXXXXXXXX"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Bangladesh mobile number</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Delivery Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={customerInfo.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        placeholder="Enter your full address"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={customerInfo.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Postcode
                                        </label>
                                        <input
                                            type="text"
                                            name="postcode"
                                            value={customerInfo.postcode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods Info */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="text-emerald-400" size={24} />
                                Payment Methods
                            </h2>
                            <p className="text-gray-400 text-sm mb-4">
                                You will be redirected to SSLCommerz secure payment gateway
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                {["bKash", "Nagad", "Rocket", "VISA", "MasterCard"].map((method) => (
                                    <div
                                        key={method}
                                        className="bg-gray-700 rounded-lg p-2 text-center text-xs text-gray-300 border border-gray-600"
                                    >
                                        {method}
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500 text-xs mt-3">
                                + Bank Transfer, Mobile Banking & More
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Column - Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-24">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                {cart.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-2"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">
                                                Qty: {item.quantity} × ৳{item.price}
                                            </p>
                                        </div>
                                        <p className="text-sm font-medium text-emerald-400">
                                            ৳{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-gray-700 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>৳{subtotal.toFixed(2)}</span>
                                </div>

                                {savings > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Discount {coupon && `(${coupon.code})`}</span>
                                        <span>-৳{savings.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>

                                <div className="border-t border-gray-700 pt-2 mt-2">
                                    <div className="flex justify-between text-white font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-emerald-400">৳{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <motion.button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Pay ৳{total.toFixed(2)} Securely
                                    </>
                                )}
                            </motion.button>

                            {/* Security Note */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 text-xs">
                                <ShieldCheck size={14} />
                                <span>Secured by SSLCommerz</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
