"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function TowerParallax() {
  const containerRef = useRef(null);
  const midgroundRef = useRef(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const video = videoRef.current;
    if (video) {
      // Strictly enforce WebKit iOS non-negotiable autoplay attributes
      video.defaultMuted = true;
      video.muted = true;
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "true");
      video.setAttribute("x5-playsinline", "true");
      video.controls = false;

      const attemptPlay = () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              // Low Power Mode or iOS blocked autoplay.
              // Keep poster visible and retry on first user interaction.
              setIsPlaying(false);
            });
        }
      };

      attemptPlay();

      // Retry play on first touch or scroll if iOS initially blocked it
      const handleUserGesture = () => {
        attemptPlay();
      };

      window.addEventListener("touchstart", handleUserGesture, { once: true, passive: true });
      window.addEventListener("scroll", handleUserGesture, { once: true, passive: true });
      window.addEventListener("click", handleUserGesture, { once: true, passive: true });

      const handlePlaying = () => setIsPlaying(true);
      const handlePause = () => {
        // If iOS forces pause (e.g. background tab or battery saver), hide video to prevent QuickTime HUD
        setIsPlaying(false);
      };

      video.addEventListener("playing", handlePlaying);
      video.addEventListener("pause", handlePause);

      return () => {
        window.removeEventListener("touchstart", handleUserGesture);
        window.removeEventListener("scroll", handleUserGesture);
        window.removeEventListener("click", handleUserGesture);
        video.removeEventListener("playing", handlePlaying);
        video.removeEventListener("pause", handlePause);
      };
    }
  }, []);

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
      className="pointer-events-none fixed right-0 bottom-0 -z-[5] w-full max-w-[500px] md:max-w-[720px] lg:max-w-[860px] xl:max-w-[980px] select-none flex flex-col justify-end transition-opacity duration-700"
    >
      {/* Living Ambient Tower Animation in Background */}
      <div
        ref={midgroundRef}
        className="relative flex w-full items-end justify-end pr-2 md:pr-6 lg:pr-10 pb-4 md:pb-8 pointer-events-none select-none"
      >
        <div className="relative w-full aspect-video pointer-events-none select-none">
          {/* Static Fallback Poster (Always clean, never has native video controls) */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Image
              src="/images/tower/camden_lock_tower_v2.png"
              alt="Tower Camden"
              fill
              sizes="(max-width: 768px) 100vw, 860px"
              priority
              className="object-contain object-bottom drop-shadow-2xl pointer-events-none select-none"
            />
          </div>

          {/* Hardened iOS Safari Video Element */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            // @ts-expect-error WebKit-specific attributes
            webkit-playsinline="true"
            x5-playsinline="true"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            tabIndex={-1}
            preload="auto"
            poster="/images/tower/camden_lock_tower_v2.png"
            className={`w-full h-full object-contain object-bottom drop-shadow-2xl pointer-events-none select-none transition-opacity duration-500 ${
              isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
            } [&::-webkit-media-controls]:!hidden [&::-webkit-media-controls-start-playback-button]:!hidden [&::-webkit-media-controls-panel]:!hidden`}
          >
            <source src="/videos/camden_tower_loop.webm" type="video/webm" />
            <source src="/videos/Anime_lo-fi_animation_loop_d379075d.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
