'use client';
import useProductStore from '@/store/productStore';
import ProductsPage from '@/template/productsTemplate/page';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  // const {user} = useAuth();
  // console.log(user)
  // if(!user) {
  //   router.push('/login');
  // }

  const handleProductClick = (pid: string) => {
    router.push(`/products/${pid}`);
  };

  return (
    <ProductsPage>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
          All Products
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.pid}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-orange-500/30"
              onClick={() => handleProductClick(product.pid)}
            >
              <div className="relative h-64">
                <Image
                  src={product.image[0] || '/images/tshirts/1.1.jpg'}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold text-xl mb-2 truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-orange-500 font-semibold text-lg">
                    ₹{product.price}
                  </p>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProductsPage>
  );
};

export default Page;