import React from "react";
import Navigation from "./_components/Navigation";
import Heading from "./_components/Heading";
import HeroSection from "./_components/HeroSection";
import Footer from "./_components/Footer";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Navigation />
      <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-12 flex-1 px-6 py-16 animate-fade-in">
        <div className="animate-slide-up">
          <Heading />
        </div>
        <div className="animate-slide-up-delay">
          <HeroSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
