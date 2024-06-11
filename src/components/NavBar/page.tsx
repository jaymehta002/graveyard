'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaSkull, FaBars, FaShoppingCart, FaUser } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-900 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-gray-200 text-xl font-extrabold flex items-center">
              <FaSkull className="mr-2 text-orange-500" />
              GraveYard
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/men" className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">
                Men
              </Link>
              <Link href="/women" className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">
                Women
              </Link>
              <Link href="/kids" className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">
                Kids
              </Link>
              <Link href="/cart" className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-lg font-medium">
                <FaShoppingCart className="text-lg" />
              </Link>
              <Link href="/account" className="text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium">
                <FaUser className="text-lg" />
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-orange-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <FaBars className="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/men" className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">
              Men
            </Link>
            <Link href="/women" className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">
              Women
            </Link>
            <Link href="/kids" className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">
              Kids
            </Link>
            <Link href="/cart" className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">
              <FaShoppingCart className="inline-block mr-2" />
              Cart
            </Link>
            <Link href="/account" className="text-gray-300 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium">
              <FaUser className="inline-block mr-2" />
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;