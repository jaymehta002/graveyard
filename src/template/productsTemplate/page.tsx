import Navbar from '@/components/NavBar/page';
import React, { useState } from 'react';

const ProductsPage = (props : any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    rating: '',
  });

  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: any) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Subnavbar */}
      {/* <div className="bg-gray-900 py-4 flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
          </select>
        </div>
        <div>
          <select
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
            className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Prices</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>
        </div>
        <div>
          <select
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="bg-gray-900 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Ratings</option>
            <option value="4">4 stars & up</option>
            <option value="3">3 stars & up</option>
            <option value="2">2 stars & up</option>
            <option value="1">1 star & up</option>
          </select>
        </div>
      </div> */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
      {props.children}

      </div>
    </div>
  );
};

export default ProductsPage;