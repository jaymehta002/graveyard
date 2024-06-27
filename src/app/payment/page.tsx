'use client';

import LoadingSpinner from '@/components/Loader/loader';
import useAuth from '@/hooks/useAuth';
import useCart from '@/hooks/useCart';
import usePaymentStore from '@/store/paymentStore';
import { useOrderStore } from '@/store/orderStore';
import Layout from '@/template/DefaultLayout';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { FaCreditCard, FaLock, FaShoppingCart } from 'react-icons/fa';
import Link from 'next/link';
import useProductStore from '@/store/productStore';
import useUserStore from '@/store/userStore';

interface PaymentItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
}

interface PaymentDetails {
  items: PaymentItem[];
  totalItems: number;
  totalPrice: number;
}

const PaymentPageContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const { paymentDetails, setPaymentDetails, savePaymentDetails } = usePaymentStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const { clearCart } = useCart();
  const { addOrder } = useOrderStore();
  const editProduct = useProductStore((state) => state.editProduct);
  const products = useProductStore((state) => state.products);
  const addOrderToUser = useUserStore((state) => state.addOrderToUser);
  const [codloading, setcodloading] = useState<boolean>(false);
  const fetchAndStoreDetails = useCallback(async () => {
    const detailsString = searchParams.get('details');
    if (!detailsString) {
      setError('No payment details provided');
      return;
    }

    try {
      const details = JSON.parse(decodeURIComponent(detailsString));
      const updatedDetails = {
        ...details,
        date: new Date(),
      };
      setPaymentDetails(updatedDetails);
      // await savePaymentDetails(updatedDetails);
    } catch (err) {
      console.error('Error processing payment details:', err);
      setError('Invalid payment details');
    }
  }, [searchParams, setPaymentDetails]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  };

  useEffect(() => {
    fetchAndStoreDetails();
    loadRazorpayScript();

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) document.body.removeChild(script);
    };
  }, [fetchAndStoreDetails]);

  if (authLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!paymentDetails || !razorpayLoaded) return <LoadingMessage />;
  if (orderPlaced) return <OrderPlacedMessage />;

  const handlePayment = async () => {
    if (!paymentDetails || !razorpayLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const order = await createOrder();
      if (order.id) {
        const options = createRazorpayOptions(order);
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paymentDetails.totalPrice + 70,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    });

    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  };

  const createRazorpayOptions = (order: any) => ({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'GRAVEYARD',
    description: `Payment for ${paymentDetails.totalItems} items`,
    order_id: order.id,
    handler: handlePaymentSuccess,
    prefill: {
      name: user?.name || 'Graveyard',
      email: user?.email || 'Graveyard@gmail.com',
      contact: user?.phone || '9999999999',
    },
    notes: {
      orderDetails: JSON.stringify(paymentDetails.items),
    },
    theme: { color: '#F97316' },
  });

  const handlePaymentSuccess = async (response: any) => {
    // Ensure this block executes only once
    if (orderPlaced) return;

    setOrderPlaced(true);
    clearCart();

    if (user && paymentDetails) {
      const updatedOrderDetails = {
        uid: user.uid,
        products: paymentDetails.items.map((item: any) => ({
          pid: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        total: paymentDetails.totalPrice,
        status: 'PAID',
        date: new Date().toISOString(),
        address: user.address,
        payment: {
          method: 'Razorpay',
          transaction: response.razorpay_payment_id,
        },
        shippingStatus: 'PENDING',
      };

      const productIds = paymentDetails.items.map((item: any) => item.productId);
      const filteredProducts = products.filter((product) => productIds.includes(product.pid));

      filteredProducts.forEach((product) => {
        const item = paymentDetails.items.find((item: any) => item.productId === product.pid);
        if (item) {
          const updatedProduct = {
            ...product,
            stock: product.stock - item.quantity,
          };
          editProduct(updatedProduct);
        }
      });

      const userOrder = {
        productID: updatedOrderDetails.products.map((product: any) => product.pid),
        amount: updatedOrderDetails.total,
        status: 'PENDING',
        date: updatedOrderDetails.date,
      }

      try {
        await addOrder(updatedOrderDetails);
        const updatedDetails = {
          ...paymentDetails,
          date: new Date(),
        };
        const payId = await savePaymentDetails(updatedDetails);
        await addOrderToUser(user.uid, { ...updatedOrderDetails, oid: payId });
      } catch (error) {
        console.error('Error saving order:', error);
      }
    } 
  };

  const handlecashOnDevlivery = async () => {
    if (!paymentDetails || !user) return;

    setcodloading(true);
    setError(null);

    try {
      const updatedOrderDetails = {
        uid: user.uid,
        products: paymentDetails.items.map((item: any) => ({
          pid: item.productId,
          name: item.productName,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
        })),
        total: paymentDetails.totalPrice,
        status: 'PENDING',
        date: new Date().toISOString(),
        address: user.address,
        payment: {
          method: 'Cash on Delivery',
          transaction: 'COD',
        },
        shippingStatus: 'PENDING',
      };
      addOrder(updatedOrderDetails);
      const updatedDetails = {
        ...paymentDetails,
        date: new Date(),
      };
      const payId = await savePaymentDetails(updatedDetails);
      await addOrderToUser(user.uid, { ...updatedOrderDetails, oid: payId });
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setcodloading(false);
      setOrderPlaced(true);
      clearCart();
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-800 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Complete Your Payment</h1>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <FaShoppingCart className="text-3xl text-black mr-3" />
            <h2 className="text-2xl font-semibold">Order Summary</h2>
          </div>
          <OrderSummary items={paymentDetails.items} />
          <div className="flex justify-between font-medium text-xl mb-8 rounded-lg">
            <span>Shipping:</span>
            <span>₹70.00</span>
          </div>
          <div className="flex justify-between font-bold text-xl mb-8 p-4 bg-gray-100 rounded-lg">
            <span>Total:</span>
            <span>₹{(paymentDetails.totalPrice + 70).toFixed(2)}</span>
          </div>
          <button
            onClick={handlePayment}
            disabled={loading || orderPlaced} // Disable the button if loading or order is already placed
            className="w-full bg-gray-500 text-white py-4 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <FaCreditCard className="mr-2" />
                Pay Online
              </>
            )}
          </button>
          <button
            onClick={handlecashOnDevlivery}
            disabled={codloading || orderPlaced} // Disable the button if loading or order is already placed
            className="w-full mt-2 bg-gray-500 text-white py-4 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <FaCreditCard className="mr-2" />
                Cash on Delivery
              </>
            )}
          </button>
          <div className="mt-6 text-center text-gray-600 flex items-center justify-center">
            <FaLock className="mr-2" />
            <span>Secure Payment Powered by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="container mx-auto px-4 py-12 text-center">
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Error</h1>
      <p>{message}</p>
    </div>
  </div>
);

const LoadingMessage: React.FC = () => (
  <div className="container mx-auto px-4 py-12 text-center">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-64 bg-gray-300 rounded max-w-md mx-auto"></div>
    </div>
  </div>
);

const OrderPlacedMessage: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-8 rounded-lg max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully</h1>
        <p className="text-xl">Your order has been successfully placed. Thank you for shopping!</p>
        <Link href="/">Please wait or Click here.</Link>
      </div>
    </div>
  );
};

const OrderSummary: React.FC<{ items: PaymentItem[] }> = ({ items }) => (
  <div className="mb-8">
    {items.map((item, index) => (
      <div key={index} className="flex justify-between mb-4 pb-4 border-b last:border-b-0">
        <div>
          <p className="font-semibold text-lg">{item.productName}</p>
          <p className="text-sm text-gray-600">Size: {item.size}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">₹{item.price} x {item.quantity}</p>
          <p className="text-sm text-gray-600">Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    ))}
  </div>
);

const PaymentPage: React.FC = () => (
  <Layout>
    <Suspense fallback={<LoadingMessage />}>
      <PaymentPageContent />
    </Suspense>
  </Layout>
);

export default PaymentPage;
