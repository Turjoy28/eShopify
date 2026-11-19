import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import {
    Package,
    Search,
    RefreshCw,
    Trash2,
    CheckCircle2,
    Clock,
    Truck,
    CreditCard,
    ChevronDown,
    AlertCircle,
    User,
    Phone,
    Mail,
    MapPin,
    DollarSign,
} from "lucide-react";

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/payment/admin/orders");
            setOrders(res.data.orders || []);
        } catch (error) {
            console.error("Failed to fetch admin orders:", error);
            toast.error(error.response?.data?.error || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update delivery status (processing, shipped, delivered, cancelled)
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const res = await axios.patch(`/payment/admin/orders/${orderId}/status`, {
                orderStatus: newStatus,
            });
            if (res.data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
                );
                toast.success(`Order status updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update order status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Toggle payment status (mark as paid for COD / pending orders)
    const handleTogglePayment = async (orderId, currentPaymentStatus) => {
        const nextStatus = currentPaymentStatus === "paid" ? "pending" : "paid";
        setUpdatingId(orderId);
        try {
            const res = await axios.patch(`/payment/admin/orders/${orderId}/payment-status`, {
                paymentStatus: nextStatus,
            });
            if (res.data.success) {
                setOrders((prev) =>
                    prev.map((o) => (o._id === orderId ? { ...o, paymentStatus: nextStatus } : o))
                );
                toast.success(`Payment marked as ${nextStatus.toUpperCase()}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update payment status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Delete order
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            const res = await axios.delete(`/payment/admin/orders/${orderId}`);
            if (res.data.success) {
                setOrders((prev) => prev.filter((o) => o._id !== orderId));
                toast.success("Order deleted successfully");
            }
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete order");
        }
    };

    // Filter logic
    const filteredOrders = orders.filter((order) => {
        const orderIdStr = (order.sslCommerzTransactionId || order._id).toLowerCase();
        const customerName = (order.customerName || order.user?.name || "").toLowerCase();
        const customerPhone = (order.customerPhone || "").toLowerCase();
        const searchMatch =
            orderIdStr.includes(searchTerm.toLowerCase()) ||
            customerName.includes(searchTerm.toLowerCase()) ||
            customerPhone.includes(searchTerm.toLowerCase());

        const statusMatch =
            statusFilter === "all" || order.orderStatus === statusFilter;

        const methodMatch =
            methodFilter === "all" || order.paymentGateway === methodFilter;

        return searchMatch && statusMatch && methodMatch;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "delivered":
                return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "shipped":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "processing":
                return "bg-purple-500/20 text-purple-400 border-purple-500/30";
            case "cancelled":
                return "bg-red-500/20 text-red-400 border-red-500/30";
            default:
                return "bg-gray-700 text-gray-300 border-gray-600";
        }
    };

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Controls */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, name, phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/70 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                </div>

                {/* Filters & Refresh */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {/* Method Filter */}
                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="all">All Payment Methods</option>
                        <option value="cod">Cash on Delivery</option>
                        <option value="sslcommerz">SSLCommerz (Online)</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Refresh Button */}
                    <button
                        onClick={fetchOrders}
                        disabled={loading}
                        className="p-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-colors"
                        title="Refresh Orders"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin text-emerald-400" : ""} />
                    </button>
                </div>
            </div>

            {/* Total count badge */}
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                <span>
                    Showing <strong className="text-white">{filteredOrders.length}</strong> of{" "}
                    <strong className="text-white">{orders.length}</strong> total orders
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Order Stream
                </span>
            </div>

            {/* Orders Table Container */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                {loading && orders.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
                        <p>Loading customer orders...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center">
                        <Package size={48} className="text-gray-600 mb-3" />
                        <p className="text-lg font-medium text-gray-300">No orders found</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {searchTerm || statusFilter !== "all" || methodFilter !== "all"
                                ? "Try clearing your filters or search term"
                                : "When customers place orders, they will appear here in real-time."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-900/60 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                                    <th className="py-3.5 px-4">Order ID</th>
                                    <th className="py-3.5 px-4 min-w-[220px]">Products</th>
                                    <th className="py-3.5 px-4">Payment Status</th>
                                    <th className="py-3.5 px-4 min-w-[130px]">Total Price</th>
                                    <th className="py-3.5 px-4">Payment Method</th>
                                    <th className="py-3.5 px-4 min-w-[200px]">Customer Info</th>
                                    <th className="py-3.5 px-4 min-w-[140px]">Update Status</th>
                                    <th className="py-3.5 px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/60 text-sm">
                                <AnimatePresence>
                                    {filteredOrders.map((order) => {
                                        const formattedId = order.sslCommerzTransactionId || `ORD-${order._id.slice(-8).toUpperCase()}`;
                                        const isPaid = order.paymentStatus === "paid";
                                        const isCOD = order.paymentGateway === "cod";

                                        return (
                                            <motion.tr
                                                key={order._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-gray-700/30 transition-colors"
                                            >
                                                {/* 1. Order ID */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        <span className="font-mono text-xs font-bold text-white tracking-wide">
                                                            {formattedId}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-gray-500 block mt-1 ml-4">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>

                                                {/* 2. Products */}
                                                <td className="py-4 px-4 align-top space-y-2">
                                                    {order.products?.map((item, idx) => (
                                                        <div key={idx} className="flex items-start gap-2.5">
                                                            {item.product?.image ? (
                                                                <img
                                                                    src={item.product.image}
                                                                    alt={item.product.name}
                                                                    className="w-10 h-10 rounded-md object-cover border border-gray-700 shrink-0 mt-0.5"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-md bg-gray-700 flex items-center justify-center shrink-0">
                                                                    <Package size={16} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <p className="text-white font-medium text-xs truncate max-w-[170px]" title={item.product?.name}>
                                                                    {item.product?.name || "Product"}
                                                                </p>
                                                                <p className="text-emerald-400 font-semibold text-xs mt-0.5">
                                                                    ৳{item.price?.toFixed(2)} × {item.quantity}
                                                                </p>
                                                                {item.product?.category && (
                                                                    <span className="text-[10px] text-gray-400 bg-gray-700/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                                                        {item.product.category}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </td>

                                                {/* 3. Payment Status */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="space-y-2">
                                                        <span
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                                isPaid
                                                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                                            }`}
                                                        >
                                                            {isPaid ? (
                                                                <CheckCircle2 size={12} />
                                                            ) : (
                                                                <Clock size={12} />
                                                            )}
                                                            {isPaid ? "Completed" : "Pending"}
                                                        </span>

                                                        {/* Mark as Paid button (matches screenshot) */}
                                                        {!isPaid && (
                                                            <button
                                                                onClick={() => handleTogglePayment(order._id, order.paymentStatus)}
                                                                disabled={updatingId === order._id}
                                                                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors shadow-sm"
                                                                title="Mark this order as paid"
                                                            >
                                                                <CheckCircle2 size={12} />
                                                                Mark as Paid
                                                            </button>
                                                        )}

                                                        {isPaid && isCOD && (
                                                            <button
                                                                onClick={() => handleTogglePayment(order._id, order.paymentStatus)}
                                                                disabled={updatingId === order._id}
                                                                className="text-[10px] text-gray-400 hover:text-amber-400 underline block"
                                                            >
                                                                Mark Pending
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 4. Total Price (matches screenshot) */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex justify-between text-gray-400">
                                                            <span>Subtotal:</span>
                                                            <span className="font-medium text-gray-300">
                                                                ৳{(order.originalAmount || order.totalAmount)?.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-400">
                                                            <span>Shipping:</span>
                                                            <span className="text-emerald-400">৳0.00</span>
                                                        </div>
                                                        {order.discountAmount > 0 && (
                                                            <div className="flex justify-between text-emerald-400 text-[11px]">
                                                                <span>Discount:</span>
                                                                <span>-৳{order.discountAmount?.toFixed(2)}</span>
                                                            </div>
                                                        )}
                                                        {/* Black badge for total (like screenshot) */}
                                                        <div className="bg-black/80 rounded px-2.5 py-1 border border-gray-700 flex justify-between items-center text-white font-bold text-xs mt-1">
                                                            <span>Total:</span>
                                                            <span className="text-emerald-400">৳{order.totalAmount?.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 5. Payment Method */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="flex items-center gap-1.5">
                                                        {isCOD ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-md">
                                                                <Truck size={13} />
                                                                CashOnDelivery
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-md">
                                                                <CreditCard size={13} />
                                                                SSLCommerz
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 6. Customer Info */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex items-center gap-1.5 text-white font-semibold">
                                                            <User size={12} className="text-gray-400 shrink-0" />
                                                            <span className="truncate max-w-[150px]">{order.customerName || order.user?.name || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-300">
                                                            <Phone size={12} className="text-gray-400 shrink-0" />
                                                            <span className="font-mono">{order.customerPhone || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                                                            <Mail size={12} className="text-gray-500 shrink-0" />
                                                            <span className="truncate max-w-[150px]">{order.customerEmail || order.user?.email || "N/A"}</span>
                                                        </div>
                                                        <div className="flex items-start gap-1.5 text-gray-400 text-[11px] pt-0.5">
                                                            <MapPin size={12} className="text-gray-500 shrink-0 mt-0.5" />
                                                            <span className="line-clamp-2">{order.customerAddress ? `${order.customerAddress}${order.customerCity ? `, ${order.customerCity}` : ""}` : "Dhaka, Bangladesh"}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 7. Update Status (Dropdown matching screenshot) */}
                                                <td className="py-4 px-4 align-top">
                                                    <div className="relative">
                                                        <select
                                                            value={order.orderStatus || "processing"}
                                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                            disabled={updatingId === order._id}
                                                            className={`w-full appearance-none px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize cursor-pointer focus:outline-none transition-all pr-7 ${getStatusBadgeClass(
                                                                order.orderStatus || "processing"
                                                            )}`}
                                                        >
                                                            <option value="processing" className="bg-gray-800 text-purple-300">
                                                                Processing
                                                            </option>
                                                            <option value="shipped" className="bg-gray-800 text-blue-300">
                                                                Shipped
                                                            </option>
                                                            <option value="delivered" className="bg-gray-800 text-emerald-300">
                                                                Delivered
                                                            </option>
                                                            <option value="cancelled" className="bg-gray-800 text-red-300">
                                                                Cancelled
                                                            </option>
                                                        </select>
                                                        <ChevronDown
                                                            size={14}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                                                        />
                                                    </div>
                                                </td>

                                                {/* 8. Actions */}
                                                <td className="py-4 px-4 align-top text-center">
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                        title="Delete Order"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default OrdersTab;
