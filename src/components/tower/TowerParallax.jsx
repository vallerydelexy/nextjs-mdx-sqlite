"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TowerParallax() {
  const containerRef = useRef(null);
  const midgroundRef = useRef(null);
  const foregroundRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Midground tower parallax: smooth drift on scroll
      gsap.to(midgroundRef.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      // Foreground wires & birds: faster drift for depth perception
      gsap.to(foregroundRef.current, {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <aside
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-0 top-0 -z-[5] h-screen w-full max-w-[640px] opacity-25 lg:sticky lg:top-0 lg:z-0 lg:w-[44vw] lg:max-w-[640px] lg:opacity-100 lg:self-start select-none"
    >
      {/* Midground Camden Lock Tower illustration */}
      <div
        ref={midgroundRef}
        className="relative flex h-[125%] w-full items-start justify-center pt-6 lg:pt-12"
      >
        <div className="relative h-full w-full max-w-[560px]">
          <Image
            src="/images/tower/camden_lock_tower_v2.png"
            alt="Camden Lock Tower Architecture"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="object-contain object-top"
          />
        </div>
      </div>

      {/* Foreground SVG telephone cables, swallows & ambient birds */}
      <div
        ref={foregroundRef}
        className="pointer-events-none absolute inset-0 -top-24 h-[140%] w-full"
      >
        <svg
          viewBox="0 0 500 900"
          className="h-full w-full stroke-stone-700/60 dark:stroke-stone-300/40 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Overhead telephone / tram wires */}
          <path
            d="M -50 80 Q 220 180 550 120"
            strokeWidth="1.2"
            className="transition-colors duration-700"
          />
          <path
            d="M -50 110 Q 240 210 550 150"
            strokeWidth="1.0"
            strokeDasharray="4 2"
            className="transition-colors duration-700 opacity-70"
          />
          <path
            d="M -50 140 Q 250 250 550 190"
            strokeWidth="1.5"
            className="transition-colors duration-700"
          />
          <path
            d="M 120 0 Q 300 280 480 90"
            strokeWidth="0.8"
            className="transition-colors duration-700 opacity-60"
          />

          {/* Hanging street brackets / lantern cables */}
          <line x1="280" y1="130" x2="280" y2="180" strokeWidth="1.5" />
          <circle
            cx="280"
            cy="185"
            r="4"
            className="fill-amber-400/80 dark:fill-amber-300 stroke-none shadow-glow"
          />

          {/* Flying Swallows (Silhouettes in flight) */}
          <g className="fill-stone-800 dark:fill-stone-200 stroke-none">
            {/* Swallow 1 */}
            <path d="M 90 70 Q 98 60 106 70 Q 100 66 98 74 Q 96 66 90 70 Z" />
            {/* Swallow 2 */}
            <path d="M 130 50 Q 136 42 142 50 Q 138 47 136 53 Q 134 47 130 50 Z" />
            {/* Swallow 3 */}
            <path d="M 390 110 Q 400 98 410 110 Q 403 105 400 115 Q 397 105 390 110 Z" />
            {/* Swallow 4 */}
            <path d="M 430 90 Q 438 82 446 90 Q 440 86 438 94 Q 436 86 430 90 Z" />
          </g>
        </svg>
      </div>
    </aside>
  );
}

