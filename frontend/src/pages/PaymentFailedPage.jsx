import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from "lucide-react";

const PaymentFailedPage = () => {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-xl mx-auto">
                <motion.div
                    className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Failed Icon */}
                    <motion.div
                        className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                    >
                        <XCircle className="w-12 h-12 text-red-500" />
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Payment Failed
                    </motion.h1>

                    <motion.p
                        className="text-gray-400 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Unfortunately, your payment could not be processed. Please try again.
                    </motion.p>

                    {/* Possible Reasons */}
                    <motion.div
                        className="bg-gray-700/50 rounded-lg p-6 mb-6 text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <HelpCircle className="text-yellow-400" size={20} />
                            Possible Reasons
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                Insufficient balance in your account
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                Card declined by your bank
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                Network connectivity issue during transaction
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                Payment session expired
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400">•</span>
                                Incorrect payment details entered
                            </li>
                        </ul>
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
                            <RefreshCw size={20} />
                            Try Again
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Home
                        </Link>
                    </motion.div>

                    {/* Support Note */}
                    <motion.p
                        className="text-gray-500 text-sm mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        If the problem persists, please contact our support team.
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
