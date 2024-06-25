"use client";
import React from "react";
import Layout from "@/template/DefaultLayout";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import User from "@/types/user";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";
import { Order } from "@/types/order";
const UserInfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center mb-4">
    <div className="text-gray-600 mr-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  </div>
);

const UserDetails: React.FC<{ user: User }> = ({ user }) => {
  // console.log(user)
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
          <Image
            src={
              user.profilePic ||
              `https://via.placeholder.com/150/808080/FFFFFF?text=${user.name.slice(
                0,
                1
              )}`
            }
            alt="Profile Picture"
            width={150}
            height={150}
            className="rounded-full border-4 border-gray-200"
          />
          <button className="mt-4 w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center">
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
          <UserInfoItem
            icon={<FaEnvelope />}
            label="Email"
            value={user.email}
          />
          <UserInfoItem icon={<FaPhone />} label="Phone" value={user.phone} />
          <UserInfoItem
            icon={<FaMapMarkerAlt />}
            label="Address"
            value={`${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}, ${user.address.country}`}
          />
        </div>
      </div>
    </div>
  );
};

const ActivitySection: React.FC<{ orders: Order[] }> = ({ orders }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Recent Activity</h2>
      <div className="space-y-8">
        {orders.map((order, index) => (
          <div
            key={order.oid}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-xl font-semibold text-blue-600 overflow-hidden text-ellipsis whitespace-nowrap"
                style={{ maxWidth: "calc(100% - 150px)" }}
              >
                Order <br /> #{order.oid}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "PAID"
                    ? "bg-green-100 text-green-800"
                    : order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
                style={{ minWidth: "100px", textAlign: "center" }}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Ordered on: {new Date(order.date).toLocaleDateString()}
            </p>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Products:</h4>
              <ul className="list-disc list-inside space-y-1">
                {order.products.map((product: any) => (
                  <li key={product.pid} className="text-sm text-gray-600">
                    {product.name} - {product.quantity}x ${product.price} (
                    {product.size})
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">
                Total: ${order.total.toFixed(2)}
              </span>
              <span
                className={`text-sm font-medium ${
                  order.shippingStatus === "DELIVERED"
                    ? "text-green-500"
                    : order.shippingStatus === "CANCELLED"
                    ? "text-red-500"
                    : order.shippingStatus === "PENDING"
                    ? "text-yellow-500"
                    : "text-blue-600"
                }`}
              >
                {order.shippingStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">
                  Shipping Address:
                </h4>
                <p className="text-gray-600">
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.state}
                  <br />
                  {order.address.country}, {order.address.zip}
                </p>
              </div>
              {order.payment && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Payment:</h4>
                  <p className="text-gray-600">
                    Method: {order.payment.method}
                    <br />
                    Transaction: {order.payment.transaction}
                  </p>
                </div>
              )}
              {order.delivery && (
                <div className="col-span-2">
                  <h4 className="font-medium text-gray-700 mb-1">Delivery:</h4>
                  <p className="text-gray-600">
                    Method: {order.delivery.method}
                    <br />
                    Tracking: {order.delivery.tracking}
                    <br />
                    Expected Date:{" "}
                    {new Date(order.delivery.date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-700 text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }
  // console.log(user.orders)
  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
        <h2 className="text-4xl font-bold text-center mb-10">My Profile</h2>
        <UserDetails user={user} />
        <ActivitySection orders={user.orders} />
        <button
          onClick={signOut}
          className="fixed bottom-8 right-8 bg-gray-700 hover:bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition duration-300 flex items-center"
        >
          <FaSignOutAlt className="mr-2" /> Sign out
        </button>
      </div>
    </Layout>
  );
};

export default ProfilePage;
