import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import Confetti from "react-confetti";

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(true);
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Clear the cart after successful payment
        clearCart();

        // Hide confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, [clearCart]);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/payment/order/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-4">
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.1}
                />
            )}

            <div className="max-w-2xl mx-auto">
                <motion.div
                    className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Success Icon */}
                    <motion.div
                        className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                    >
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Payment Successful!
                    </motion.h1>

                    <motion.p
                        className="text-gray-400 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Thank you for your purchase. Your order has been confirmed.
                    </motion.p>

                    {/* Order Details */}
                    {order && (
                        <motion.div
                            className="bg-gray-700/50 rounded-lg p-6 mb-6 text-left"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Package className="text-emerald-400" size={20} />
                                Order Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Order ID</span>
                                    <span className="text-white font-mono">{order.orderId}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Status</span>
                                    <span className="text-emerald-400 font-semibold capitalize">
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                {order.originalAmount !== order.totalAmount && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Original Amount</span>
                                            <span className="text-gray-300 line-through">
                                                ৳{order.originalAmount?.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">
                                                Discount ({order.couponCode})
                                            </span>
                                            <span className="text-emerald-400">
                                                -৳{order.discountAmount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <div className="border-t border-gray-600 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-white font-semibold">Total Paid</span>
                                        <span className="text-emerald-400 font-bold text-lg">
                                            ৳{order.totalAmount?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Date</span>
                                    <span className="text-white">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Products List */}
                            {order.products && order.products.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-600">
                                    <h3 className="text-sm font-medium text-gray-300 mb-2">Items Ordered</h3>
                                    <div className="space-y-2">
                                        {order.products.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-400">
                                                    {item.product?.name || "Product"} × {item.quantity}
                                                </span>
                                                <span className="text-white">
                                                    ৳{(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <ShoppingBag size={20} />
                            Continue Shopping
                        </Link>

                        <Link
                            to="/orders"
                            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            View Orders
                            <ArrowRight size={20} />
                        </Link>
                    </motion.div>

                    {/* Email Notification */}
                    <motion.p
                        className="text-gray-500 text-sm mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        A confirmation email has been sent to your email address.
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
