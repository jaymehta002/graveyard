import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">Graveyard</h3>
            <p className="text-sm">
              Embrace the darkness with our chilling streetwear collection. Quality threads for the undead souls.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="/products/all" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Shop
                </a>
              </li>
              {/* <li>
                <a href="/about" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  About
                </a>
              </li> */}
              <li>
                <a href="/contact" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms-conditions" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-500">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/graveyard_wear/" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Instagram
                </a>
              </li>
              {/* <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Twitter
                </a>
              </li> */}
              {/* <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  Facebook
                </a>
              </li> */}
              {/* <li>
                <a href="#" className="text-sm hover:text-orange-500 transition-colors duration-300">
                  TikTok
                </a>
              </li> */}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Graveyard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;