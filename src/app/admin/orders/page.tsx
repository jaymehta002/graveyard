'use client'

import React, { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import Default from '../Layouts/Default';
import useUserStore from '@/store/userStore';
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { Order } from '@/types/order';

const OrderTable = () => {
  const orders = useOrderStore((state) => state.orders) || [];
  const filteredOrders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-2xl md:text-3xl font-bold mb-8">Orders</h1>
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead className="bg-gray-200 text-gray-600 uppercase text-xs sm:text-sm leading-normal">
          <tr>
            <th className="py-3 px-2 sm:px-6 text-left hidden md:table-cell">Order ID</th>
            <th className="py-3 px-2 sm:px-6 text-left">User</th>
            <th className="py-3 px-2 sm:px-6 text-left">Total</th>
            <th className="py-3 px-2 sm:px-6 text-left hidden md:table-cell">Status</th>
            <th className="py-3 px-2 sm:px-6 text-left">Shipping</th>
            <th className="py-3 px-2 sm:px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-xs sm:text-sm">
          {filteredOrders.map((order) => (
            <React.Fragment key={order.oid}>
              <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-2 sm:px-6 text-left hidden md:table-cell whitespace-nowrap">{order.oid}</td>
                <td className="py-3 px-2 sm:px-6 text-left">{getUserName(order.uid)}</td>
                <td className="py-3 px-2 sm:px-6 text-left">₹{order.total.toFixed(2)}</td>
                <td className="py-3 px-2 sm:px-6 text-left hidden md:table-cell">
                  <span className={`py-1 px-2 rounded-full text-xs ${order.status === 'PAID' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-6 text-left">
                  {editingStatus === order.oid ? (
                    <select 
                      value={order.shippingStatus}
                      onChange={(e) => handleSaveStatus(order, e.target.value)}
                      className="border rounded px-2 py-1 text-xs sm:text-sm"
                    >
                      {shippingStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`py-1 px-2 rounded-full text-xs ${
                      order.shippingStatus === 'DELIVERED' ? 'bg-green-200 text-green-600' :
                      order.shippingStatus === 'SHIPPED' ? 'bg-blue-200 text-blue-600' :
                      order.shippingStatus === 'CANCELLED' ? 'bg-red-200 text-red-600' :
                      'bg-yellow-200 text-yellow-600'
                    }`}>
                      {order.shippingStatus}
                    </span>
                  )}
                </td>
                <td className="py-3 px-2 sm:px-6 text-center">
                  <div className="flex item-center justify-center">
                    {editingStatus === order.oid ? (
                      <button onClick={() => setEditingStatus(null)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                        &#x2716;
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
                  <td colSpan={6} className="bg-gray-50 py-4 px-2 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold mb-2">Products</h2>
                        <ul className="space-y-2">
                          {order.products.map((product, index) => (
                            <li key={index} className="border-b pb-2">
                              <p className="font-semibold">{product.name}</p>
                              <p className="text-xs sm:text-sm">Price: ₹{product.price} | Qty: {product.quantity} | Size: {product.size}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold mb-2">Address</h2>
                        <p className="text-xs sm:text-sm">{order.address.street}, {order.address.city}</p>
                        <p className="text-xs sm:text-sm">{order.address.state}, {order.address.country}, {order.address.zip}</p>
                        {order.payment && (
                          <div className="mt-4">
                            <h2 className="text-base sm:text-lg font-bold mb-2">Payment</h2>
                            <p className="text-xs sm:text-sm">Method: {order.payment.method}</p>
                            <p className="text-xs sm:text-sm">Transaction: {order.payment.transaction}</p>
                          </div>
                        )}
                        {order.delivery && (
                          <div className="mt-4">
                            <h2 className="text-base sm:text-lg font-bold mb-2">Delivery</h2>
                            <p className="text-xs sm:text-sm">Method: {order.delivery.method}</p>
                            <p className="text-xs sm:text-sm">Tracking: {order.delivery.tracking}</p>
                            <p className="text-xs sm:text-sm">Date: {new Date(order.delivery.date).toLocaleDateString()}</p>
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
  </div>
</Default>
  );
};

export default OrderTable;