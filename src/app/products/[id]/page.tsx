'use client';
import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import useProductStore from '@/store/productStore';
import Layout from '@/template/DefaultLayout'; // Import the useLayout hook

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const products = useProductStore((state) => state.products);
  const product = products.find((product) => product.pid === params.id) as Product;
  console.log(product);

  if (!product) return null;

  return (
    <Layout> {/* Wrap the Page component with the Layout */}
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex justify-center">
              <Image
                src={product.image[0]}
                alt={product.name}
                width={1500}
                height={1500}
                className="w-96 h-96 rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4 text-orange-500">
                {product.name}
              </h1>
              <p className="text-gray-300 mb-4">{product.description}</p>
              <p className="text-2xl font-bold mb-2 text-orange-500">
                ${product.price}
              </p>
              <div className="flex items-center mb-4">
                <span className="mr-2 text-orange-500">&#9733;</span>
                <span>{product.rating.average}</span>
                <span className="ml-2 text-gray-300">
                  ({product.rating.count} reviews)
                </span>
              </div>
              <button className="bg-orange-500 text-black px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;