"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function CatLottie() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    import("@/components/lottie/cat.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  if (!animationData) return <div style={{ width: 48, height: 48 }} />;

  return (
    <Lottie
      style={{ width: 48, height: 48 }}
      animationData={animationData}
      speed={1}
      loop
      play
    />
  );
}
