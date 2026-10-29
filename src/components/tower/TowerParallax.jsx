"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TowerParallax() {
  const containerRef = useRef(null);
  const midgroundRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => { });
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Subtle ambient parallax drift as user scrolls
    gsap.to(midgroundRef.current, {
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
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-0 bottom-0 -z-[5] w-full max-w-[500px] md:max-w-[720px] lg:max-w-[860px] xl:max-w-[980px] select-none flex flex-col justify-end  transition-opacity duration-700"
    >
      {/* Living Ambient Tower Animation in Background */}
      <div
        ref={midgroundRef}
        className="relative flex w-full items-end justify-end pr-2 md:pr-6 lg:pr-10 pb-4 md:pb-8"
      >
        <div className="relative w-full aspect-video">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/tower/camden_lock_tower_v2.png"
            className="w-full h-full object-contain object-bottom drop-shadow-2xl"
          >
            <source src="/videos/camden_tower_loop.webm" type="video/webm" />
            <source src="/videos/Anime_lo-fi_animation_loop_d379075d.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}

