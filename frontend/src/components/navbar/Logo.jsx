import { ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Logo = ({ onClick }) => (
    <Link to='/' className='flex items-center gap-2 sm:gap-3 group' onClick={onClick}>
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
);

export default Logo;
