import { useState } from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, ShoppingBag, Sparkles, Menu, X, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
    const { user, Logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {cart}=useCartStore();
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-md shadow-lg shadow-blue-500/10 z-40 border-b border-blue-500/20'>
            <div className='w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-3 sm:py-4'>
                <div className='flex justify-between items-center'>
                    {/* Logo - Bigger & More Catchy */}
                    <Link to='/' className='flex items-center gap-2 sm:gap-3 group' onClick={closeMobileMenu}>
                        <motion.div
                            className='relative'
                            whileHover={{ scale: 1.15, rotate: 8 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <div className='relative'>
                                <ShoppingBag
                                    className='text-blue-400 group-hover:text-cyan-300 transition-colors duration-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                                    size={32}
                                    strokeWidth={2.5}
                                />
                                <motion.div
                                    animate={{
                                        rotate: [0, 20, -20, 0],
                                        scale: [1, 1.3, 1, 1.2, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    <Sparkles
                                        className='text-cyan-400 absolute -top-1.5 -right-1.5 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                                        size={14}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.span
                            className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight'
                            style={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 25%, #818cf8 50%, #c084fc 75%, #60a5fa 100%)',
                                backgroundSize: '200% 200%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        >
                            E-ShopCart
                        </motion.span>
                    </Link>

                    {/* Desktop Navigation - Right Side */}
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

                    {/* Mobile Navigation Controls */}
                    <div className='flex md:hidden items-center gap-3'>
                        {/* Cart Icon for mobile (when logged in) */}
                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative text-gray-300 hover:text-cyan-400 transition-colors'
                                onClick={closeMobileMenu}
                            >
                                <ShoppingCart size={24} />
                                <span className='absolute -top-2 -right-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold'>
                                    {cartItemsCount}
                                </span>
                            </Link>
                        )}

                        {/* Hamburger Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMobileMenu}
                            className='text-gray-300 hover:text-cyan-400 transition-colors p-1'
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
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
                                    onClick={closeMobileMenu}
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
                                        onClick={closeMobileMenu}
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
                                        onClick={closeMobileMenu}
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
                                            closeMobileMenu();
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
                                            onClick={closeMobileMenu}
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
                                            onClick={closeMobileMenu}
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
        </header>
    );
};

export default Navbar;
