import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/NavBar/page";
import Footer from "@/components/Footer/page";

const useLayout = ({ children }: any) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <Footer />
    </div>
  );
};

export default useLayout;
