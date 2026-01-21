import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Tag, X } from "lucide-react";

const GiftCouponCard = () => {
    const [couponCode, setCouponCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { coupon, calculateTotal } = useCartStore();

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("/coupons/validate", { code: couponCode });
            useCartStore.setState({ coupon: response.data });
            calculateTotal();
            toast.success("Coupon applied successfully!");
            setCouponCode("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid coupon code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        useCartStore.setState({ coupon: null });
        calculateTotal();
        toast.success("Coupon removed");
    };

    return (
        <motion.div
            className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-emerald-400" />
                <p className="text-xl font-semibold text-emerald-400">Have a coupon?</p>
            </div>

            {coupon ? (
                <div className="flex items-center justify-between rounded-lg bg-gray-700 p-3">
                    <div>
                        <p className="text-sm text-gray-300">Applied Coupon:</p>
                        <p className="font-semibold text-emerald-400">{coupon.code} - {coupon.discountPercentage}% off</p>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="p-1.5 rounded-md text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <motion.button
                        onClick={handleApplyCoupon}
                        disabled={isLoading}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? "Applying..." : "Apply"}
                    </motion.button>
                </div>
            )}

            <p className="text-xs text-gray-400">
                Enter your coupon code above to get a discount on your order.
            </p>
        </motion.div>
    );
};

export default GiftCouponCard;
