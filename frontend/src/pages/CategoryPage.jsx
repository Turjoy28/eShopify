import React, { useEffect, useState, useMemo } from 'react';
import { useProductStore } from '../stores/useProductStore';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import PriceFilter, { filterProductsByPrice } from '../components/PriceFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage = () => {
    const { fetchProductsByCategory, products, loading } = useProductStore();
    const { category } = useParams();

    useEffect(() => {
        fetchProductsByCategory(category);
    }, [fetchProductsByCategory, category]);

    // Calculate minimum and maximum price bounds from current category products
    const { minBound, maxBound } = useMemo(() => {
        if (!products || products.length === 0) {
            return { minBound: 0, maxBound: 500 };
        }
        const prices = products.map((p) => Number(p.price) || 0);
        return {
            minBound: Math.floor(Math.min(...prices)),
            maxBound: Math.ceil(Math.max(...prices)),
        };
    }, [products]);

    const [priceRange, setPriceRange] = useState([0, 500]);
    const [sortBy, setSortBy] = useState('default');

    // Automatically sync filter range when category or product bounds change
    useEffect(() => {
        if (products && products.length > 0) {
            setPriceRange([minBound, maxBound]);
        } else {
            setPriceRange([0, 500]);
        }
        setSortBy('default');
    }, [category, minBound, maxBound]);

    // Filter and sort products based on selected price range
    const filteredProducts = useMemo(() => {
        return filterProductsByPrice(products, priceRange, sortBy);
    }, [products, priceRange, sortBy]);

    if (loading && (!products || products.length === 0)) {
        return <LoadingSpinner />;
    }

    return (
        <div className='min-h-screen'>
            {/* Wide-spanning container pushed toward the sides of the screen */}
            <div className='relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12'>
                <motion.h1
                    className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-12 capitalize'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {category}
                </motion.h1>

                {/* Left Filter & Right Products Layout with wide gap */}
                <div className='flex flex-col lg:flex-row items-start gap-10 lg:gap-14 xl:gap-20 w-full'>
                    {/* Left Sidebar: Compact Price Filter positioned towards the left edge */}
                    {products?.length > 0 && (
                        <aside className='w-full lg:w-64 xl:w-72 2xl:w-80 shrink-0 lg:sticky lg:top-24'>
                            <PriceFilter
                                minPrice={minBound}
                                maxPrice={maxBound}
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                                totalCount={products.length}
                                filteredCount={filteredProducts.length}
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                onReset={() => {
                                    setPriceRange([minBound, maxBound]);
                                    setSortBy('default');
                                }}
                            />
                        </aside>
                    )}

                    {/* Right Main Catalog Area expanding towards the right edge */}
                    <div className='flex-1 w-full min-w-0'>
                        <motion.div
                            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {products?.length === 0 && (
                                <div className='col-span-full py-16 text-center'>
                                    <h2 className='text-3xl font-semibold text-gray-300 mb-2'>
                                        No products found
                                    </h2>
                                    <p className='text-gray-400'>
                                        There are currently no products listed in the {category} category.
                                    </p>
                                </div>
                            )}

                            {products?.length > 0 && filteredProducts.length === 0 && (
                                <div className='col-span-full py-16 text-center bg-gray-800/40 border border-gray-700/60 rounded-2xl w-full max-w-md mx-auto p-8'>
                                    <h2 className='text-xl font-semibold text-gray-200 mb-2'>
                                        No products match this price
                                    </h2>
                                    <p className='text-sm text-gray-400 mb-5'>
                                        Try widening your range (${priceRange[0]} – ${priceRange[1]}).
                                    </p>
                                    <button
                                        onClick={() => {
                                            setPriceRange([minBound, maxBound]);
                                            setSortBy('default');
                                        }}
                                        className='bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md transition-colors'
                                    >
                                        Reset Price Filter
                                    </button>
                                </div>
                            )}

                            {filteredProducts?.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;