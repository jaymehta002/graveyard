'use client'
import { useState, useEffect } from 'react';
import Footer from "@/components/Footer/page";
import Featured from "@/components/LandingPage/Featured";
import Sale from "@/components/LandingPage/Sale";
import TrendingSection from "@/components/LandingPage/Trending";
import LoadingSpinner from "@/components/Loader/loader";
import Navbar from "@/components/NavBar/page";
import useProductStore from "@/store/productStore";

export default function Home() {
  const { isLoading: isProductLoading } = useProductStore((state) => state);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for other components
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  if (isProductLoading || isPageLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Featured />
      <TrendingSection />
      <Sale />
      <Footer />
    </>
  );
}