"use client";
import { useEffect, useState } from "react";
import animationData from "@/components/lottie/cirlce.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function Avatar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      <span className="inline-block relative">
        <Lottie
          animationData={animationData}
          className="absolute -mt-4 -ml-4 z-[1]"
          play={isMounted}
        />
        <img
          className="h-32 w-32 rounded-full relative z-[2] motion-opacity-in-[0%] motion-blur-in-[5px]"
          src="/rizki-2026.jpg"
          alt="Profile avatar"
        />
        <span
          className="absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-green-400"
          aria-label="Online status indicator"
        />
      </span>
    </div>
  );
}
