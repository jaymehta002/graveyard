'use client'
import React from 'react'
import Layout from '@/template/DefaultLayout';
const TermsAndConditionsPage = () => {
  return (
    <Layout>
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Terms and Conditions</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">1. Delivery</h2>
            <p className="text-gray-600">We charge a flat rate of 70rs for delivery on all orders. Delivery times may vary depending on your location.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">2. Returns and Exchanges</h2>
            <p className="text-gray-600">We offer a 7-day return or exchange policy for all our t-shirts. The item must be unworn, unwashed, and in the same condition as you received it.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">3. Product Information</h2>
            <p className="text-gray-600">We strive to provide accurate descriptions and images of our t-shirts. However, colors may appear slightly different due to monitor settings.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">4. Pricing</h2>
            <p className="text-gray-600">All prices are in Indian Rupees (INR) and are subject to change without notice.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">5. Privacy Policy</h2>
            <p className="text-gray-600">We respect your privacy and will only use your personal information to process your order and improve our services.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-600">All designs and logos on our t-shirts are the property of our brand and may not be reproduced without permission.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">7. Modifications</h2>
            <p className="text-gray-600">We reserve the right to modify these terms and conditions at any time. Please check this page regularly for updates.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">8. Shipping</h2>
            <p className="text-gray-600">We ship to all major cities in India. International shipping is currently not available. Standard shipping takes 3-5 business days, while express shipping (additional charges apply) takes 1-2 business days.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">9. Exchange Policy</h2>
            <p className="text-gray-600">To initiate an exchange, please contact our customer service within 7 days of receiving your order. Exchanges are subject to availability and are limited to one exchange per item. The customer is responsible for the return shipping cost.</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Q: How do I track my order?</h3>
                <p className="text-gray-600">A: Once your order is shipped, you&#39;ll receive a tracking number via email. You can use this number on our website to track your package.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Q: What sizes do you offer?</h3>
                <p className="text-gray-600">A: We offer sizes from XS to XXL for most of our t-shirts. Please check the size guide on each product page for specific measurements.</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700">Q: Do you offer customization?</h3>
                <p className="text-gray-600">A: Yes, we offer customization for bulk orders. Please contact our customer service for more information.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default TermsAndConditionsPage