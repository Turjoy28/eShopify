import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight,
    ShoppingBag,
    MapPin,
    Phone,
    Calendar,
    CreditCard,
    Banknote,
    Receipt,
} from "lucide-react";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const res = await axios.get("/payment/my-orders");
                setOrders(res.data.orders || []);
            } catch (error) {
                console.error("Failed to fetch customer orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case "delivered":
                return {
                    label: "Delivered",
                    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
                    step: 4,
                    icon: CheckCircle2,
                };
            case "shipped":
                return {
                    label: "Shipped",
                    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
                    step: 3,
                    icon: Truck,
                };
            case "processing":
                return {
                    label: "Processing",
                    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
                    step: 2,
                    icon: Clock,
                };
            case "cancelled":
                return {
                    label: "Cancelled",
                    color: "text-red-400 bg-red-500/10 border-red-500/30",
                    step: 0,
                    icon: XCircle,
                };
            default:
                return {
                    label: "Order Placed",
                    color: "text-gray-400 bg-gray-500/10 border-gray-500/30",
                    step: 1,
                    icon: Clock,
                };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-gray-400">Loading your orders...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen py-20 px-4">
                <div className="max-w-2xl mx-auto text-center bg-gray-800 rounded-2xl p-10 border border-gray-700 shadow-xl">
                    <div className="w-20 h-20 bg-gray-700/60 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={36} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">No orders placed yet</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
                        You haven't bought anything yet! Explore our collection and find something you love.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
                    >
                        Start Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-800 pb-6"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <Package className="text-emerald-400" size={32} />
                            My Orders
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Track your deliveries and view your purchase history
                        </p>
                    </div>
                    <span className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1.5 rounded-full self-start font-medium">
                        {orders.length} {orders.length === 1 ? "Order" : "Orders"} Placed
                    </span>
                </motion.div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order, idx) => {
                        const statusInfo = getStatusInfo(order.orderStatus);
                        const isCOD = order.paymentGateway === "cod";
                        const isPaid = order.paymentStatus === "paid";
                        const formattedId =
                            order.sslCommerzTransactionId || `ORD-${order._id.slice(-8).toUpperCase()}`;

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl"
                            >
                                {/* Order Card Header */}
                                <div className="bg-gray-900/70 p-5 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs font-bold text-white bg-gray-800 border border-gray-700 px-2.5 py-1 rounded">
                                                {formattedId}
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
                                            >
                                                <statusInfo.icon size={13} />
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar size={13} />
                                            <span>
                                                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment Method Badge */}
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                                                isCOD
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                            }`}
                                        >
                                            {isCOD ? <Banknote size={14} /> : <CreditCard size={14} />}
                                            <span>{isCOD ? "Cash on Delivery" : "Online Payment"}</span>
                                        </div>

                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                isPaid
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-amber-500/20 text-amber-300"
                                            }`}
                                        >
                                            {isPaid ? "Paid" : "Pay upon receipt"}
                                        </span>
                                    </div>
                                </div>

                                {/* Delivery Step Tracker (if not cancelled) */}
                                {order.orderStatus !== "cancelled" && (
                                    <div className="px-6 pt-5 pb-2 border-b border-gray-700/50 bg-gray-800/50">
                                        <div className="grid grid-cols-4 relative text-center text-xs">
                                            {/* Progress line */}
                                            <div className="absolute top-3.5 left-[12%] right-[12%] h-1 bg-gray-700 -z-0">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-500"
                                                    style={{
                                                        width:
                                                            statusInfo.step === 4
                                                                ? "100%"
                                                                : statusInfo.step === 3
                                                                ? "66%"
                                                                : statusInfo.step === 2
                                                                ? "33%"
                                                                : "0%",
                                                    }}
                                                />
                                            </div>

                                            {["Order Placed", "Processing", "Shipped", "Delivered"].map(
                                                (stepName, stepIndex) => {
                                                    const stepNumber = stepIndex + 1;
                                                    const isCompleted = statusInfo.step >= stepNumber;
                                                    const isCurrent = statusInfo.step === stepNumber;

                                                    return (
                                                        <div key={stepName} className="flex flex-col items-center z-10">
                                                            <div
                                                                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                                                                    isCompleted
                                                                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                                                                        : "bg-gray-700 text-gray-400 border border-gray-600"
                                                                }`}
                                                            >
                                                                {isCompleted ? "✓" : stepNumber}
                                                            </div>
                                                            <span
                                                                className={`text-[11px] ${
                                                                    isCurrent
                                                                        ? "text-emerald-400 font-semibold"
                                                                        : isCompleted
                                                                        ? "text-gray-300 font-medium"
                                                                        : "text-gray-500"
                                                                }`}
                                                            >
                                                                {stepName}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Products List */}
                                <div className="p-5 space-y-4">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                        Items in this order
                                    </h3>
                                    <div className="space-y-3">
                                        {order.products?.map((item, pIdx) => (
                                            <div
                                                key={pIdx}
                                                className="flex items-center gap-4 bg-gray-700/40 p-3 rounded-xl border border-gray-700/60"
                                            >
                                                {item.product?.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="w-14 h-14 rounded-lg object-cover border border-gray-600 shrink-0"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center shrink-0">
                                                        <Package size={20} className="text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-semibold text-sm truncate">
                                                        {item.product?.name || "Product"}
                                                    </h4>
                                                    <p className="text-gray-400 text-xs mt-0.5">
                                                        Qty: {item.quantity} × ৳{item.price?.toFixed(2)}
                                                    </p>
                                                    {item.product?.category && (
                                                        <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded mt-1 inline-block">
                                                            {item.product.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-emerald-400 font-bold text-sm">
                                                        ৳{(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Card Footer */}
                                <div className="bg-gray-900/60 p-5 border-t border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                                    {/* Shipping details */}
                                    <div className="space-y-1 text-xs text-gray-400">
                                        <div className="flex items-center gap-1.5 text-gray-300">
                                            <MapPin size={13} className="text-emerald-400 shrink-0" />
                                            <span>
                                                Shipping to: <strong className="text-white">{order.customerAddress || "Dhaka"}</strong>
                                                {order.customerCity ? `, ${order.customerCity}` : ""}
                                            </span>
                                        </div>
                                        {order.customerPhone && (
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Phone size={13} className="text-gray-500 shrink-0" />
                                                <span>Contact: {order.customerPhone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Total Bill */}
                                    <div className="flex items-center gap-4 self-end md:self-auto">
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 block">Total Amount</span>
                                            <span className="text-xl font-bold text-emerald-400">
                                                ৳{order.totalAmount?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;
