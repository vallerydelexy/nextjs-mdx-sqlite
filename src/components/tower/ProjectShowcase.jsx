"use client";

import Image from "next/image";
import { webProjects } from "@/utils/ProjectsData";
import FrostedCard from "./FrostedCard";
import {
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function normalizeImageSrc(src) {
  if (!src) return null;
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }
  return `/${src}`;
}

function ProjectTickerCard({ project }) {
  const rawDomain = project.domain;
  const liveUrl = rawDomain
    ? rawDomain.startsWith("http")
      ? rawDomain
      : `https://${rawDomain}`
    : null;

  const cardClasses =
    "group relative flex items-stretch h-[134px] w-[390px] lg:w-[420px] shrink-0 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] " +
    "bg-white/80 dark:bg-[#0c1222]/85 border border-white/60 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-400/40 " +
    "shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.85),0_10px_24px_-6px_rgba(0,0,0,0.06)] " +
    "dark:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.04),0_16px_36px_-8px_rgba(0,0,0,0.7)]";

  const cardContent = (
    <div className="flex h-full w-full">
      {/* Thumbnail column */}
      <div className="relative w-[130px] lg:w-[145px] shrink-0 h-full overflow-hidden bg-stone-900/40 dark:bg-stone-950/80 border-r border-stone-200/50 dark:border-white/10">
        {project.image && normalizeImageSrc(project.image) ? (
          <Image
            src={normalizeImageSrc(project.image)}
            alt={`${project.title} preview`}
            fill
            sizes="160px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 bg-gradient-to-br from-amber-500/10 via-stone-800/40 to-stone-950">
            {project.logo && normalizeImageSrc(project.logo) ? (
              <div className="relative h-10 w-24">
                <Image
                  src={normalizeImageSrc(project.logo)}
                  alt={`${project.title} logo`}
                  fill
                  sizes="100px"
                  className="object-contain"
                />
              </div>
            ) : (
              <Layers className="h-7 w-7 text-amber-500/60" />
            )}
          </div>
        )}
      </div>

      {/* Info column */}
      <div className="flex flex-col justify-between p-3.5 flex-1 min-w-0">
        {/* Top: creator / title */}
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              {project.logo && normalizeImageSrc(project.logo) ? (
                <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded">
                  <Image
                    src={normalizeImageSrc(project.logo)}
                    alt=""
                    fill
                    sizes="16px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              )}
              <div className="truncate text-xs">
                <span className="font-mono text-stone-400 dark:text-stone-500 text-[11px]">
                  rizkiaprita /{" "}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100 capitalize">
                  {project.title}
                </span>
              </div>
            </div>

            {liveUrl ? (
              <ExternalLink className="h-3.5 w-3.5 text-stone-400 group-hover:text-amber-500 transition-colors shrink-0" />
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/5 text-stone-500 dark:text-stone-400 shrink-0">
                internal
              </span>
            )}
          </div>

          {/* Description (2 lines clamp) */}
          <p className="mt-1 text-[11px] leading-snug text-stone-600 dark:text-stone-300 line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Bottom line: metrics & official badge */}
        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-200/50 dark:border-white/5">
          <div className="flex items-center gap-1.5 font-mono text-amber-600 dark:text-amber-400">
            <span className="font-semibold">{project.year || "Active"}</span>
            {Array.isArray(project.stacks) && project.stacks[0] && (
              <>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <span className="text-stone-500 dark:text-stone-400 uppercase text-[10px] truncate max-w-[95px]">
                  {project.stacks[0]}
                </span>
              </>
            )}
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
            <CheckCircle2 className="h-3 w-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>{liveUrl ? "Official" : "Production"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (liveUrl) {
    return (
      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardClasses} cursor-pointer`}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={`${cardClasses} cursor-default`}>{cardContent}</div>;
}

export default function ProjectShowcase() {
  const half = Math.ceil(webProjects.length / 2);
  const row1 = webProjects.slice(0, half);
  const row2 = webProjects.slice(half);

  // Repeat for smooth infinite marquee without gaps on high-resolution screens
  const row1Items = [...row1, ...row1, ...row1, ...row1];
  const row2Items = [...row2, ...row2, ...row2, ...row2];

  return (
    <section id="portfolio" className="py-12 lg:py-16 scroll-mt-24">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">
            Selected Works
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">
            Production Projects & Systems
          </h2>
          <p className="mt-3 text-base text-stone-600 dark:text-stone-300 max-w-xl">
            Enterprise platforms, donation ecosystems, and digital products
            engineered for scalability, reliability, and human-friendly
            experiences.
          </p>
        </div>

        {/* Desktop View: Full-Bleed 2-Row Horizontal Marquee Ticker */}
        <div className="relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] overflow-hidden pt-4 pb-6">
          {/* Subtle edge fade gradient masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 lg:w-44 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 lg:w-44 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />

          <div className="flex flex-col gap-4">
            {/* Row 1: Leftward infinite marquee */}
            <div className="marquee-pause flex w-max animate-marquee-left gap-4 px-2 hover:[animation-play-state:paused]">
              {row1Items.map((project, idx) => (
                <ProjectTickerCard
                  key={`r1-${project.title}-${idx}`}
                  project={project}
                />
              ))}
            </div>

            {/* Row 2: Rightward infinite marquee */}
            <div className="marquee-pause flex w-max animate-marquee-right gap-4 px-2 hover:[animation-play-state:paused]">
              {row2Items.map((project, idx) => (
                <ProjectTickerCard
                  key={`r2-${project.title}-${idx}`}
                  project={project}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
