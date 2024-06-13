'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import LoadingSpinner from '../Loader/loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(async (user : any) => {
      if (!user) {
        router.replace('/login');
      } else {
        setLoading(false);

      }
    });

    return () => {
      authListener();
    };
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;