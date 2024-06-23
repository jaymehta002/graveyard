'use client';
import { db } from '@/config/firebase';
import { Address as AddressType, User } from '@/types/user';
import 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import Modal from './Modal';

interface AddressProps {
  user: User | null;
}

const Address: React.FC<AddressProps> = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState<AddressType | null>(null);

  if (!user) return <>Loading...</>;

  const handleEdit = () => {
    setEditedAddress(user.address);
    setIsEditing(true);
  };

  const updateAddress = async (updatedAddress: AddressType) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      console.log('Updating address for user:', user.uid);
      await updateDoc(userRef, { address: updatedAddress });
      console.log('Address updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleSave = async () => {
    if (editedAddress) {
      await updateAddress(editedAddress);
      user.address = editedAddress; // Update the local user object
    }
  };

  const handleCancel = () => {
    setEditedAddress(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedAddress) {
      setEditedAddress({ ...editedAddress, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      {isEditing && editedAddress && (
        <Modal onClose={handleCancel}>
          <div className="bg-gray-800 text-gray-300 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Address</h2>
            <input
              name="street"
              value={editedAddress.street}
              onChange={handleChange}
              placeholder="Street"
              className="w-full mb-2 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="city"
              value={editedAddress.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full mb-2 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="state"
              value={editedAddress.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full mb-2 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="zip"
              value={editedAddress.zip}
              onChange={handleChange}
              placeholder="Zip"
              className="w-full mb-2 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="country"
              value={editedAddress.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full mb-4 px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="p-4 bg-gray-800 rounded-lg text-gray-300">
        <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
        <p className="text-gray-400 mb-2">Your default delivery address</p>
        <p className="font-semibold">{user.name}</p>
        <p>{user.address.street}</p>
        <p>
          {user.address.city}, {user.address.state}, {user.address.zip}
        </p>
        <p>{user.address.country}</p>
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
        >
          Edit
        </button>
      </div>
    </>
  );
};

export default Address;
