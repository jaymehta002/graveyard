'use client'

import React, { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import Default from '../Layouts/Default';
import useUserStore from '@/store/userStore';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { Order } from '@/types/order';

const OrderTable = () => {
  const orders = useOrderStore((state) => state.orders) || [];
  const updateOrder = useOrderStore((state) => state.editOrder);
  const users = useUserStore((state) => state.users);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const shippingStatusOptions = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const getUserName = (userId: string) => {
    const orderUser = users.find((user) => user.uid === userId);
    return orderUser ? orderUser.name : 'Unknown';
  }

  const handleEditStatus = (orderId: string) => {
    setEditingStatus(orderId);
  }

  const handleSaveStatus = (order: Order, newStatus: string) => {
    const newOrder = {
      ...order,
      shippingStatus: newStatus
    }
    updateOrder(newOrder);
    setEditingStatus(null);
  }

  return (
    <Default>
      <div className="container mx-auto px-4 py-8 overflow-x-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8">Orders</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Total</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Shipping Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              <React.Fragment key={order.oid}>
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{order.oid}</td>
                  <td className="py-3 px-6 text-left">{getUserName(order.uid)}</td>
                  <td className="py-3 px-6 text-left">₹{order.total.toFixed(2)}</td>
                  <td className="py-3 px-6 text-left">
                    <span className={`py-1 px-3 rounded-full text-xs ${order.status === 'PAID' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {editingStatus === order.oid ? (
                      <select 
                        value={order.shippingStatus}
                        onChange={(e) => handleSaveStatus(order, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        {shippingStatusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`py-1 px-3 rounded-full text-xs ${
                        order.shippingStatus === 'DELIVERED' ? 'bg-green-200 text-green-600' :
                        order.shippingStatus === 'SHIPPED' ? 'bg-blue-200 text-blue-600' :
                        order.shippingStatus === 'CANCELLED' ? 'bg-red-200 text-red-600' :
                        'bg-yellow-200 text-yellow-600'
                      }`}>
                        {order.shippingStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      {editingStatus === order.oid ? (
                        <button onClick={() => setEditingStatus(null)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                          Cancel
                        </button>
                      ) : (
                        <FaEdit onClick={() => handleEditStatus(order.oid)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" />
                      )}
                      <button onClick={() => toggleOrderDetails(order.oid)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                        {expandedOrderId === order.oid ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedOrderId === order.oid && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50 py-4 px-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h2 className="text-lg font-bold mb-2">Products</h2>
                          <ul className="space-y-2">
                            {order.products.map((product, index) => (
                              <li key={index} className="border-b pb-2">
                                <p><strong>{product.name}</strong></p>
                                <p>Price: ₹{product.price} | Qty: {product.quantity} | Size: {product.size}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h2 className="text-lg font-bold mb-2">Address</h2>
                          <p>{order.address.street}, {order.address.city}</p>
                          <p>{order.address.state}, {order.address.country}, {order.address.zip}</p>
                          {order.payment && (
                            <div className="mt-4">
                              <h2 className="text-lg font-bold mb-2">Payment</h2>
                              <p>Method: {order.payment.method}</p>
                              <p>Transaction: {order.payment.transaction}</p>
                            </div>
                          )}
                          {order.delivery && (
                            <div className="mt-4">
                              <h2 className="text-lg font-bold mb-2">Delivery</h2>
                              <p>Method: {order.delivery.method}</p>
                              <p>Tracking: {order.delivery.tracking}</p>
                              <p>Date: {new Date(order.delivery.date).toLocaleDateString()}</p>
                            </div>
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
    </Default>
  );
};

export default OrderTable;