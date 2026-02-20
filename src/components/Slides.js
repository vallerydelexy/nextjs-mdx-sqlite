"use client";
import { webProjects } from "@/utils/SliderData";

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

function ProjectCard({ project, size = "normal" }) {
  const imgHeight =
    size === "tall"
      ? "h-72 sm:h-96"
      : size === "short"
        ? "h-40 sm:h-48"
        : "h-52 sm:h-64";

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
      {/* Image */}
      <div className={`relative overflow-hidden ${imgHeight}`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Year badge */}
        <span className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase bg-black/60 text-white px-2 py-1 rounded-full backdrop-blur-sm">
          {project.year}
        </span>
        {/* Logo */}
        {project.logo && (
          <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 rounded-lg p-1.5 shadow">
            <img
              src={project.logo}
              alt={project.title}
              className="h-5 w-auto object-contain"
            />
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
    </div>
  );
}

export default function Slides() {
  // Split into two columns for masonry, alternating tall/short/normal
  const sizes = [
    "tall",
    "normal",
    "short",
    "normal",
    "tall",
    "short",
    "normal",
    "normal",
  ];

  const col1 = webProjects.filter((_, i) => i % 2 === 0);
  const col2 = webProjects.filter((_, i) => i % 2 === 1);

  const colSizes1 = sizes.filter((_, i) => i % 2 === 0);
  const colSizes2 = sizes.filter((_, i) => i % 2 === 1);

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
          {col1.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              size={colSizes1[i]}
            />
          ))}
        </div>

        {/* Column 2 — offset downward for asymmetry */}
        <div className="flex flex-col gap-4 sm:mt-10">
          {col2.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              size={colSizes2[i]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
