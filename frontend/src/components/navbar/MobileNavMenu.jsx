import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const MobileNavMenu = ({ isOpen, closeMenu }) => {
    const { user, Logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className='md:hidden bg-gray-900/98 backdrop-blur-lg border-t border-blue-500/20 overflow-hidden'
                >
                    <div className='px-4 py-4 space-y-3'>
                        {/* Home Link */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Link
                                to={"/"}
                                onClick={closeMenu}
                                className='flex items-center gap-3 text-gray-300 hover:text-cyan-400 font-semibold py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300'
                            >
                                <Home size={20} />
                                Home
                            </Link>
                        </motion.div>

                        {/* Cart Link (when logged in) */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <Link
                                    to={"/cart"}
                                    onClick={closeMenu}
                                    className='flex items-center gap-3 text-gray-300 hover:text-cyan-400 font-semibold py-3 px-4 rounded-xl hover:bg-gray-800/50 transition-all duration-300'
                                >
                                    <ShoppingCart size={20} />
                                    Cart
                                    <span className=' left-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold'>
                                        {cartItemsCount}
                                    </span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Admin Dashboard (when admin) */}
                        {isAdmin && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link
                                    to={"/secret-dashboard"}
                                    onClick={closeMenu}
                                    className='flex items-center gap-3 text-white font-semibold py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-300'
                                >
                                    <Lock size={20} />
                                    Dashboard
                                </Link>
                            </motion.div>
                        )}

                        {/* Divider */}
                        <div className='border-t border-gray-700/50 my-2'></div>

                        {/* Auth Buttons */}
                        {user ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <button
                                    onClick={() => {
                                        Logout();
                                        closeMenu();
                                    }}
                                    className='flex items-center gap-3 w-full text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300'
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </motion.div>
                        ) : (
                            <div className='space-y-3'>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Link
                                        to={"/signup"}
                                        onClick={closeMenu}
                                        className='flex items-center justify-center gap-2 w-full text-white font-semibold py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-300'
                                    >
                                        <UserPlus size={20} />
                                        Sign Up
                                    </Link>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <Link
                                        to={"/login"}
                                        onClick={closeMenu}
                                        className='flex items-center justify-center gap-2 w-full text-gray-300 hover:text-white font-semibold py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300'
                                    >
                                        <LogIn size={20} />
                                        Login
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileNavMenu;
