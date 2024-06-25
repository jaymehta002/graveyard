"use client";
import React from "react";
import Layout from "@/template/DefaultLayout";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import User from "@/types/user";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSignOutAlt } from 'react-icons/fa';

const UserInfoItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
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
              `https://via.placeholder.com/150/808080/FFFFFF?text=${user.name.slice(0, 1)}`
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
          <UserInfoItem icon={<FaEnvelope />} label="Email" value={user.email} />
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

const ActivitySection: React.FC = () => (
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-8">
    <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
    <ul className="space-y-4">
      <li className="border-b border-gray-200 pb-4">
        <p className="font-semibold">Order #12345 shipped</p>
        <p className="text-sm text-gray-500">2 days ago</p>
      </li>
      <li className="border-b border-gray-200 pb-4">
        <p className="font-semibold">Left a review for Product XYZ</p>
        <p className="text-sm text-gray-500">1 week ago</p>
      </li>
      <li>
        <p className="font-semibold">Added 3 items to wishlist</p>
        <p className="text-sm text-gray-500">2 weeks ago</p>
      </li>
    </ul>
  </div>
);

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

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
        <h2 className="text-4xl font-bold text-center mb-10">My Profile</h2>
        <UserDetails user={user} />
        <ActivitySection />
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