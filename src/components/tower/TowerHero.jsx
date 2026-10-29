"use client";

import Avatar from "@/components/Avatar";
import FrostedCard from "./FrostedCard";
import { ArrowDown, Mail, MapPin, Sparkles } from "lucide-react";

export default function TowerHero() {
  return (
    <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
      <div className="flex flex-col items-start gap-6">
        {/* Availability & Location Pill (iOS 26 Liquid Glass Micro-Pill) */}
        <div className="liquid-glass-pill inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs font-medium text-stone-800 dark:text-amber-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Available for select projects</span>
          <span className="text-stone-400 dark:text-stone-500">·</span>
          <span className="flex items-center gap-1 text-stone-600 dark:text-stone-400">
            <MapPin className="h-3 w-3" />
            Surabaya, ID
          </span>
        </div>

        {/* Main Editorial Card (iOS 26 Liquid Glass) */}
        <FrostedCard className="w-full p-8 md:p-10 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-shrink-0">
              <Avatar />
            </div>

            <div className="flex flex-col space-y-3">

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
                Rizki Aprita
              </h1>
              <p className="text-lg md:text-xl font-medium text-stone-700 dark:text-stone-300">
                Software Engineer that build lots of stuff, Mobile app (iOS & Android), Websites, and backend systems for startups and enterprises.
              </p>
            </div>
          </div>



          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.7),0_8px_20px_-4px_rgba(245,158,11,0.35)] transition-all duration-300 active:scale-95"
            >
              <span>Explore Selected Works</span>
              <ArrowDown className="h-4 w-4" />
            </a>

            <a
              href="#contact"
              className="liquid-glass-button inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-stone-900 dark:text-stone-100"
            >
              <Mail className="h-4 w-4" />
              <span>Get in Touch</span>
            </a>
          </div>
        </FrostedCard>
      </div>
    </section>
  );
}
