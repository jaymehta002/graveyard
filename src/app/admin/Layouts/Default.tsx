'use client';
import React from 'react';
import Sidebar from './Sidebar';

const Default = ({ children } : any) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-grow ml-64 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Default;
