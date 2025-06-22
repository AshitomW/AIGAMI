import Image from "next/image";
import React from "react";

export default function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] group">
          <div className="absolute inset-0 bg-black/10 dark:bg-white/10 rounded-full blur-3xl group-hover:bg-black/20 dark:group-hover:bg-white/20 transition-all duration-500"></div>
          <div className="relative w-full h-full transition-all duration-500 hover:scale-105">
            <Image
              src="/landing.png"
              fill
              className="object-contain animate-float drop-shadow-2xl"
              alt="Landing"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
