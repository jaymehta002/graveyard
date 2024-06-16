'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/template/DefaultLayout';

interface PaymentDetails {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
}

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const detailsString = searchParams.get('details');
    if (detailsString) {
      try {
        const details = JSON.parse(decodeURIComponent(detailsString));
        setPaymentDetails(details);
      } catch (err) {
        console.error('Error parsing payment details:', err);
        setError('Invalid payment details');
      }
    } else {
      setError('No payment details provided');
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [searchParams]);

  const handlePayment = async () => {
    if (!paymentDetails || !razorpayLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentDetails.price * paymentDetails.quantity * 100, // Convert to paise
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
          description: `Payment for ${paymentDetails.productName}`,
          order_id: order.id,
          handler: handlePaymentSuccess,
          prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '9999999999',
          },
          notes: { 
            productId: paymentDetails.productId,
            size: paymentDetails.size,
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
    // Handle successful payment
    console.log('Payment successful', response);
    // You might want to redirect to a success page or update the order status
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{paymentDetails.productName}</h2>
          <p className="mb-2">Size: {paymentDetails.size}</p>
          <p className="mb-2">Quantity: {paymentDetails.quantity}</p>
          <p className="text-xl font-bold mb-6">Total: ₹{paymentDetails.price * paymentDetails.quantity}</p>
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