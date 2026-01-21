import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ban, ShoppingCart, ArrowLeft, Clock } from "lucide-react";

const PaymentCancelledPage = () => {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-xl mx-auto">
                <motion.div
                    className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Cancelled Icon */}
                    <motion.div
                        className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                    >
                        <Ban className="w-12 h-12 text-yellow-500" />
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Payment Cancelled
                    </motion.h1>

                    <motion.p
                        className="text-gray-400 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        You have cancelled the payment process. Your cart items are still saved.
                    </motion.p>

                    {/* Info Box */}
                    <motion.div
                        className="bg-gray-700/50 rounded-lg p-6 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center justify-center gap-3 text-yellow-400 mb-3">
                            <Clock size={24} />
                            <span className="text-lg font-semibold">No Worries!</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your shopping cart has been preserved. You can return anytime to complete your purchase.
                            No charges have been made to your account.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link
                            to="/cart"
                            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <ShoppingCart size={20} />
                            Return to Cart
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Continue Shopping
                        </Link>
                    </motion.div>

                    {/* Support Note */}
                    <motion.p
                        className="text-gray-500 text-sm mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        Changed your mind? Browse our collection and find something you love.
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentCancelledPage;
