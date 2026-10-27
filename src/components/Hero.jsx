"use client";

import { useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import HeroCanvas from "@/components/HeroCanvas";

const phrases = [
  "Software Engineer",
  "Web & App Builder",
  "Digital Craftsman",
  "Based in Surabaya",
];

export default function Hero() {
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setPhrase((current) => (current + 1) % phrases.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      <HeroCanvas />

      <div className="relative z-10 flex flex-col items-center px-6 pb-24 pt-24 text-center">
        <Avatar />

        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.38em] text-stone-500 dark:text-stone-400">
          Portfolio &mdash; Surabaya, Indonesia
        </p>

        <h1 className="mt-4 text-5xl font-extrabold tracking-[-0.045em] text-slate-900 dark:text-stone-50 sm:text-7xl lg:text-8xl">
          Rizki Aprita
        </h1>

        <p
          key={phrase}
          className="animate-fade-in mt-5 min-h-[2rem] text-lg font-medium text-stone-600 dark:text-stone-300 sm:text-2xl"
        >
          {phrases[phrase]}
        </p>

        <a
          href="#portfolio"
          className="mt-10 inline-flex items-center gap-3 rounded-full border border-black/10 bg-black/5 px-6 py-3 text-sm font-medium text-slate-900 backdrop-blur-md transition-colors hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:text-stone-50 dark:hover:bg-white/20"
        >
          View selected work
          <span aria-hidden="true">&darr;</span>
        </a>
      </div>

      <a
        href="#portfolio"
        aria-label="Scroll to selected work"
        className="absolute bottom-8 left-8 z-10 hidden h-24 w-24 text-stone-500 dark:text-stone-300 sm:block"
      >
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full animate-[spin_16s_linear_infinite]"
          aria-hidden="true"
        >
          <defs>
            <path
              id="hero-scroll-path"
              d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            />
          </defs>
          <text className="fill-current text-[9px] uppercase tracking-[0.3em]">
            <textPath href="#hero-scroll-path" startOffset="0">
              scroll down &bull; scroll down &bull;
            </textPath>
          </text>
        </svg>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center text-base"
        >
          &darr;
        </span>
      </a>
    </section>
  );
}
