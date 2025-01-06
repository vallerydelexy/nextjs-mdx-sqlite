"use client";
import animationData from "@/components/lottie/cirlce.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("react-lottie-player"), {
  ssr: false,
});

export default function Avatar() {
  return (
    <div>
      <span className="inline-block relative">
        {typeof window !== "undefined" && (
          <Lottie
            animationData={animationData}
            style={{
              marginTop: "-1rem",
              marginLeft: "-1rem",
              position: "absolute",
              zIndex: 1,
            }}
            play
          />
        )}
        <img
          className="h-32 w-32 rounded-full motion-opacity-in-[0%] motion-blur-in-[5px]"
          src="/images/rizki-aprita.jpg"
          alt=""
          style={{ position: "relative", zIndex: 2 }}
        />
        <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-green-400" />
      </span>
    </div>
  );
}
