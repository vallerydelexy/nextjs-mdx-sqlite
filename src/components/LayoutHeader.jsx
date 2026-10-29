"use client";

import { useEffect, useState } from "react";
import MobileNavigation from "@/components/MobileNavigation";
import { Navigation } from "@/components/Navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Icons } from "@/components/icons";
import Link from "next/link";

export function LayoutHeader() {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isAtTop
          ? "border-b border-transparent bg-transparent backdrop-blur-none"
          : "border-b border-white/60 dark:border-white/10 bg-white/60 dark:bg-[#121018]/65 backdrop-blur-2xl backdrop-saturate-[180%] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.5),0_8px_30px_-6px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05),0_12px_36px_-6px_rgba(0,0,0,0.5)]"
      }`}
    >
      <div className="flex h-16 items-center">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 w-full">
          <Link
            href="/"
            className="hidden md:flex items-center gap-2.5 md:order-first order-2 group"
          >
            <Icons.logo className="h-6 w-6 text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-105" />
            <span className="font-bold text-stone-900 dark:text-stone-50 tracking-tight text-sm">
              aprita.web.id
            </span>
          </Link>
          <Navigation />
          <div className="flex items-center gap-2">
            <MobileNavigation />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
