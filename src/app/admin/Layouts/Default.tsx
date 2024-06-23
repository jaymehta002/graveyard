'use client';
import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';
import useAuth from '@/hooks/useAuth';
import LoadingSpinner from '@/components/Loader/loader';

const Default = ({ children }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, isAdmin, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isAdmin) {
      router.push('/404'); // Redirect to a 404 page if the user is not an admin
      // return notFound()
    }
  }, [user, loading, router, isAdmin]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  if (loading) {
    return <LoadingSpinner />; // Assuming you have a loading spinner component
  }

  if (!user || !isAdmin) {
    return null; // Prevent rendering if user is not logged in or not an admin
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white w-full p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="text-white lg:hidden"
            onClick={toggleSidebar}
          >
            <FiMenu size={24} />
          </button>
          <span className="ml-2 font-bold">{isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</span>
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white">
            <FiMenu size={24} />
          </button>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 right-0 bg-gray-800 flex flex-col items-center space-y-2 p-4">
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow lg:ml-64 bg-gray-100 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Default;
