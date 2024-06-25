"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import useProductStore from "@/store/productStore";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrendingSection: React.FC = () => {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const products = useProductStore((state) => state.products);
  const newDrops = products.slice(0, 6);

  const handleProductClick = (pid: string) => {
    router.push(`/products/${pid}`);
  };

  return (
    <section className="bg-gray-100 py-8 sm:py-12">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between mb-6">
          <h2 className="text-2xl flex items-center sm:text-3xl font-bold border-l-4 py-4 mt-4  px-3 sm:px-4 border-gray-500 text-black mb-4 sm:mb-0">
            Latest Arrivals
          </h2>
          <Link href="/products/all">
            <span className="text-gray-800 hover:underline">View All</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {newDrops.map((card) => (
            <article
              key={card.pid}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-gray-500/50 transition-all duration-300 cursor-pointer transform hover:scale-105"
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
              </div>
              <div className="p-4">
                <h3 className="text-sm sm:text-base font-semibold mb-2 text-black truncate">
                  {card.name}
                </h3>
                <p className="text-black text-sm sm:text-base mb-2">
                  &#x20B9;{card.price}
                </p>
                <div className="flex items-center justify-between">
                <button
                    className="text-xs sm:text-sm bg-black border border-black text-white py-1 px-2 rounded hover:bg-white hover:text-black transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(card.pid);
                    }}
                  >
                    Add to Cart
                  </button>
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
