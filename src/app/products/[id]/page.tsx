'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import useProductStore from '@/store/productStore';
import Layout from '@/template/DefaultLayout';
import { useAuth } from '@/hooks/useAuth'; // Assume this hook exists for authentication
// import { addReview } from '@/services/productservice'; // Assume this function exists to add reviews

interface PageProps {
  params: {
    id: string;
  };
}

interface ReviewData {
  uid: string;
  name: string;
  review: string;
  rating: number;
  image?: string;
}

const Page = ({ params }: PageProps) => {
  const products = useProductStore((state) => state.products);
  const product = products.find((product) => product.pid === params.id) as Product;
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [currentImage, setCurrentImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const { user } = useAuth(); // Assume this hook provides user authentication info

  if (!product) return null;


  const addReview = async (productId: string, reviewData: ReviewData) => {
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return; // Ensure user is logged in

    try {
      const reviewData = {
        uid: user.uid,
        name: user.displayName || user.email || '',
        review: reviewText,
        rating: reviewRating,
        image: reviewImage ? await convertToBase64(reviewImage) : '',
      };
      // await addReview(product.pid, reviewData);
      setReviewText('');
      setReviewRating(5);
      setReviewImage(null);
      // Optionally, refresh the product data to show the new review
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <Layout>
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <Image
                  src={product.image[currentImage]}
                  alt={product.name}
                  width={1500}
                  height={1500}
                  className="w-full h-auto max-w-md rounded-lg object-cover"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {product.image.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    width={100}
                    height={100}
                    className={`w-20 h-20 rounded cursor-pointer ${
                      currentImage === index ? 'border-2 border-orange-500' : ''
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-orange-500">{product.name}</h1>
              <p className="text-gray-300">{product.description}</p>
              <p className="text-2xl font-bold text-orange-500">${product.price}</p>
              <div className="flex items-center">
                <span className="text-orange-500 mr-2">&#9733;</span>
                <span>{product.rating.average}</span>
                <span className="ml-2 text-gray-300">({product.rating.count} reviews)</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-3 py-1 rounded ${
                        selectedSize === size
                          ? 'bg-orange-500 text-black'
                          : 'bg-gray-700 text-white'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Stock:</h3>
                <p className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
              <button
                className="w-full bg-orange-500 text-black px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                disabled={product.stock === 0}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            {user && (
              <form onSubmit={handleReviewSubmit} className="mb-8 space-y-4">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here"
                  className="w-full p-2 bg-gray-800 rounded"
                  required
                />
                <div>
                  <label className="block mb-2">Rating:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-20 p-2 bg-gray-800 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2">Image (optional):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReviewImage(e.target.files?.[0] || null)}
                    className="w-full p-2 bg-gray-800 rounded"
                  />
                </div>
                <button type="submit" className="bg-orange-500 text-black px-4 py-2 rounded">
                  Submit Review
                </button>
              </form>
            )}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{review.name}</h3>
                      <div className="flex items-center">
                        <span className="text-orange-500 mr-1">&#9733;</span>
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{review.review}</p>
                    {review.image && (
                      <Image
                        src={review.image[0]}
                        alt="Review image"
                        width={200}
                        height={200}
                        className="rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;