'use client';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-12 h-12 border-4 border-t-8 border-t-gray-500 border-gray-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
