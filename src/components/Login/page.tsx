'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaSkull, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="mb-8 text-center">
          <FaSkull className="text-orange-500 mx-auto mb-4 text-5xl" />
          <h1 className="text-white text-3xl font-bold">GraveYard Login</h1>
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-orange-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors duration-300"
          >
            Login
          </button>
          <p className='mt-2 text-gray-300'>New user? <Link className='text-orange-400 hover:underline' href='/register'> Click here to Register</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;