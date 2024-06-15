import React from 'react'
import Image from 'next/image'

const Sale = () => {
  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image on the left */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="relative aspect-w-4 aspect-h-3">
              <Image
                src="/images/tshirts/1.1.jpg"
                alt="Sale Product"
                width={1200}
                height={900}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Product details on the right */}
          <div className="w-full md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold text-white mb-4">Limited Time Offer</h2>
            <h3 className="text-2xl font-semibold text-orange-500 mb-2">Premium T-Shirt</h3>
            <p className="text-gray-300 mb-4">
              Experience comfort and style with our premium quality t-shirt. Made from 100% organic cotton, 
              this t-shirt offers both durability and softness.
            </p>
            <div className="mb-6">
              <span className="text-2xl font-bold text-white">$29.99</span>
              <span className="text-lg text-gray-400 line-through ml-2">$49.99</span>
              <span className="text-lg text-orange-500 ml-2">40% OFF</span>
            </div>
            <ul className="text-gray-300 mb-6">
              <li className="mb-2">✓ 100% Organic Cotton</li>
              <li className="mb-2">✓ Available in multiple colors</li>
              <li className="mb-2">✓ Sizes: S, M, L, XL</li>
              <li>✓ Free shipping on orders over $50</li>
            </ul>
            <button className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-orange-600 transition duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sale