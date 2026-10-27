"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import MobileNavigation from "@/components/MobileNavigation";
import { Navigation } from "@/components/Navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { Icons } from "@/components/icons";
import Link from "next/link";

export function LayoutHeader() {
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();
  const overHero = isAtTop && pathname === "/";
  const overCyber = pathname === "/" && !isAtTop;

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        overHero
          ? "border-b border-transparent bg-transparent text-stone-700 dark:text-stone-100 [&_a]:text-stone-700 dark:[&_a]:text-stone-100 [&_button]:text-stone-700 dark:[&_button]:text-stone-100"
          : overCyber
            ? "border-b border-white/10 bg-[#060608]/85 text-zinc-300 backdrop-blur supports-[backdrop-filter]:bg-[#060608]/70 [&_a]:text-zinc-300 [&_a:hover]:text-white [&_button]:text-zinc-300"
            : isAtTop
              ? "border-b border-transparent bg-transparent backdrop-blur-none"
              : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      }`}
    >
      <div className="flex h-14 items-center">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 w-full">
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 md:order-first order-2"
          >
            <Icons.logo className="h-6 w-6" />
          </Link>
          <Navigation />
          <div className="items-center gap-2" style={{ display: "contents" }}>
            <MobileNavigation />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
