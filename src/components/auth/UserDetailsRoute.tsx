'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import LoadingSpinner from '../Loader/loader';
import ProtectedRoute from './ProtectedRoute';
import Image from 'next/image';

const UserDetailsRoute: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    phone: '',
    dob: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zip: '',
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicURL, setProfilePicURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFormData({
            name: userData.name || '',
            gender: userData.gender || '',
            age: userData.age || '',
            phone: userData.phone || '',
            dob: userData.dob || '',
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            country: userData.address?.country || '',
            zip: userData.address?.zip || '',
          });
          setProfilePicURL(userData.profilePic || '');
          router.push('/');
        } else {
          setLoading(false);
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setProfilePicURL(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        let profilePicUrl = profilePicURL;
        if (profilePic) {
          const storageRef = ref(storage, `profilePics/${user.uid}`);
          await uploadBytes(storageRef, profilePic);
          profilePicUrl = await getDownloadURL(storageRef);
        }

        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          uid: user.uid,
          ...formData,
          email: user.email,
          profilePic: profilePicUrl,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            zip: formData.zip,
          }
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <>
            <Input name="name" label="Name" value={formData.name} onChange={handleChange} />
            <Select name="gender" label="Gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Input name="age" label="Age" type="number" value={formData.age} onChange={handleChange} />
          </>
        );
      case 2:
        return (
          <>
            <Input name="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} />
            <Input name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
          </>
        );
      case 3:
        return (
          <>
            <Input name="street" label="Street" value={formData.street} onChange={handleChange} />
            <Input name="city" label="City" value={formData.city} onChange={handleChange} />
            <Input name="state" label="State" value={formData.state} onChange={handleChange} />
            <Input name="country" label="Country" value={formData.country} onChange={handleChange} />
            <Input name="zip" label="ZIP Code" value={formData.zip} onChange={handleChange} />
          </>
        );
      case 4:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
            <div className="flex items-center space-x-4">
              {profilePicURL && (
                <Image src={profilePicURL} alt="Profile" width={100} height={100} className="rounded-full" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 text-center">User Details</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {renderStep()}
            <div className="flex justify-between">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300">
                  Previous
                </button>
              )}
              {step < 4 ? (
                <button type="button" onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                  Next
                </button>
              ) : (
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300">
                  Save Details
                </button>
              )}
            </div>
          </form>
          <div className="mt-4">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-1/4 h-2 ${i <= step ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-500 mt-2">
              Step {step} of 4
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const Input: React.FC<{name: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ name, label, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
);

const Select: React.FC<{name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode}> = ({ name, label, value, onChange, children }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 bg-gray-50 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      {children}
    </select>
  </div>
);

export default UserDetailsRoute;