'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useProductStore from '@/store/productStore';
import { useRouter } from 'next/navigation';
import useCartStore from '@/store/cartStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TrendingSection: React.FC = () => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.isLoading);
  const newDrops = products.slice(0, 5);


  const handleProductClick = (pid: string) => {
    router.push(`/products/${pid}`);
  };

  const handleAddToCart = (card: any) => {
    // addToCart(card);
    toast.success(`Added to cart!`);
  };

  return (
    <section className="bg-gray-900 py-8 sm:py-12">
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold border-l-4 py-2 sm:py-4 px-3 sm:px-4 border-orange-500 text-white mb-4 sm:mb-0">
        Latest Arrivals
      </h2>
      <Link href="/products/all">
        <span className="text-orange-500 hover:underline">
          View All
        </span>
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      {newDrops.map((card) => (
        <article
          key={card.pid}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-orange-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
          onClick={() => handleProductClick(card.pid)}
        >
          <div className="relative aspect-w-1 aspect-h-1 group">
            <Image
              src={card.image[0]}
              alt={card.name}
              height={400}
              width={400}
              className="object-cover w-full h-48 sm:h-56 transition-transform duration-300 group-hover:scale-110"
            />
            {/* <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-300">
                Quick View
              </button>
            </div> */}
          </div>
          <div className="p-4">
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-white truncate">
              {card.name}
            </h3>
            <p className="text-orange-500 text-sm sm:text-base mb-2">&#x20B9;{card.price}</p>
            <div className="flex items-center justify-between">
              <button
                className="text-xs sm:text-sm bg-transparent border border-orange-500 text-orange-500 py-1 px-2 rounded hover:bg-orange-500 hover:text-white transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(card.pid);
                }}
              >
                Add to Cart
              </button>
              {/* <span className="text-xs sm:text-sm text-gray-400">
                {card.category}
              </span> */}
            </div>
          </div>
        </article>
      ))}
    </div>
  </div>
</section>
  );
};

export default TrendingSection;
