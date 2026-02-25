"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false });

export default function TriangleLottie() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    import("@/components/lottie/geometric.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  if (!animationData) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "60vh",
        left: "0",
        width: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <Lottie
        style={{ width: 780 }}
        animationData={animationData}
        speed={1}
        loop
        play
      />
    </div>
  );
}
