import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
    const { fetchFeaturedProducts, products, loading } = useProductStore();
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchFeaturedProducts();
    }, [fetchFeaturedProducts]);

    if (loading) return null; // We can return a spinner here if desired
    if (products.length === 0) return null; // Don't show the section if no featured products

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            // Scroll by one full width of the container
            const scrollAmount = direction === "left" ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="py-8 mb-12 relative">
            <h2 className="text-center text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-10 tracking-tight">
                Featured Collection
            </h2>
            
            <div className="relative group">
                {/* Left Scroll Button */}
                <button 
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-800/80 text-emerald-400 rounded-r-lg hover:bg-emerald-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block shadow-lg"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* Horizontally scrollable container */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-6 pt-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product._id} className="min-w-[280px] sm:min-w-[320px] snap-center flex-shrink-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button 
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-800/80 text-emerald-400 rounded-l-lg hover:bg-emerald-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block shadow-lg"
                >
                    <ChevronRight size={28} />
                </button>
            </div>
        </div>
    );
};

export default FeaturedProducts;
