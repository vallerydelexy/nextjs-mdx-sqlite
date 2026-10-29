"use client";

import FrostedCard from "./FrostedCard";
import { Layout, Smartphone, Server, Sparkles } from "lucide-react";

const SKILL_DOMAINS = [
  {
    icon: Layout,
    title: "Web & Frontend Platforms",
    desc: "Building tactile, accessible, high-framerate interfaces and modern web applications.",
    items: ["React", "Next.js (App Router)", "TypeScript", "Tailwind CSS", "GSAP & Motion", "WebGL & Three.js"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    desc: "Cross-platform mobile applications engineered for native performance and smooth touch ergonomics.",
    items: ["React Native", "Flutter", "Expo", "Mobile UI Systems", "State Architecture"],
  },
  {
    icon: Server,
    title: "Backend, APIs & Cloud",
    desc: "Reliable API services, database modeling, and server architectures designed for scale.",
    items: ["Node.js", "Go", "Python & FastAPI", "Prisma ORM", "PostgreSQL / SQLite", "Docker & Deployments"],
  },
  {
    icon: Sparkles,
    title: "Engineering Craft & Systems",
    desc: "Rigorous standards from architecture through deployment.",
    items: ["Design Systems", "Web Performance (Core Web Vitals)", "CI/CD Workflows", "TDD & Code Quality", "Security Baseline"],
  },
];

export default function SkillsetSection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Technical Capabilities
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            Engineering Proficiencies
          </h2>
          <p className="mt-3 text-base text-stone-600 dark:text-stone-300 max-w-xl">
            Battle-tested technologies and architectural principles leveraged across client platforms and systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SKILL_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <FrostedCard key={domain.title} className="p-6 md:p-7 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="liquid-glass-well flex h-11 w-11 items-center justify-center rounded-2xl text-amber-600 dark:text-amber-400 border border-amber-500/30 dark:border-amber-400/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {domain.title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {domain.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-6">
                  {domain.items.map((item) => (
                    <span
                      key={item}
                      className="liquid-glass-pill rounded-xl px-3 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 transition-transform duration-200 hover:scale-[1.04]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </FrostedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
