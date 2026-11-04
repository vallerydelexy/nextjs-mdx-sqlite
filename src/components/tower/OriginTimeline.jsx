"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, Terminal, Code2, Monitor, Layers, ShieldCheck } from "lucide-react";

const milestones = [
  {
    year: "2007 – 2009",
    period: "Middle School",
    title: "The Friendster CSS Era",
    badge: "Origin",
    icon: Terminal,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    description:
      "Started programming by reverse-engineering CSS rules and DOM layouts to customize Friendster profiles for friends. Learned hex color codes, selector specificity, box-model quirks, and layout hacks before modern flexbox or grid existed.",
    takeaway: "Discovered the thrill of writing code that instantly changes visual reality on a screen.",
  },
  {
    year: "2010 – 2012",
    period: "High School",
    title: "Macromedia Flash & Windows 7 Clone",
    badge: "ActionScript 2.0",
    icon: Monitor,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    description:
      "Tinkered with VBScript, visual design, and fell deeply in love with ActionScript in Macromedia Flash. For the final high school animation assignment, built a fully interactive Windows 7 desktop clone with draggable windows, taskbar, start menu, and an interactive MS Paint clone. The animation teacher famously remarked: 'It is an operating system, not a cartoon!'",
    takeaway: "Mastered event loops, coordinate mathematics, and UI windowing state machines from first principles.",
  },
  {
    year: "2018 – 2020",
    period: "Early Commercial",
    title: "Agency & Commercial Production",
    badge: "Hybrid Full-Stack",
    icon: Layers,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    description:
      "Designed and launched consumer mobile applications (Get Indonesia), e-commerce retail engines (Duta Sarana Computer), and digital campaigns across East Java, bridging graphic design, front-end architecture, and backend APIs.",
    takeaway: "Transitioned from technical passion projects to commercial enterprise requirements and user-driven SLAs.",
  },
  {
    year: "2021 – Present",
    period: "Senior Systems",
    title: "Distributed Systems, Offline Engines & Fintech",
    badge: "Enterprise Caliber",
    icon: ShieldCheck,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description:
      "Architecting mission-critical platforms: offline-first marine PWA telemetry (SailPro), high-concurrency fintech payment transaction pipelines (BagiPulsa/Kirimpulsa), nationwide franchise ERPs (Tehkota), and donation ecosystems (Atapkita).",
    takeaway: "Specialized in resilient state synchronization, high-concurrency transaction safety, and clean architecture.",
  },
];

export default function OriginTimeline() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full my-12">
      {/* Accordion Trigger Header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full group flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#0c1222]/80 border border-stone-200/60 dark:border-white/10 hover:border-amber-500/40 dark:hover:border-amber-400/40 shadow-sm backdrop-blur-xl transition-all duration-300 text-left"
      >
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                Engineering Progression
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-white/10 text-stone-500 dark:text-stone-400">
                2007 – Present
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              The Origin Story: From Flash OS Clones to Enterprise Systems
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-mono text-stone-400 group-hover:text-amber-500 transition-colors">
            {isOpen ? "Collapse Retrospective" : "Read Journey"}
          </span>
          <div
            className={`p-2 rounded-full bg-stone-100 dark:bg-white/5 text-stone-500 dark:text-stone-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </button>

      {/* Accordion Collapsible Content */}
      {isOpen && (
        <div className="mt-4 p-5 sm:p-8 rounded-2xl bg-white/60 dark:bg-[#0c1222]/70 border border-stone-200/50 dark:border-white/5 backdrop-blur-xl animate-fadein">
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-8 max-w-2xl leading-relaxed">
            An unbroken eighteen-year timeline of curiosity, technical craft, and systems engineering.
            How early experiments with browser layouts and desktop environments evolved into resilient, production-grade architectures.
          </p>

          {/* Vertical Chronological Spine */}
          <div className="relative border-l-2 border-stone-200 dark:border-stone-800 ml-4 sm:ml-6 space-y-8">
            {milestones.map((ms, idx) => {
              const Icon = ms.icon;
              return (
                <div key={idx} className="relative pl-6 sm:pl-8 group">
                  {/* Glowing Node on Spine */}
                  <div className="absolute -left-[17px] top-1.5 h-8 w-8 rounded-full bg-stone-100 dark:bg-stone-900 border-2 border-amber-500/50 dark:border-amber-400/50 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-md group-hover:scale-110 group-hover:border-amber-500 transition-all">
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/60 dark:border-stone-800/80 hover:border-amber-500/40 dark:hover:border-amber-400/40 transition-all shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                          {ms.year}
                        </span>
                        <span className="text-stone-300 dark:text-stone-700">·</span>
                        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                          {ms.period}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${ms.color}`}
                      >
                        {ms.badge}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                      {ms.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                      {ms.description}
                    </p>

                    <div className="text-[11px] font-mono bg-stone-50 dark:bg-stone-950/60 p-2.5 rounded-lg border border-stone-200/50 dark:border-stone-800/60 text-stone-500 dark:text-stone-400">
                      <span className="text-amber-500 dark:text-amber-400 font-semibold">Engineering Lesson: </span>
                      {ms.takeaway}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
