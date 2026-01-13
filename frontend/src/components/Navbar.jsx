import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";


const Navbar = () => {
    const user = false;
    const isAdmin = false;
    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-sm shadow-sm z-40 border-b border-blue-500/15'>
            <div className='container mx-auto px-4 py-1.5'>
                <div className='flex justify-between items-center'>
                    <Link to='/' className='text-sm font-semibold flex items-center gap-1'>
                        <Lock className='text-blue-400' size={16} />
                        <span className='bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 text-transparent bg-clip-text'>
                            E-ShopCart
                        </span>
                    </Link>

                    <nav className='flex items-center gap-3'>
                        <Link
                            to={"/"}
                            className='text-[9px] text-gray-400 hover:text-blue-400 transition-colors px-1.5 py-0.5'
                        >
                            Home
                        </Link>

                        {user && (
                            <Link
                                to={"/cart"}
                                className='relative group text-[9px] text-gray-400 hover:text-blue-400 transition-colors px-1.5 py-0.5'
                            >
                                <ShoppingCart className='inline-block' size={9} />
                                <span className='hidden md:inline ml-0.5'>Cart</span>
                                <span className='absolute -top-0.5 -left-0.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-2.5 h-2.5 flex items-center justify-center text-[8px] font-bold group-hover:from-blue-400 group-hover:to-indigo-500 transition-all'>
                                    3
                                </span>
                            </Link>
                        )}

                        {isAdmin && (
                            <Link
                                className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 transition-all'
                                to={"/secret-dashboard"}
                            >
                                <Lock size={9} />
                                <span className='hidden md:inline'>Dashboard</span>
                            </Link>
                        )}

                        {user ? (
                            <button className='bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[9px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 transition-all border border-gray-700/40 hover:border-blue-500/30'>
                                <LogOut size={9} />
                                <span className='hidden md:inline'>Logout</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to={"/signup"}
                                    className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[7px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 transition-all'
                                >
                                    <UserPlus size={9} />
                                    <span>Sign Up</span>
                                </Link>
                                <Link
                                    to={"/login"}
                                    className='bg-gray-800/80 hover:bg-gray-700 text-gray-300 text-[7px] px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 transition-all border border-gray-700/40 hover:border-blue-500/30'
                                >
                                    <LogIn size={9} />
                                    <span>Login</span>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;