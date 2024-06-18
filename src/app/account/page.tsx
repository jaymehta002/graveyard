'use client'
import React from 'react';
import Layout from '@/template/DefaultLayout';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

export type User = {
  uid: string;
  name: string;
  phone: string;
  email: string;
  profilePic: string;
  address: Address;
  orders: string[];
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

const UserDetails: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <Image 
            src={user.profilePic} 
            alt="Profile Picture" 
            width={150} 
            height={150} 
            className="rounded-full border-4 border-orange-500"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl text-white font-bold mb-2">{user.name}</h1>
          <p className="text-gray-400 mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="text-gray-400 mb-2"><strong>Phone:</strong> {user.phone}</p>
          <div className="text-gray-400 mb-2">
            <strong>Address:</strong>
            <p>{user.address.street}</p>
            <p>{user.address.city}, {user.address.state}, {user.address.zip}</p>
            <p>{user.address.country}</p>
          </div>
          {user.orders ? (
            <div className="text-gray-400 mb-2">
              <strong>Orders:</strong>
              <ul className="list-disc list-inside pl-4">
                {user.orders.map((order, index) => (
                  <li key={index}>{order}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-gray-400 mb-2"><strong>Orders:</strong> No orders</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <p className="text-white text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-800 min-h-screen">
        <h2 className="text-4xl text-white font-bold text-center mb-10">Profile Page</h2>
        <UserDetails user={user} />
      </div>
      <button onClick={signOut}>Sign out</button>
    </Layout>
  );
};

export default Page;
