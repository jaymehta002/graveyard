'use client'
import React from 'react';
import Default from '../Layouts/Default';
import useProductStore from '@/store/productStore';
import useUserStore from '@/store/userStore';
import useOrderStore from '@/store/orderStore';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { format, subMonths } from 'date-fns';

const Dashboard = () => {
  const products = useProductStore((state) => state.products);
  const users = useUserStore((state) => state.users);
  const orders = useOrderStore((state) => state.orders);

  const topProducts = products.sort((a, b) => b.rating.average - a.rating.average).slice(0, 4);

  const productChartData = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: 'Top Products by Rating',
        data: topProducts.map((product) => product.rating.average),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const userChartData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: 'Number of Orders per User',
        data: users.map((user) => user.orders?.length || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const orderChartData = {
    labels: orders.map((order) => `Order ${order.oid}`),
    datasets: [
      {
        label: 'Order Totals',
        data: orders.map((order) => order.total),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
    ],
  };

  // Calculate total revenue generated
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);

  const revenueChartData = {
    labels: ['Total Revenue'],
    datasets: [
      {
        label: 'Total Revenue Generated',
        data: [totalRevenue],
        backgroundColor: ['rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // Process orders to get counts per month over the last 4 months
  const getOrderCountsPerMonth = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const lastFourMonths = Array.from({ length: 4 }, (_, i) => subMonths(now, i));
    const counts = lastFourMonths.map((month) => ({
      month: monthNames[month.getMonth()],
      year: month.getFullYear(),
      count: orders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getMonth() === month.getMonth() && orderDate.getFullYear() === month.getFullYear()
        );
      }).length,
    })).reverse();

    return counts;
  };

  const orderCountsPerMonth = getOrderCountsPerMonth();

  const monthlyOrderChartData = {
    labels: orderCountsPerMonth.map(({ month, year }) => `${month} ${year}`),
    datasets: [
      {
        label: 'Orders Over Last 4 Months',
        data: orderCountsPerMonth.map(({ count }) => count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  return (
    <Default>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white h-64 shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Top Products by Rating</h2>
            <Bar className='h-24' data={productChartData} />
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Number of Orders per User</h2>
            <Pie data={userChartData} />
          </div>
          <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Order Totals</h2>
            <Bar data={orderChartData} />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Orders Over Last 4 Months</h2>
          <div className="bg-white shadow-md rounded p-4">
            <Line data={monthlyOrderChartData} />
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
          <div className="bg-white shadow-md rounded p-4">
            <Doughnut data={revenueChartData} />
          </div>
        </div>
      </div>
    </Default>
  );
};

export default Dashboard;
