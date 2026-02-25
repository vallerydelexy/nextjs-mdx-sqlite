"use client";
import { Leaf } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function IphoneLottie() {
  const [animationData, setAnimationData] = useState(null);
  const style = {
    position: "absolute",
    top: "5vh",
    right: "5vw",
    width: 120,
    height: 120,
  };
  useEffect(() => {
    import("@/components/lottie/iphone.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  if (!animationData) return <div style={style} />;

  return (
    <Lottie style={style} animationData={animationData} speed={1} loop play />
  );
}
