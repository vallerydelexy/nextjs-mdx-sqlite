"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Layers, AlertCircle, Wrench, Cpu, CheckCircle } from "lucide-react";

export default function CaseStudyModal({ caseStudy, project, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  const title = caseStudy?.title || project.title;
  const subtitle = caseStudy?.subtitle || project.description;
  const stacks = caseStudy?.stacks || project.stacks || [];
  const year = caseStudy?.year || project.year;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadein"
      onClick={onClose}
      data-lenis-prevent="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto overscroll-contain rounded-2xl bg-stone-900 border border-stone-800 text-stone-100 shadow-2xl p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close case study"
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 border-b border-stone-800 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
              {year}
            </span>
            <span className="text-xs font-mono uppercase text-stone-400">
              Technical Case Study
            </span>
          </div>
          <h2
            id="case-study-title"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            {title}
          </h2>
          <p className="text-sm text-stone-300 mt-1 leading-relaxed">
            {subtitle}
          </p>

          {/* Stacks */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {stacks.map((st, i) => (
              <span
                key={i}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700/60"
              >
                {st}
              </span>
            ))}
          </div>
        </div>

        {/* Preview Image if available */}
        {project.image && (
          <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6 border border-stone-800 bg-stone-950">
            <Image
              src={project.image}
              alt={title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 650px"
            />
          </div>
        )}

        {/* Technical Rubric Sections */}
        {caseStudy ? (
          <div className="space-y-6 text-sm leading-relaxed text-stone-300">
            {/* 1. Problem & Constraints */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase font-mono">
                <AlertCircle className="h-4 w-4" />
                <span>The Core Problem & Physical Constraints</span>
              </div>
              <p className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
                {caseStudy.problem}
              </p>
            </div>

            {/* 2. System Architecture & Decisions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase font-mono">
                <Layers className="h-4 w-4" />
                <span>System Architecture & Engineering Decisions</span>
              </div>
              <p className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
                {caseStudy.architecture}
              </p>
            </div>

            {/* 3. Hardest Bottleneck */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase font-mono">
                <Cpu className="h-4 w-4" />
                <span>Hardest Bottleneck Overcome</span>
              </div>
              <p className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
                {caseStudy.bottleneck}
              </p>
            </div>

            {/* 4. Impact & Outcome */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase font-mono">
                <CheckCircle className="h-4 w-4" />
                <span>Production Impact & Deliverables</span>
              </div>
              <p className="bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/80">
                {caseStudy.impact}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-stone-400 leading-relaxed bg-stone-950/60 p-4 rounded-xl border border-stone-800">
            <p>{project.description}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-medium transition-colors"
          >
            Close Case Study
          </button>
        </div>
      </div>
    </div>
  );
}
