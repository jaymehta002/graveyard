// PaymentPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/template/DefaultLayout';
import usePaymentStore from '@/store/paymentStore';

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

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const { paymentDetails, setPaymentDetails, savePaymentDetails } = usePaymentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const fetchAndStoreDetails = async () => {
      const detailsString = searchParams.get('details');
      if (detailsString) {
        try {
          const details = JSON.parse(decodeURIComponent(detailsString));
          setPaymentDetails(details);
          await savePaymentDetails(details);
        } catch (err) {
          console.error('Error processing payment details:', err);
          setError('Invalid payment details');
        }
      } else {
        setError('No payment details provided');
      }
    };

    fetchAndStoreDetails();

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [searchParams, setPaymentDetails, savePaymentDetails]);

  const handlePayment = async () => {
    if (!paymentDetails || !razorpayLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentDetails.totalPrice,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();

      if (order.id) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Your Company Name',
          description: `Payment for ${paymentDetails.totalItems} items`,
          order_id: order.id,
          handler: handlePaymentSuccess,
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '9999999999',
          },
          notes: { 
            orderDetails: JSON.stringify(paymentDetails.items)
          },
          theme: { color: '#F97316' },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful', response);
    setOrderPlaced(true);
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  if (!paymentDetails || !razorpayLoaded) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </Layout>
    );
  }

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully</h1>
          <p>Your order has been successfully placed. Thank you for shopping!</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {paymentDetails.items.map((item, index) => (
            <div key={index} className="mb-2">
              <p>{item.productName} - {item.quantity} x ${item.price}</p>
              <p className="text-sm text-gray-600">Size: {item.size}</p>
            </div>
          ))}
          <p className="text-xl font-bold mt-4 mb-6">Total: ${paymentDetails.totalPrice.toFixed(2)}</p>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
