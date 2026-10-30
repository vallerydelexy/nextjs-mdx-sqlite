"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DioramaCanvas from "./DioramaCanvas";

export default function TowerParallax() {
  const containerRef = useRef(null);
  const midgroundRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Subtle ambient parallax drift as user scrolls
    const tween = gsap.to(midgroundRef.current, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-0 bottom-0 -z-[5] w-full max-w-[460px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[860px] xl:max-w-[980px] select-none flex flex-col justify-end transition-opacity duration-700"
    >
      {/* Living Ambient 3D Diorama (Three.js) in Background */}
      <div
        ref={midgroundRef}
        className="relative flex w-full items-end justify-center md:justify-end pr-0 md:pr-4 lg:pr-6 pb-0 md:pb-2 pointer-events-none select-none"
      >
        <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[16/11] lg:aspect-[16/10] pointer-events-none select-none drop-shadow-2xl">
          <DioramaCanvas />
        </div>
      </div>
    </div>
  );
}
