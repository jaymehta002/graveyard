'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useProductStore from '@/store/productStore';

const TrendingSection: React.FC = () => {
  const products = useProductStore((state) => state.products);
  const newDrops = products.slice(0, 5);

  return (
    <div className="bg-gray-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl flex items-center font-bold border-l-4 py-2 sm:py-4 px-3 sm:px-4 border-orange-500 text-white mb-4 sm:mb-0">
            Latest Arrivals
          </h2>
          <Link href="/products/all" className="flex items-center text-orange-500 hover:underline">
            <p className="text-orange-500 hover:underline">View All</p>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {newDrops.map((card) => (
            <div
              key={card.pid}
              className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-orange-500/50 transition-shadow duration-300"
            >
              <div className="relative aspect-w-3 aspect-h-4">
                <Image
                  src={card.image[0]}
                  alt={card.name}
                  height={600}
                  width={400}
                  className="w-full h-64"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-white">
                  {card.name}
                </h3>
                <p className="text-orange-500 text-sm sm:text-base">{card.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;