'use client'
import React from 'react'
import Image from 'next/image'
import useContentStore from '@/store/contentStore'
import useProductStore from '@/store/productStore'
import {useRouter} from 'next/navigation'
type Product = {
    pid: string
    name: string
    price: number
    description: string
    category: string
    stock: number
    image: string[]
    sizes: string[]
    rating: {
        average: number
        count: number
    }
    reviews?: {
        uid: string
        name: string
        review: string
        rating: number
        image?: string[]
    }[];
    tags: string[]
}

const Sale = () => {
  const star = useContentStore(state => state.star)
  const products = useProductStore(state => state.products)
  const router = useRouter()
  const displayProducts = products.filter((product) => product.pid === star)

  if (displayProducts.length === 0) {
    return <div>No product on sale at the moment.</div>
  }

  const product = displayProducts[0] as Product
  const handleRedirect = (id: string) => {
    router.push(`/products/${id}`)
  }
  return (
    <div className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image on the left */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="w-full h-0 pb-[75%] relative">
  <Image
    src={product.image[0]}
    alt={product.name}
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="rounded-lg object-cover object-center absolute inset-0"
    priority
  />
</div>
          </div>

                <div className="w-full md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-bold text-white mb-4">Limited Time Offer</h2>
                <h3 className="text-2xl font-semibold text-orange-500 mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="mb-6">
                  <span className="text-2xl font-bold text-white">₹{product.price}</span>
            </div>
            <ul className="text-gray-300 mb-6">
              <li className="mb-2">✓ Category: {product.category}</li>
              <li className="mb-2">✓ Available sizes: {product.sizes.join(', ')}</li>
              <li className="mb-2">✓ Rating: {product.rating.average.toFixed(1)} ({product.rating.count} reviews)</li>
              {/* <li>✓ Tags: {product.tags.join(', ')}</li> */}
            </ul>
            <button onClick={() => handleRedirect(product.pid)} className="bg-orange-500 text-white py-2 px-6 rounded-full hover:bg-orange-600 transition duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default Sale