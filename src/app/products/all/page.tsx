'use client';
import useProductStore from '@/store/productStore';
import ProductsPage from '@/template/productsTemplate/page';
import Image from 'next/image';
import React from 'react';
import {useRouter} from 'next/navigation'

const Page = () => {
    const router = useRouter();
  const products = useProductStore((state) => state.products);
    console.log(products);
  const handleProductClick = (pid: string) => {
    router.push(`/products/${pid}`);
    console.log(pid);
  }

  return (
    <ProductsPage>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.pid}
            className="bg-gray-800 rounded-md shadow-md hover:cursor-pointer hover:scale-105 overflow-hidden"
            onClick={() => handleProductClick(product.pid)}
          >
            <Image
                height={600}
                width={400}
              src={product.image[0] || '/images/tshirts/1.1.jpg'}
              alt={product.name}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-bold text-lg mb-2">
                {product.name}
              </h3>
              <p className="text-gray-400 mb-2">{product.description}</p>
              <p className="text-orange-500 font-semibold">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </ProductsPage>
  );
};

export default Page;