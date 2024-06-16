'use client';
import useCartStore, { CartItem } from "@/store/cartStore";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {items.map((item: CartItem) => (
              <div key={item.product.pid} className="flex items-center border-b border-gray-300 py-4">
                <div className="flex-shrink-0 w-20 h-20 relative mr-4">
                  {/* Use the correct Image component and path */}
                  <Image src={`/images/tshirts/${item.product.pid}.jpg`} alt={item.product.name} layout="fill" objectFit="cover" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">{item.product.name}</h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">Price: ${item.product.price}</p>
                  <div className="mt-2">
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-md mr-2"
                      onClick={() => handleUpdateQuantity(item.product.pid, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-md"
                      onClick={() => handleUpdateQuantity(item.product.pid, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
                      onClick={() => handleRemoveFromCart(item.product.pid)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-black text-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4">Summary</h2>
              <p>Total Items: {totalItems}</p>
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
              <button onClick={handleCheckout} className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
