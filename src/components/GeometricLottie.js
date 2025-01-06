"use client";
import dynamic from "next/dynamic";
// import Lottie from "react-lottie-player";
import animationData from "@/components/lottie/geometric.json";
import CircleAnimation from "@/components/lottie/cirlce.json";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function GeometricLottie() {
  return (
    <div>
      {typeof window !== "undefined" && (
        <div>
          <Lottie
            animationData={animationData}
            style={{ position: "absolute", top: "90%", left: "50%" }}
            speed={1}
            loop
            play
          />
          <Lottie
            animationData={CircleAnimation}
            style={{ position: "absolute", bottom: "-90%", right: "40%" }}
            speed={1}
            loop
            play
          />
        </div>
      )}
    </div>
  );
}
