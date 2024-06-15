'use client';
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const routes = [
    { path: '/admin', name: 'Admin Home' },
    { path: '/admin/settings', name: 'Settings' },
    { path: '/admin/products', name: 'Products' }
  ];

  return (
    <aside className="sidebar bg-gray-900 text-white w-64 h-full fixed">
      <ul className="p-4">
        {routes.map((route, index) => (
          <li key={index} className="mb-4">
            <Link to={route.path} className="text-gray-300 hover:text-white transition-colors">
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
