'use client';

import { useUserStore } from '@/store/userStore';
import { User } from '@/types/user';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Default from '../../Layouts/Default';

const UsersPage: React.FC = () => {
  const users: User[] = useUserStore((state) => state.users);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const loading = useUserStore((state) => state.isLoading);

  if (loading) {
    return (
      <Default>
        <div className="h-screen flex items-center justify-center">
          <p className="text-white text-lg">Loading...</p>
        </div>
      </Default>
    );
  }

  if(!users || users.length === 0) {
    return (
      <Default>
        <div className="h-screen flex items-center justify-center">
          <p className="text-white text-lg">No users found</p>
        </div>
      </Default>
    );
  }

  return (
    <Default>
      <div className="p-4 sm:p-6 bg-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">User List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse shadow-md rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-3 sm:py-3 sm:px-4 border-b border-gray-300 text-left font-medium text-xs sm:text-sm text-gray-600 uppercase">Name</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 border-b border-gray-300 text-left font-medium text-xs sm:text-sm text-gray-600 uppercase hidden sm:table-cell">Email</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 border-b border-gray-300 text-left font-medium text-xs sm:text-sm text-gray-600 uppercase hidden md:table-cell">Phone</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 border-b border-gray-300 text-left font-medium text-xs sm:text-sm text-gray-600 uppercase hidden lg:table-cell">Address</th>
                <th className="py-2 px-3 sm:py-3 sm:px-4 border-b border-gray-300 text-left font-medium text-xs sm:text-sm text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-100 transition duration-300">
                  <td className="py-2 px-3 sm:py-3 sm:px-4 whitespace-nowrap text-xs sm:text-sm">{user.name}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">{user.email}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm hidden md:table-cell">{user.phone}</td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm hidden lg:table-cell">
                    {user.address.street}, {user.address.city}, {user.address.state}, {user.address.country} - {user.address.zip}
                  </td>
                  <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm">
                    <button
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => deleteUser(user.uid)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Default>
  );
};

export default UsersPage;