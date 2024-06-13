'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const TrendingSection = () => {
  const [showNewDrops, setShowNewDrops] = useState(true);

  const toggleTrending = () => {
    setShowNewDrops(!showNewDrops);
  };

  const newDrops = [
    {
      id: 1,
      image: '/images/tshirts/1.1.jpg',
      title: 'New Drop 1',
      price: '$29.99',
    },
    {
      id: 2,
      image: '/images/tshirts/1.2.jpg',
      title: 'New Drop 2',
      price: '$39.99',
    },
    {
      id: 3,
      image: '/images/tshirts/2.1.jpg',
      title: 'New Drop 3',
      price: '$49.99',
    },
    {
      id: 4,
      image: '/images/tshirts/3.1.jpg',
      title: 'New Drop 4',
      price: '$59.99',
    },
    {
      id: 5,
      image: '/images/tshirts/4.1.jpg',
      title: 'New Drop 5',
      price: '$69.99',
    },
  ];

  const mostTrending = [
    {
      id: 1,
      image: '/images/tshirts/1.1.jpg',
      title: 'Trending 1',
      price: '$24.99',
    },
    {
      id: 2,
      image: '/images/tshirts/1.2.jpg',
      title: 'Trending 2',
      price: '$34.99',
    },
    {
      id: 3,
      image: '/images/tshirts/2.1.jpg',
      title: 'Trending 3',
      price: '$44.99',
    },
    {
      id: 4,
      image: '/images/tshirts/3.1.jpg',
      title: 'Trending 4',
      price: '$54.99',
    },
    {
      id: 5,
      image: '/images/tshirts/4.1.jpg',
      title: 'Trending 5',
      price: '$64.99',
    },
  ];

  return (
    <div className="bg-black py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <button
            className={`mx-2 px-4 py-2 rounded-lg ${
              showNewDrops
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
            onClick={toggleTrending}
          >
            New Drops
          </button>
          <button
            className={`mx-2 px-4 py-2 rounded-lg ${
              !showNewDrops
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
            onClick={toggleTrending}
          >
            Most Trending
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {showNewDrops
            ? newDrops.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-orange-500/50 transition-shadow duration-300"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={600}
                    height={400}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-orange-500">{card.price}</p>
                  </div>
                </div>
              ))
            : mostTrending.map((card) => (
                <div
                  key={card.id}
                  className="bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-orange-500/50 transition-shadow duration-300"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={600}
                    height={400}
                    className="w-full h-72 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {card.title}
                    </h3>
                    <p className="text-orange-500">{card.price}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;