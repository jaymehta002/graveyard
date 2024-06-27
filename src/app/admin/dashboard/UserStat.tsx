'use client';
import useOrderStore from '@/store/orderStore';
import useProductStore from '@/store/productStore';
import useUserStore from '@/store/userStore';
import 'chart.js/auto';
import { subMonths } from 'date-fns';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

const Stats = () => {
  const products = useProductStore((state) => state.products);
  const users = useUserStore((state) => state.users);
  const orders = useOrderStore((state) => state.orders);

  const topProducts = products.sort((a, b) => b.rating.average - a.rating.average).slice(0, 4);
  const allOrders = orders.map((order) => order.products.map((product) => product.pid)).flat();
  const datastat: { [key: string]: number } = allOrders.reduce((acc, pid) => {
    acc[pid as string] = (acc[pid as string] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  const sortedDatastat = Object.entries(datastat).sort((a, b) => b[1] - a[1]);

  const topOrders = sortedDatastat.slice(0, 4).map(([pid, count]) => ({
    pid,
    count,
  }));

  const deliveryData = orders.map((order) => order.shippingStatus);
  const shippingData: { [key: string]: number } = deliveryData.reduce((acc: { [key: string]: number }, status: any) => {
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const getProductName = (pid: string) => {
    const product = products.find((product) => product.pid === pid);
    return product ? product.name : 'Unknown';
  };

  const topOrderChartData = {
    labels: topOrders.map((order) => getProductName(order.pid)),
    datasets: [
      {
        label: 'Top Orders',
        data: topOrders.map((order) => order.count),
        backgroundColor: 'rgba(255, 205, 86, 0.6)',
      },
    ],
  };

  const productChartData = {
    labels: topProducts.map((product) => product.name),
    datasets: [
      {
        label: 'Top Products by Rating',
        data: topProducts.map((product) => product.rating.average),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);

  const revenueChartData = {
    labels: [`Total Revenue: ₹${totalRevenue}`],
    datasets: [
      {
        label: 'Total Revenue Generated',
        data: [totalRevenue],
        backgroundColor: ['rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

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
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        tension: 0,
      },
    ],
  };

  const paymentMethods = orders.map((order) => order.payment?.method);
  const paymentChart = paymentMethods.reduce((acc: { [key: string]: number } | undefined, method: any) => {
    if (!acc) {
      acc = {};
    }
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, undefined);

  const paymentChartData = {
    // labels: Object.keys(paymentChart || {}),
    labels: ['Cash On Delivery', 'Paid Online'],
    datasets: [
      {
        label: 'Payment Methods',
        data: Object.values(paymentChart || {}),
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(0, 188, 0, 0.6)', 'rgba(75, 192, 192, 0.6)'],
      },
    ],
  }

  const responsiveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          font: {
            size: 10,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const ratingStep = {
    ...responsiveOptions,
    scales: {
      ...responsiveOptions.scales,
      y: {
        ...responsiveOptions.scales.y,
        ticks: {
          ...responsiveOptions.scales.y.ticks,
          stepSize: 1,
        },
      },
    },
  };

  const shippingGraph = {
    labels: ['Delivered', 'Shipped', 'Processing', 'Cancelled'],
    datasets: [
      {
        label: 'Shipping Status',
        data: Object.values(shippingData),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
      },
    ],
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white shadow-md rounded p-2 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Top Products</h2>
          <div className="h-40 sm:h-48 lg:h-56">
            <Bar data={productChartData} options={ratingStep} />
          </div>
        </div>
        <div className="bg-white shadow-md rounded p-2 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Most Sold</h2>
          <div className="h-40 sm:h-48 lg:h-56">
            <Bar data={topOrderChartData} options={responsiveOptions} />
          </div>
        </div>
        <div className="bg-white shadow-md rounded p-2 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Monthly Orders</h2>
          <div className="h-40 sm:h-48 lg:h-56">
            <Line data={monthlyOrderChartData} options={responsiveOptions} />
          </div>
        </div>
        <div className="bg-white shadow-md rounded p-2 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Revenue</h2>
          <div className="h-40 sm:h-48 lg:h-56">
            <Doughnut 
              data={revenueChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 10,
                      },
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded p-2 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Orders Shipping Status</h2>
          <div className="h-40 sm:h-48 lg:h-56">
            <Doughnut 
              data={shippingGraph} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 10,
                      },
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
        <div className="bg-white shadow-md rounded p-2 sm:p-4">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Payment modes</h2>
          <div className="h-40 sm:h-48 lg:h-56">
            <Doughnut 
              data={paymentChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                      font: {
                        size: 10,
                      },
                    },
                  },
                },
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;