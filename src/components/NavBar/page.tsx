"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaShoppingCart, FaUser } from "react-icons/fa";
import useCartStore from "@/store/cartStore";
import { useAuth } from "@/hooks/useAuth";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cart = useCartStore((state) => state.items);
  const { user, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-100 py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-black font-black text-xl font-serif flex items-center">
              GRAVEYARD
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link href="/" className="text-black hover:scale-110 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/products/all" className="text-black hover:scale-110 px-3 py-2 rounded-md text-sm font-medium">
                Shop
              </Link>
              <Link href="/contact" className="text-black hover:scale-110 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
              {isAdmin && (
                <Link href="/admin/dashboard" className="text-black hover:scale-110 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
              )}
              <Link href="/cart" className="relative text-black hover:scale-110 px-3 py-2 rounded-md text-lg font-medium">
                <FaShoppingCart className="text-lg" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
              {user ? (
                <Link href="/account" className="text-black hover:scale-110 px-3 py-2 rounded-md text-sm font-medium">
                  <FaUser className="text-lg" />
                </Link>
              ) : (
                <Link href="/login" className="text-black hover:scale-110 px-3 py-2 rounded-md text-sm font-medium">
                  <FaUser className="text-lg" />
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:scale-110 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
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
            <Link href="/" className="text-black hover:scale-110 block px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link href="/products/all" className="text-black hover:scale-110 block px-3 py-2 rounded-md text-base font-medium">
              Shop
            </Link>
            <Link href="/contact" className="text-black hover:scale-110 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </Link>
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-black hover:scale-110 block px-3 py-2 rounded-md text-base font-medium">
                Admin
              </Link>
            )}
            <Link href="/cart" className="text-black hover:scale-110 block px-3 py-2 rounded-md text-base font-medium relative">
              <FaShoppingCart className="inline-block mr-2" />
              Cart
              {cart.length > 0 && (
                <span className="absolute top-4 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link href="/account" className="text-black hover:scale-110 block px-3 py-2 rounded-md text-base font-medium">
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
