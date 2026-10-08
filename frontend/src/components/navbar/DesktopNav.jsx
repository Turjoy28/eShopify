import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const DesktopNav = () => {
    const { user, Logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className='hidden md:flex items-center gap-5 lg:gap-8'>
            <Link
                to={"/"}
                className='text-base font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300 relative group'
            >
                Home
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 rounded-full'></span>
            </Link>

            {user && (
                <Link
                    to={"/cart"}
                    className='relative group flex items-center gap-2 text-base font-semibold text-gray-300 hover:text-cyan-400 transition-all duration-300'
                >
                    <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                        <ShoppingCart size={22} />
                    </motion.div>
                    <span>Cart</span>
                    <motion.span
                        className='absolute -top-3 left-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg shadow-blue-500/50'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                    >
                        {cartItemsCount}
                    </motion.span>
                </Link>
            )}

            {isAdmin && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                        to={"/secret-dashboard"}
                    >
                        <Lock size={18} />
                        <span>Dashboard</span>
                    </Link>
                </motion.div>
            )}

            {user ? (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-base font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 border border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20'
                    onClick={Logout}
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </motion.button>
            ) : (
                <div className='flex items-center gap-4'>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to={"/signup"}
                            className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-base font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                        >
                            <UserPlus size={18} />
                            <span>Sign Up</span>
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to={"/login"}
                            className='bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-base font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-300 border border-gray-700 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'
                        >
                            <LogIn size={18} />
                            <span>Login</span>
                        </Link>
                    </motion.div>
                </div>
            )}
        </nav>
    );
};

export default DesktopNav;
