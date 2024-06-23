'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from './Sidebar';

const Default = ({ children }: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
        </div>
        <div className="hidden lg:flex items-center space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Profile
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-gray-800 flex flex-col items-center space-y-2 p-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
              Profile
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
              Logout
            </button>
          </div>
        )}
      </nav>

        <Sidebar />
      {/* Sidebar */}
      {/* <div className={`fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}>
        <h2 className="text-2xl font-bold p-4">Sidebar</h2>
        <ul>
          {links.map((link) => (
            <li key={link.href} className="mb-4">
              <Link href={link.href}>
                <p className={`block py-2 px-4 rounded ${
                  pathname === link.href ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}>
                  {link.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden" onClick={toggleSidebar}></div>} */}

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Default;
