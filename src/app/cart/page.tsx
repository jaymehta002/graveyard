'use client';
import { useEffect, useState, useMemo } from "react";
import Image from 'next/image';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/template/DefaultLayout';
import LoadingSpinner from "@/components/Loader/loader";
import { FaTrash, FaPlus, FaMinus, FaSort } from 'react-icons/fa';
import useCart from '@/hooks/useCart';
import { CartItem } from "@/store/cartStore";
import useAuth from "@/hooks/useAuth";

const Page: React.FC = () => {
  const {user} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  const sortBy = searchParams?.get('sortBy') || 'name';
  const sortOrder = searchParams?.get('sortOrder') || 'asc';

  const sortedItems = useMemo(() => {
    if (!mounted) return [];
    return [...items].sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.product.price - b.product.price : b.product.price - a.product.price;
      }
      return sortOrder === 'asc' ? a.product.name.localeCompare(b.product.name) : b.product.name.localeCompare(a.product.name);
    });
  }, [items, sortBy, sortOrder, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = newSortBy === sortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    router.push(`/cart?sortBy=${newSortBy}&sortOrder=${newSortOrder}`);
  };

  const handleCheckout = () => {
    const paymentDetails = {
      items: items.map(item => ({
        productId: item.product.pid,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.product.sizes || 'N/A'
      })),
      totalItems,
      totalPrice
    };

    const queryString = encodeURIComponent(JSON.stringify(paymentDetails));
    router.push(`/payment?details=${queryString}`);
  };

  // const redirectToShipping = () => {
  //   router.push({
  //     pathname: '/shipping', 
  //     query: {details: queryString}
  //   });
  // };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center mb-12">Your Cart</h1>
          {items.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">Your cart is empty.</p>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                  <div className="flex justify-end mb-6 space-x-4">
                    <button 
                      onClick={() => handleSortChange('name')} 
                      className="px-4 py-2 bg-gray-700 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out hover:bg-gray-600"
                      aria-label={`Sort by name ${sortBy === 'name' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                    >
                      Sort by Name <FaSort className="ml-2" />
                    </button>
                    <button 
                      onClick={() => handleSortChange('price')} 
                      className="px-4 py-2 bg-gray-700 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out hover:bg-gray-600"
                      aria-label={`Sort by price ${sortBy === 'price' ? (sortOrder === 'asc' ? 'descending' : 'ascending') : ''}`}
                    >
                      Sort by Price <FaSort className="ml-2" />
                    </button>
                  </div>
                  {sortedItems.map((item: CartItem) => (
                    <div key={item.product.pid} className="flex items-center border border-gray-700 rounded-lg p-4 mb-4 last:mb-0">
                      <div className="flex-shrink-0 w-24 h-24 relative mr-6">
                        <Image src={item.product.image[0] || '/images/tshirts/1.1.jpg'} alt={item.product.name} layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold mb-2">{item.product.name}</h2>
                        <p className="text-gray-400 mb-1">Quantity: {item.quantity}</p>
                        <p className="text-gray-400 mb-3 font-mono">Price: ₹{item.product.price}</p>
                        <div className="flex items-center space-x-3">
                          <button
                            className="bg-gray-700 text-white p-2 rounded-full transition-colors duration-150 ease-in-out hover:bg-gray-600"
                            onClick={() => updateQuantity(item.product.pid, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.product.name}`}
                          >
                            <FaMinus size={14} />
                          </button>
                          <button
                            className="bg-gray-700 text-white p-2 rounded-full transition-colors duration-150 ease-in-out hover:bg-gray-600"
                            onClick={() => updateQuantity(item.product.pid, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.product.name}`}
                          >
                            <FaPlus size={14} />
                          </button>
                          <button
                            className="bg-red-600 text-white p-2 rounded-full transition-colors duration-150 ease-in-out hover:bg-red-700"
                            onClick={() => removeFromCart(item.product.pid)}
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
                  <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <p className="flex justify-between text-gray-400">
                      <span>Total Items:</span>
                      <span className="font-mono">{totalItems}</span>
                    </p>
                    <p className="flex justify-between text-gray-400">
                      <span>Subtotal:</span>
                      <span className="font-mono">₹{totalPrice}</span>
                    </p>
                    <p className="flex justify-between text-gray-400">
                      <span>Shipping:</span>
                      <span className="font-mono">₹0.00</span>
                    </p>
                    <div className="border-t border-gray-700 pt-4">
                      <p className="flex justify-between text-xl font-semibold">
                        <span>Total:</span>
                        <span className="font-mono">₹{totalPrice}</span>
                      </p>
                    </div>
                  </div>
                  {/* <button 
                  onClick={redirectToShipping}
                  className="w-full bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-150 ease-in-out hover:bg-orange-600">
                    Buy Now
                  </button> */}
                  <button 
                    onClick={user?handleCheckout:() => router.push('/login')} 
                    className="w-full bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-150 ease-in-out hover:bg-orange-600"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Page;