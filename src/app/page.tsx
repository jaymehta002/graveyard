'use client'
import Footer from "@/components/Footer/page";
import Featured from "@/components/LandingPage/Featured";
import Sale from "@/components/LandingPage/Sale";
import TrendingSection from "@/components/LandingPage/Trending";
import LoadingSpinner from "@/components/Loader/loader";
import Navbar from "@/components/NavBar/page";
import useProductStore from "@/store/productStore";

export default function Home() {
  const {isLoading} = useProductStore((state) => state);
  if (isLoading) {
    return (
      <LoadingSpinner />
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
