"use client";

import Image from "next/image";
import { webProjects } from "@/utils/ProjectsData";
import FrostedCard from "./FrostedCard";
import { ExternalLink, Calendar, Layers } from "lucide-react";

function normalizeImageSrc(src) {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
    return src;
  }
  return `/${src}`;
}

export default function ProjectShowcase() {
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
            Enterprise platforms, donation ecosystems, and digital products engineered for scalability, reliability, and human-friendly experiences.
          </p>
        </div>

        <div className="space-y-6">
          {webProjects.map((project, idx) => {
            const rawDomain = project.domain;
            const liveUrl = rawDomain
              ? rawDomain.startsWith("http")
                ? rawDomain
                : `https://${rawDomain}`
              : null;

            return (
              <FrostedCard key={project.title + idx} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  {/* Top Bar: Title & Year */}
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 capitalize">
                        {project.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{project.year || "Active Production"}</span>
                      </div>
                    </div>

                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="liquid-glass-button inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-500/30 dark:border-amber-400/20"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="liquid-glass-pill inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400">
                        Enterprise Internal / Protected
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base leading-relaxed text-stone-700 dark:text-stone-300">
                    {project.description}
                  </p>

                  {/* Optional Featured Image */}
                  {project.image && normalizeImageSrc(project.image) && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_-6px_rgba(0,0,0,0.15)] bg-stone-900/10">
                      <Image
                        src={normalizeImageSrc(project.image)}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </div>
                  )}

                  {/* Tech Stacks */}
                  {Array.isArray(project.stacks) && project.stacks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <div className="flex items-center gap-1 text-xs font-medium text-stone-400 dark:text-stone-500 mr-1">
                        <Layers className="h-3.5 w-3.5" />
                        <span>Stack:</span>
                      </div>
                      {project.stacks.map((tech) => (
                        <span
                          key={tech}
                          className="liquid-glass-pill rounded-lg px-2.5 py-1 text-[11px] font-mono font-medium text-stone-800 dark:text-stone-200 uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </FrostedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
