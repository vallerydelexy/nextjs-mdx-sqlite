"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function DefaultLottie() {
  useEffect(() => {
    import("@/components/lottie/code.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);
  const [animationData, setAnimationData] = useState(null);
  return <Lottie animationData={animationData} speed={1} loop play />;
}
