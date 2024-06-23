'use client'
import React from 'react';
import Layout from '@/template/DefaultLayout';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import User from '@/types/user';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/userStore';

const UserDetails: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <Image 
            src={user.profilePic || `https://via.placeholder.com/150/text=${user.name.slice(0, 1)}`} 
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
        </div>
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
          <p className="text-white text-lg">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    router.push('/login');
    return;
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-800 min-h-screen">
        <h2 className="text-4xl text-white font-bold text-center mb-10">Profile Page</h2>
        <UserDetails user={user} />
      </div>
      <button 
        onClick={signOut}
        className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg"
      >
        Sign out
      </button>
    </Layout>
  );
};

export default ProfilePage;