import Navbar from "@/components/NavBar/page";
import Image from "next/image";
import Featured from "@/components/LandingPage/Featured";
import TrendingSection from "@/components/LandingPage/Trending";
import Footer from "@/components/Footer/page";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <>
      <Navbar />
      <Featured />
      <TrendingSection />
      <Footer />
    </>
  );
}
