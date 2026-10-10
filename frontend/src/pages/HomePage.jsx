import React from 'react'
import CategoryItem from "../components/CategoryItem"
import FeaturedProducts from "../components/FeaturedProducts"

const categories = [
	{ href: "/Jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/T-shirt", name: "T-shirt", imageUrl: "/tshirts.jpg" },
	{ href: "/Shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/Glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/Jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/Suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/Bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const HomePage = () => {
  return (
   <div className='relative min-h-screen text-white overflow-hidden'>
    {/* Removed max-w-7xl to let it span wider, updated side padding */}
    <div className='relative z-10 mx-auto px-4 sm:px-8 lg:px-16 xl:px-20 py-16 w-full'>
      
      {/* Hero Section */}
      <div className='text-center mb-12'>
        <h1 className='text-5xl sm:text-6xl font-extrabold text-emerald-400 mb-6 tracking-tight'>
            Welcome to Our Store
        </h1>
        <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
            Discover the latest trends in eco-friendly fashion. Elevate your style with our premium collection.
        </p>
      </div>

      {/* Featured Products Section (Now on top with arrows) */}
      <FeaturedProducts />

      {/* Categories Title */}
      <div className='text-center mt-20 mb-10'>
        <h2 className='text-4xl sm:text-5xl font-extrabold text-emerald-400 mb-4 tracking-tight'>
            Explore Our Categories
        </h2>
      </div>

      {/* Categories Grid - Allowed to expand further now */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20'>
        {categories.map(category=>(
            <CategoryItem
            category={category}
            key={category.name}
            />
        ))}
      </div>

    </div>
   </div>
  )
}

export default HomePage