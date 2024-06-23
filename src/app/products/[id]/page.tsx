'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import useProductStore from '@/store/productStore';
import Layout from '@/template/DefaultLayout';
import { useAuth } from '@/hooks/useAuth';
import useCartStore from '@/store/cartStore';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import LoadingSpinner from '@/components/Loader/loader';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const router = useRouter();
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.isLoading);
  const product = products.find((product) => product.pid === params.id) as Product | undefined;
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [currentImage, setCurrentImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImage, setReviewImage] = useState<File | null>(null);
  const { user } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);
  const addReview = useProductStore((state) => state.addReview);

  if (loading) return <LoadingSpinner />;

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = async () => {
    if (product.stock > 0) {
      const cartItem = {
        product: {
          ...product,
          sizes: [selectedSize]
        },
        selectedSize: selectedSize,
        quantity: 1
      };
      await addToCart(product, selectedSize);
      toast.success('Product added to cart', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleReviewSubmit = async (e: any) => {
    if (!user) return;

    try {
      const reviewData = {
        uid: user.uid,
        name: user.name || user.email || '',
        review: reviewText,
        rating: reviewRating,
        image: reviewImage ? [await convertToBase64(reviewImage)] : [],
      };
      await addReview(product.pid, reviewData);
      setReviewText('');
      setReviewRating(5);
      setReviewImage(null);
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
      <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Product Images */}
            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={product.image[currentImage]}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 ease-in-out"
                />
              </motion.div>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.image.map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      width={80}
                      height={80}
                      className={`rounded-lg h-12 w-12 cursor-pointer ${
                        currentImage === index ? 'ring-2 ring-orange-500' : ''
                      }`}
                      onClick={() => setCurrentImage(index)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-500">{product.name}</h1>
              <p className="text-gray-300 text-lg">{product.description}</p>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-orange-500">${product.price}</span>
                <div className="flex items-center bg-orange-500 rounded-full px-3 py-1">
                  <FaStar className="text-yellow-300 mr-1" />
                  <span className="font-semibold">{product.rating.average}</span>
                  <span className="ml-1 text-sm">({product.rating.count})</span>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        selectedSize === size
                          ? 'bg-orange-500 text-black'
                          : 'bg-gray-800 text-white border border-gray-700'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-orange-500 text-black px-6 py-3 rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart />
                  <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-800 text-white px-4 py-3 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <FaHeart className="text-2xl" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Reviews Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-3xl font-bold mb-8 text-orange-500">Customer Reviews</h2>
            {user && (
              <form onSubmit={handleReviewSubmit} className="mb-12 space-y-6 bg-gray-800 p-6 rounded-xl">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full p-4 bg-gray-700 rounded-lg text-white"
                  rows={4}
                  required
                />
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">Your Rating:</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`cursor-pointer ${
                            star <= reviewRating ? 'text-yellow-400' : 'text-gray-400'
                          }`}
                          onClick={() => setReviewRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">Add Photo (optional):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReviewImage(e.target.files?.[0] || null)}
                      className="w-full p-2 bg-gray-700 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="bg-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors"
                  onClick={() => {handleReviewSubmit(params.id)}}
                >
                  Submit Review
                </motion.button>
              </form>
            )}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-8">
                {product.reviews.map((review, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-800 p-6 rounded-xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">{review.name}</h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-400'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{review.review}</p>
                    {review.image && review.image[0] && (
                      <Image
                        src={review.image[0]}
                        alt="Review image"
                        width={200}
                        height={200}
                        className="rounded-lg h-24 w-24"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-center text-lg">No reviews yet. Be the first to review this product!</p>
            )}
          </motion.div>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Page;
