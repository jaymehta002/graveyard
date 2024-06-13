'use client';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="w-12 h-12 border-4 border-t-8 border-t-orange-500 border-orange-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;
