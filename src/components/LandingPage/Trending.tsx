'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TrendingSection: React.FC = () => {
  const router = useRouter();

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

  return (
    <div className="bg-black py-12">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
  <h2 className="text-3xl flex items-center font-bold border-l-4 py-4 px-4 border-orange-500 text-white">Latest Arrivals</h2>
  <Link href="/products/all" className="flex items-center text-orange-500 hover:underline">
    <p className="text-orange-500 hover:underline">View All</p>
    {/* Optionally, you can add an arrow icon here */}
    {/* <svg className="w-5 h-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
         <path fillRule="evenodd" d="M10 12a.75.75 0 01-.75-.75V7.75a.75.75 0 011.5 0v3.501L14.28 9.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l3.53 3.53v-3.501a.75.75 0 01-.75.75z" clipRule="evenodd" />
       </svg> */}
  </Link>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {newDrops.map((card) => (
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
