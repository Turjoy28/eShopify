import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    loading: false,
    recommendations: [],

    getCartItems: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data || [], loading: false });
            get().calculateTotal();
        } catch (error) {
            set({ cart: [], loading: false });
            console.log("Cart fetch error:", error);
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");
            await get().getCartItems();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    removeFromCart: async (productId) => {
        try {
            await axios.delete("/cart", { data: { productId } });
            set((prevState) => ({
                cart: prevState.cart.filter((item) => item._id !== productId),
            }));
            get().calculateTotal();
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }
        try {
            await axios.put(`/cart/${productId}`, { quantity });
            set((prevState) => ({
                cart: prevState.cart.map((item) =>
                    item._id === productId ? { ...item, quantity } : item
                ),
            }));
            get().calculateTotal();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    getRecommendations: async () => {
        try {
            const res = await axios.get("/products/recommendations");
            set({ recommendations: res.data || [] });
        } catch (error) {
            console.log("Recommendations fetch error:", error);
        }
    },

    calculateTotal: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }
        set({ subtotal, total });
    },

    clearCart: async () => {
        try {
            await axios.delete("/cart");
            set({ cart: [], total: 0, subtotal: 0 });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },
}));
