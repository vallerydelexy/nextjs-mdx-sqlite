"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { webProjects } from "@/utils/ProjectsData";
import { caseStudies } from "@/data/caseStudies";
import CaseStudyModal from "./CaseStudyModal";
import { ExternalLink, Layers, Sparkles, BookOpen } from "lucide-react";

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

function ProjectTickerCard({ project, onOpenCaseStudy }) {
  const rawDomain = project.domain;
  const liveUrl = rawDomain
    ? rawDomain.startsWith("http")
      ? rawDomain
      : `https://${rawDomain}`
    : null;

  const cardClasses =
    "group relative flex items-stretch h-[134px] w-[390px] lg:w-[420px] shrink-0 rounded-2xl overflow-hidden backdrop-blur-xl transition-transform duration-300 hover:scale-[1.02] text-left " +
    "bg-white/80 dark:bg-[#0c1222]/85 border border-white/60 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-400/40 " +
    "shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.85),0_10px_24px_-6px_rgba(0,0,0,0.06)] " +
    "dark:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(255,255,255,0.04),0_16px_36px_-8px_rgba(0,0,0,0.7)]";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenCaseStudy(project)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenCaseStudy(project);
        }
      }}
      aria-label={`View technical case study for ${project.title}`}
      className={`${cardClasses} cursor-pointer select-none`}
    >
      <div className="flex h-full w-full">
        {/* Thumbnail column */}
        <div className="relative w-[130px] lg:w-[145px] shrink-0 h-full overflow-hidden bg-stone-900/40 dark:bg-stone-950/80 border-r border-stone-200/50 dark:border-white/10">
          {project.image && normalizeImageSrc(project.image) ? (
            <Image
              src={normalizeImageSrc(project.image)}
              alt={`${project.title} preview`}
              fill
              sizes="160px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105 pointer-events-none"
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
                    className="object-contain pointer-events-none"
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
                      className="object-contain pointer-events-none"
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
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`Open live site for ${project.title}`}
                  className="p-1 rounded hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400 hover:text-amber-500 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/5 text-stone-500 dark:text-stone-400 shrink-0">
                  case study
                </span>
              )}
            </div>

            {/* Description (2 lines clamp) */}
            <p className="mt-1 text-[11px] leading-snug text-stone-600 dark:text-stone-300 line-clamp-2">
              {project.description}
            </p>
          </div>

          {/* Bottom line: metrics & case study cue */}
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
              <BookOpen className="h-3 w-3 text-amber-500 dark:text-amber-400 shrink-0" />
              <span>Deep Dive</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectShowcase() {
  const [selectedProject, setSelectedProject] = useState(null);

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const pos1Ref = useRef(0);
  const pos2Ref = useRef(0);
  const speedRef = useRef({ current: 1, target: 1 });
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const idleTimerRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);

  const half = Math.ceil(webProjects.length / 2);
  const row1 = webProjects.slice(0, half);
  const row2 = webProjects.slice(half);

  // 4x repetition for seamless infinite wrapping
  const row1Items = [...row1, ...row1, ...row1, ...row1];
  const row2Items = [...row2, ...row2, ...row2, ...row2];

  // Continuous RAF loop with smooth curved speed interpolation (lerp)
  useEffect(() => {
    const baseSpeed = 45; // pixels per second

    const loop = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      // Curved acceleration / deceleration via exponential decay lerp
      // 1 - Math.exp(-dt * 8) creates a smooth, physics-grade ease curve
      speedRef.current.current +=
        (speedRef.current.target - speedRef.current.current) *
        (1 - Math.exp(-dt * 9));

      const move = baseSpeed * speedRef.current.current * dt;

      if (row1Ref.current) {
        // Track width of the first half (since it repeats 4 times, half width wraps cleanly)
        const halfWidth = row1Ref.current.scrollWidth / 2;
        if (halfWidth > 0) {
          pos1Ref.current += move;
          if (pos1Ref.current >= halfWidth) {
            pos1Ref.current -= halfWidth;
          }
          row1Ref.current.style.transform = `translate3d(-${pos1Ref.current}px, 0, 0)`;
        }
      }

      if (row2Ref.current) {
        const halfWidth = row2Ref.current.scrollWidth / 2;
        if (halfWidth > 0) {
          pos2Ref.current -= move;
          if (pos2Ref.current <= 0) {
            pos2Ref.current += halfWidth;
          }
          row2Ref.current.style.transform = `translate3d(-${pos2Ref.current}px, 0, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Smooth curved deceleration to pause
  const handleHoverStart = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    speedRef.current.target = 0;
  }, []);

  // Smooth curved acceleration to 1 after 300ms idle
  const handleHoverEnd = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      speedRef.current.target = 1;
    }, 300);
  }, []);

  // Pointer drag scrubbing
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    handleHoverStart();
    isDraggingRef.current = true;
    lastXRef.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    // Direct scrub adjustment
    pos1Ref.current -= deltaX;
    pos2Ref.current -= deltaX;

    if (row1Ref.current) {
      const halfWidth = row1Ref.current.scrollWidth / 2;
      if (halfWidth > 0) {
        while (pos1Ref.current < 0) pos1Ref.current += halfWidth;
        while (pos1Ref.current >= halfWidth) pos1Ref.current -= halfWidth;
        row1Ref.current.style.transform = `translate3d(-${pos1Ref.current}px, 0, 0)`;
      }
    }

    if (row2Ref.current) {
      const halfWidth = row2Ref.current.scrollWidth / 2;
      if (halfWidth > 0) {
        while (pos2Ref.current < 0) pos2Ref.current += halfWidth;
        while (pos2Ref.current >= halfWidth) pos2Ref.current -= halfWidth;
        row2Ref.current.style.transform = `translate3d(-${pos2Ref.current}px, 0, 0)`;
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    handleHoverEnd();
  };

  const activeCaseStudy = selectedProject?.slug
    ? caseStudies[selectedProject.slug]
    : null;

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
            Offline marine telemetry, high-concurrency fintech websockets, and
            enterprise systems engineered for scalability and real-world resilience.
          </p>
          <p className="mt-1 text-xs font-mono text-stone-400">
            Tip: Hover to gently decelerate, drag horizontally to scrub, or click any card for an architectural case study.
          </p>
        </div>

        {/* Full-Bleed 2-Row Horizontal Marquee with smooth curved start/stop & 300ms idle auto-resume */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={handleHoverStart}
          onMouseLeave={() => {
            if (isDraggingRef.current) {
              isDraggingRef.current = false;
            }
            handleHoverEnd();
          }}
          className="relative left-1/2 -translate-x-1/2 w-screen max-w-[100vw] overflow-hidden pt-4 pb-6 cursor-grab active:cursor-grabbing select-none"
        >
          {/* Edge fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 lg:w-44 bg-gradient-to-r from-background via-background/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 lg:w-44 bg-gradient-to-l from-background via-background/80 to-transparent z-20" />

          <div className="flex flex-col gap-4">
            {/* Row 1: Leftward infinite marquee */}
            <div className="overflow-hidden">
              <div
                ref={row1Ref}
                className="flex w-max gap-4 px-2 will-change-transform"
              >
                {row1Items.map((project, idx) => (
                  <ProjectTickerCard
                    key={`r1-${project.slug || project.title}-${idx}`}
                    project={project}
                    onOpenCaseStudy={setSelectedProject}
                  />
                ))}
              </div>
            </div>

            {/* Row 2: Rightward infinite marquee */}
            <div className="overflow-hidden">
              <div
                ref={row2Ref}
                className="flex w-max gap-4 px-2 will-change-transform"
              >
                {row2Items.map((project, idx) => (
                  <ProjectTickerCard
                    key={`r2-${project.slug || project.title}-${idx}`}
                    project={project}
                    onOpenCaseStudy={setSelectedProject}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Modal Dialog */}
      {selectedProject && (
        <CaseStudyModal
          project={selectedProject}
          caseStudy={activeCaseStudy}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
