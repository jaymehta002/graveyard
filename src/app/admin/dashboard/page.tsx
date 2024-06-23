'use client'
import React from 'react';
import Default from '../Layouts/Default';
import useProductStore from '@/store/productStore';
import useUserStore from '@/store/userStore';
import useOrderStore from '@/store/orderStore';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const products = useProductStore((state) => state.products);
  const users = useUserStore((state) => state.users);
  const orders = useOrderStore((state) => state.orders);

  const topProducts = products.sort((a, b) => b.rating.average - a.rating.average).slice(0, 5);

  const soldPid = orders.map((order) => order.products.map((product) => product.pid));

  const productChartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: 'Products',
        data: topProducts.map((product) => product.rating.average),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const userChartData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: 'Users',
        data: users.map((user) => user.orders),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const orderChartData = {
    labels: orders.map((order) => `Order ${order.oid}`),
    datasets: [
      {
        label: 'Orders',
        data: orders.map((order) => order.total),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  return (
    <Default>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <Bar data={productChartData} />
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <Pie data={userChartData} />
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <Bar data={orderChartData} />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Product List</h3>
              <ul>
                {products.map((product) => (
                  <li key={product.pid} className="mb-1">
                    {product.name} - {product.category}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-2">User List</h3>
              <ul>
                {users.map((user) => (
                  <li key={user.uid} className="mb-1">
                    {user.name} orders
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-2">Order List</h3>
              <ul>
                {orders.map((order) => (
                  <li key={order.oid} className="mb-1">
                    Order {order.oid} - ${order.total}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Default>
  );
};

export default Dashboard;
