'use client'

import React, { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import Default from '../Layouts/Default';
import useUserStore from '@/store/userStore';

const OrderTable = () => {
  const orders = useOrderStore((state) => state.orders) || [];
  const users = useUserStore((state) => state.users);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const getUserName = (userId: string) => {
    const orderUser = users.find((user) => user.uid === userId);
    return orderUser ? orderUser.name : 'Unknown';
  }

  return (
    <Default>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Order ID</th>
                <th className="py-2 px-4 border-b">User ID</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.map((order) => (
                <React.Fragment key={order.oid}>
                  <tr className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{order.oid}</td>
                    <td className="py-2 px-4 border-b">{getUserName(order.uid)}</td>
                    <td className="py-2 px-4 border-b">₹{order.total.toFixed(2)}</td>
                    <td className={`py-2 px-4 border-b ${order.status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                      {order.status}
                    </td>
                    <td className="py-2 px-4 border-b">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => toggleOrderDetails(order.oid)}
                        className="bg-orange-500 text-white py-1 px-2 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                      >
                        {expandedOrderId === order.oid ? 'Hide' : 'Show'} Details
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.oid && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="py-4 px-4 border-b">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h2 className="text-xl font-bold mb-2">Products</h2>
                            <ul>
                              {order.products.map((product, index) => (
                                <li key={index} className="mb-2">
                                  <p><strong>Name:</strong> {product.name}</p>
                                  <p><strong>Price:</strong> ₹{product.price}</p>
                                  <p><strong>Quantity:</strong> {product.quantity}</p>
                                  <p><strong>Size:</strong> {product.size}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h2 className="text-xl font-bold mb-2">Address</h2>
                            <p>{order.address.street}, {order.address.city}</p>
                            <p>{order.address.state}, {order.address.country}, {order.address.zip}</p>
                            {order.payment && (
                              <>
                                <h2 className="text-xl font-bold mt-4 mb-2">Payment</h2>
                                <p><strong>Method:</strong> {order.payment.method}</p>
                                <p><strong>Transaction:</strong> {order.payment.transaction}</p>
                              </>
                            )}
                            {order.delivery && (
                              <>
                                <h2 className="text-xl font-bold mt-4 mb-2">Delivery</h2>
                                <p><strong>Method:</strong> {order.delivery.method}</p>
                                <p><strong>Tracking:</strong> {order.delivery.tracking}</p>
                                <p><strong>Date:</strong> {new Date(order.delivery.date).toLocaleDateString()}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Default>
  );
};

export default OrderTable;
