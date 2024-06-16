'use client';

import React, { useState, useEffect } from 'react';
import Default from '../../Layouts/Default';
import { User } from '@/types/user';
import { useUserStore } from '@/store/userStore';
import { FaTrash } from 'react-icons/fa';
import DeletePrompt from '@/components/Modals/DeleteUser';

const UsersPage: React.FC = () => {
  const users: User[] = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const deleteUser = useUserStore((state) => state.deleteUser);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setSelectedUser(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.uid);
      handleCloseDeleteModal();
    }
  };

  return (
    <Default>
      <div className="p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse shadow-md rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">Name</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">Email</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">Phone</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">Address</th>
                <th className="py-3 px-4 border-b border-gray-300 text-left font-medium text-sm text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-100 transition duration-300">
                  <td className="py-3 px-4 whitespace-nowrap">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">
                    {user.address.street}, {user.address.city}, {user.address.state}, {user.address.country} - {user.address.zip}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => handleDeleteClick(user)}
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

      <DeletePrompt
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </Default>
  );
};

export default UsersPage;
