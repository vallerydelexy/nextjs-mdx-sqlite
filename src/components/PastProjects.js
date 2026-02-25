"use client";
import { useState } from "react";
import { webProjects } from "@/utils/ProjectsData";
import DefaultLottie from "./DefaultLottie";

const stackColors = {
  nextjs: "bg-black text-white dark:bg-white dark:text-black",
  wordpress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  mysql:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  bootstrap:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  tailwind: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  codeigniter: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  flutter: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  figma: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  SEO: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  illustrator:
    "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

function ProjectCard({ project }) {
  // Build the full image list: [project.image, ...project.imageSet] (deduplicated)
  const allImages = [
    ...(project.image ? [project.image] : []),
    ...(project.imageSet ?? []),
  ].filter((src, idx, arr) => arr.indexOf(src) === idx);

  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = allImages.length > 1;

  const handleImageClick = () => {
    if (!hasMultiple) return;
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const currentImage = allImages[currentIndex];

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
      {/* Image */}
      <div
        className={`relative overflow-hidden ${hasMultiple ? "cursor-pointer select-none" : ""}`}
        onClick={handleImageClick}
        title={hasMultiple ? "Click to cycle images" : undefined}
      >
        {currentImage ? (
          <img
            key={currentImage}
            src={currentImage}
            alt={project.title}
            className="w-full h-auto block transition-transform duration-500 group-hover:scale-105 animate-fadein"
          />
        ) : (
          <DefaultLottie />
        )}

        {/* Year badge */}
        <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          {project.year}
        </span>

        {/* Logo */}
        {project.logo && (
          <div className="absolute top-3 right-3 bg-white rounded-lg p-1.5 shadow">
            <img
              src={project.logo}
              alt={project.title}
              className="h-5 w-auto object-contain"
            />
          </div>
        )}

        {/* Image counter dots */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Click hint overlay — shows briefly on first hover when multiple images */}
        {hasMultiple && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest uppercase bg-black/50 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
              {currentIndex + 1} / {allImages.length}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-50 text-base leading-tight capitalize">
            {project.title}
          </h3>
          {project.domain && (
            <span className="text-[11px] text-orange-500 dark:text-orange-400 font-mono">
              {project.domain}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Stacks */}
        <div className="flex flex-wrap gap-1 mt-3">
          {project.stacks?.map((stack, i) => (
            <span
              key={i}
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${stackColors[stack] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
            >
              {stack}
            </span>
          ))}
        </div>
      </div>

      {/* Inline keyframe for fade-in animation */}
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fadein {
          animation: fadein 0.35s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default function PastProjects() {
  const col1 = webProjects.filter((_, i) => i % 2 === 0);
  const col2 = webProjects.filter((_, i) => i % 2 === 1);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      {/* Section header */}
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-orange-500 dark:text-orange-400 font-mono mb-1">
          Past-Projects
        </p>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 leading-none">
          Portfolio
        </h2>
      </div>

      {/* Masonry grid — 2 columns, offset second column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          {col1.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {/* Column 2 — offset downward for asymmetry */}
        <div className="flex flex-col gap-4 sm:mt-10">
          {col2.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
