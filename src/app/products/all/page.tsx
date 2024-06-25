'use client';
import React, { useState, useEffect } from 'react';
import useProductStore from '@/store/productStore';
import ProductsPage from '@/template/productsTemplate/page';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Page = () => {
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    rating: '',
  });
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.category === '' || product.category === filters.category) &&
      (filters.rating === '' || product.rating.average >= parseInt(filters.rating))
    );

    if (filters.price === 'low') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.price === 'high') {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(results);
  }, [searchTerm, filters, products]);

  const handleProductClick = (pid: string) => {
    router.push(`/products/${pid}`);
  };

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: any) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <ProductsPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <h1 className="text-3xl font-bold text-black mb-8 border-b border-gray-300 pb-4">
          All Products
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-1/2 px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <button
            onClick={toggleFilter}
            className="w-full sm:w-auto px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300"
          >
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
              </select>
              <select
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">All Prices</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
              </select>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="">All Ratings</option>
                <option value="4">4 stars & up</option>
                <option value="3">3 stars & up</option>
                <option value="2">2 stars & up</option>
                <option value="1">1 star & up</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {filteredProducts.map((product) => (
    <motion.div
      key={product.pid}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:shadow-gray-400/30 group"
      onClick={() => handleProductClick(product.pid)}
    >
      <div className="relative h-72 overflow-hidden">
        <Image
          src={product.image[0] || '/images/tshirts/1.1.jpg'}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-700 transition duration-300 transform translate-y-4 group-hover:translate-y-0">
            View Details
          </button>
        </div>
      </div>
      <div className="p-6 relative">
        <h3 className="text-black font-bold text-xl mb-2 truncate group-hover:text-gray-700 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-800 transition-colors duration-300">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-gray-800 font-semibold text-lg group-hover:text-gray-900 transition-colors duration-300">
            ₹{product.price}
          </p>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-gray-600 text-sm">{product.rating.average.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  ))}
</div>
      </div>
    </ProductsPage>
  );
};

export default Page;