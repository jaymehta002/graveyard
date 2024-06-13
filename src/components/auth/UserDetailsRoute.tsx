'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from './ProtectedRoute';
import { addDoc, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { profile } from 'console';
import LoadingSpinner from '../Loader/loader';

const UserDetailsRoute: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userQuery = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
        const userDocs = await getDocs(userQuery);

        if (!userDocs.empty) {
          router.push('/'); // Redirect to dashboard or any other page for existing users
        } else {
          setLoading(false);
        }
      } else {
        router.push('/login'); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          uid: user.uid,
          name,
          gender,
          age,
          phone,
          dob,
          profilePic: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zip: '',
          }
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">User Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-300 font-medium mb-2">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-gray-300 font-medium mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-300 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="dob" className="block text-gray-300 font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors duration-300"
          >
            Save Details
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default UserDetailsRoute;
