"use client";

import { useRef, useState } from "react";
import { webProjects } from "@/utils/ProjectsData";

function resolveSrc(src) {
  if (!src) return "";
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/${src}`;
}

function projectImage(project) {
  return resolveSrc(project.image || project.imageSet?.[0] || "");
}

export default function ProjectArchive() {
  const listRef = useRef(null);
  const previewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const active = webProjects[activeIndex];

  function showPreview(index) {
    setActiveIndex(index);
    setVisible(true);
  }

  function hidePreview() {
    setVisible(false);
  }

  function onPointerMove(event) {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview) return;

    const rect = list.getBoundingClientRect();
    const previewWidth = 304;
    const previewHeight = 230;
    const x = Math.min(
      Math.max(event.clientX - rect.left + 26, 0),
      Math.max(0, rect.width - previewWidth)
    );
    const y = Math.min(
      Math.max(event.clientY - rect.top - previewHeight / 2, 0),
      Math.max(0, rect.height - previewHeight)
    );

    preview.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function onFocusRow(index) {
    const list = listRef.current;
    const preview = previewRef.current;
    if (!list || !preview) return;
    const rect = list.getBoundingClientRect();
    preview.style.transform = `translate3d(${Math.max(
      0,
      rect.width - 330
    )}px, 16px, 0)`;
    showPreview(index);
  }

  return (
    <div
      ref={listRef}
      className="relative mt-10"
      onPointerMove={onPointerMove}
      onPointerLeave={hidePreview}
    >
      <div
        ref={previewRef}
        className="cyber-preview hidden md:block"
        data-visible={visible ? "true" : "false"}
        aria-hidden="true"
      >
        <div className="cyber-preview-inner">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <span className="cyber-mono text-[9px] tracking-[0.24em] text-zinc-500">
              FILE / {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="cyber-mono text-[9px] tracking-[0.24em] text-[#ff2d2d]">
              DECRYPTED
            </span>
          </div>

          <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0a0d]">
            {projectImage(active) ? (
              <img
                key={active.title}
                src={projectImage(active)}
                alt=""
                className="h-full w-full object-cover opacity-90"
              />
            ) : (
              <div
                className="flex h-full w-full flex-col items-center justify-center gap-4 px-6"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              >
                {active.logo ? (
                  <img
                    src={resolveSrc(active.logo)}
                    alt=""
                    className="max-h-12 w-auto max-w-[60%] object-contain opacity-80"
                  />
                ) : null}
                <span className="cyber-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  {active.title}
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-2">
              <span className="cyber-mono text-[10px] uppercase tracking-[0.18em] text-zinc-200">
                {active.title}
              </span>
              <span className="cyber-mono text-[10px] text-zinc-400">
                {active.year}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
            <span className="cyber-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
              {active.stacks?.slice(0, 3).join(" / ") || "ARCHIVE"}
            </span>
            <span className="cyber-mono text-[9px] text-[#ff2d2d]">↗</span>
          </div>
        </div>
      </div>

      <ul>
        {webProjects.map((project, index) => {
          const href = project.domain ? `https://${project.domain}` : null;
          const Tag = href ? "a" : "div";
          const image = projectImage(project);

          return (
            <li key={project.title}>
              <Tag
                {...(href
                  ? { href, target: "_blank", rel: "noreferrer" }
                  : {})}
                className={`cyber-project-row group flex items-start gap-4 py-5 sm:items-center sm:gap-6 sm:py-6 ${href ? "cursor-pointer" : "cursor-default"}`}
                onPointerEnter={() => showPreview(index)}
                onFocus={() => onFocusRow(index)}
                onBlur={hidePreview}
              >
                <span className="row-index cyber-mono w-7 shrink-0 pt-1 text-[11px] sm:pt-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3
                      className="cyber-glitch-text text-lg font-black uppercase leading-none tracking-tight text-zinc-100 sm:text-2xl"
                      data-text={project.title}
                    >
                      {project.title}
                    </h3>
                    {project.domain ? (
                      <span className="cyber-mono text-[10px] tracking-[0.12em] text-zinc-600">
                        {project.domain}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 block max-w-xl text-xs leading-relaxed text-zinc-500 sm:text-sm">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 sm:hidden">
                    {project.stacks?.slice(0, 3).map((stack) => (
                      <span key={stack} className="cyber-chip">
                        {stack}
                      </span>
                    ))}
                  </div>
                </div>

                {image ? (
                  <img
                    src={image}
                    alt=""
                    className="mt-1 h-12 w-16 shrink-0 border border-white/10 object-cover sm:hidden"
                  />
                ) : null}

                <span className="hidden max-w-[17rem] flex-wrap gap-1.5 xl:flex">
                  {project.stacks?.slice(0, 3).map((stack) => (
                    <span key={stack} className="cyber-chip">
                      {stack}
                    </span>
                  ))}
                </span>

                <span className="cyber-mono shrink-0 pt-1 text-[11px] text-zinc-500 sm:pt-0">
                  {project.year}
                </span>

                <span className="cyber-mono shrink-0 pt-0.5 text-lg text-zinc-700 transition-colors duration-300 group-hover:text-[#ff2d2d] sm:pt-0">
                  {href ? "↗" : "·"}
                </span>
              </Tag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
