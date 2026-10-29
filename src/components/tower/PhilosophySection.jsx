"use client";

import FrostedCard from "./FrostedCard";
import { Compass, Zap, ShieldCheck } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Compass,
    number: "01",
    title: "Ambiguity → Structure",
    desc: "Ambiguous requirements into concrete architecture, dependable data models, and intuitive user journeys.",
  },
  {
    icon: Zap,
    number: "02",
    title: "Speed → Refinement",
    desc: "Working, verified software early, then iteratively improve performance, polish, and UX ergonomics.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Detail → Trust",
    desc: "Frame rate consistency, tactile micro-interactions, and accessible contrast aren't optional extras—they earn client and user trust.",
  },
];

export default function PhilosophySection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Guiding Philosophy
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            Architectural Tenets
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {PRINCIPLES.map((tenet) => {
            const Icon = tenet.icon;
            return (
              <FrostedCard key={tenet.number} className="p-6 md:p-8">
                <div className="flex items-start gap-5">
                  <div className="liquid-glass-well flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-amber-600 dark:text-amber-400 border border-amber-500/30 dark:border-amber-400/20">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {tenet.title}
                      </h3>
                      <span className="liquid-glass-pill font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full text-stone-600 dark:text-stone-400">
                        {tenet.number}
                      </span>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed text-stone-600 dark:text-stone-300">
                      {tenet.desc}
                    </p>
                  </div>
                </div>
              </FrostedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
