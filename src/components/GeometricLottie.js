'use client';
import Lottie from "react-lottie-player";
import animationData from "@/components/lottie/geometric.json";
import CircleAnimation from "@/components/lottie/cirlce.json";



export default function GeometricLottie() {
  return <div>
    <Lottie animationData={animationData} style={{position: "absolute", top: "90%", left: "50%"}} speed={1} loop play />
    <Lottie animationData={CircleAnimation} style={{position: "absolute", bottom: "-90%", right: "40%"}} speed={1} loop play />

  </div>;
}