'use client'
import React from 'react';
import Default from '../Layouts/Default';
import ImageUpload from './components/featured';
import useContentStore from '@/store/contentStore';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';

const Page = () => {
  const { featured: featuredData, loading: isLoading, deleteFeatured } = useContentStore();

  if (isLoading) {
    return (
      <Default>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </Default>
    );
  }

  return (
    <Default>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-orange-600">Featured Content</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredData.map((data, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
              <Image
                height={400}
                width={400}
                src={data}
                alt={`Featured ${index + 1}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => deleteFeatured(data)}
                  className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors duration-300"
                  aria-label="Delete image"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <ImageUpload />
        </div>
      </div>
    </Default>
  );
};

export default Page;