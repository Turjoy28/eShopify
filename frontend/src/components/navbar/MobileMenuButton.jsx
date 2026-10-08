import { ShoppingCart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/useUserStore";
import { useCartStore } from "../../stores/useCartStore";

const MobileMenuButton = ({ isOpen, toggleMenu, closeMenu }) => {
    const { user } = useUserStore();
    const { cart } = useCartStore();
    const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div className='flex md:hidden items-center gap-3'>
            {user && (
                <Link
                    to={"/cart"}
                    className='relative text-gray-300 hover:text-cyan-400 transition-colors'
                    onClick={closeMenu}
                >
                    <ShoppingCart size={24} />
                    <span className='absolute -top-2 -right-2 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold'>
                        {cartItemsCount}
                    </span>
                </Link>
            )}

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className='text-gray-300 hover:text-cyan-400 transition-colors p-1'
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
        </div>
    );
};

export default MobileMenuButton;
