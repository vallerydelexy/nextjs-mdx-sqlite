"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import CyberCanvas from "./CyberCanvas";
import SystemHud from "./SystemHud";
import ProjectArchive from "./ProjectArchive";
import SkillMatrix from "./SkillMatrix";
import ContactUplink from "./ContactUplink";
import DecodeText from "./DecodeText";

const TICKER = [
  "CREATIVE PROTOCOL",
  "SYSTEM ONLINE",
  "WEB / MOBILE / BACKEND",
  "SURABAYA, ID",
  "SCROLL TO DECRYPT",
  "CLASSIFIED INTERFACE",
  "NO TEMPLATES",
];

const MANIFEST = [
  {
    index: "01",
    title: "Ambiguity → Structure",
    body: "Turning fuzzy requirements into clear architecture, flows, and systems.",
  },
  {
    index: "02",
    title: "Speed → Refinement",
    body: "Shipping the working version first, then sharpening every edge.",
  },
  {
    index: "03",
    title: "Detail → Trust",
    body: "Performance, motion, and interface polish are features, not extras.",
  },
];

const CAPABILITIES = [
  "WEB PLATFORMS",
  "MOBILE APPS",
  "BACKENDS",
  "DESIGN SYSTEMS",
  "AUTOMATION",
];

const DOSSIER = [
  ["FILE", "RA-001 / IDENTITY"],
  ["NAME", "Rizki Aprita"],
  ["ROLE", "Software Engineer"],
  ["BASE", "Surabaya, ID"],
  ["VECTOR", "-7.2575 / 112.7521"],
  ["STATUS", "Available for select work"],
  ["FOCUS", "Web · Mobile · Backend"],
];

const GLYPHS = [
  { symbol: "◇", className: "left-[6%] top-[18%] text-4xl" },
  { symbol: "⟁", className: "right-[14%] top-[26%] text-3xl" },
  { symbol: "⌁", className: "left-[13%] bottom-[20%] text-5xl" },
  { symbol: "⧉", className: "right-[6%] bottom-[28%] text-4xl" },
];

function SectionHead({ index, label, title, description }) {
  return (
    <>
      <div className="cyber-section-tag" data-cyber-reveal>
        <span className="tag-index">{index}</span>
        <span>{label}</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff2d2d]" />
          <span>REC</span>
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_0.62fr] md:items-end">
        <h2 data-cyber-reveal className="cyber-display">
          {title}
        </h2>
        <p
          data-cyber-reveal
          className="max-w-md text-sm leading-relaxed text-zinc-500 md:justify-self-end"
        >
          {description}
        </p>
      </div>
    </>
  );
}

export default function CyberExperience() {
  const rootRef = useRef(null);
  const flashRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const flash = flashRef.current;
    if (!root) return undefined;

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger);

    let lenis = null;
    let tickerTick = null;

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        anchors: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      tickerTick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerTick);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      gsap.utils.toArray("[data-cyber-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 42, autoAlpha: 0, filter: "blur(8px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-cyber-stagger]").forEach((group) => {
        const items = group.querySelectorAll("[data-cyber-item]");
        if (!items.length) return;

        gsap.fromTo(
          items,
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.06,
            scrollTrigger: {
              trigger: group,
              start: "top 85%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-cyber-parallax]").forEach((element) => {
        const amount = Number(
          element.getAttribute("data-cyber-parallax") || 12
        );

        gsap.to(element, {
          yPercent: -amount,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      gsap.utils.toArray("[data-cyber-count]").forEach((element) => {
        const target = Number(element.getAttribute("data-cyber-count") || 0);
        const state = { value: 0 };

        gsap.to(state, {
          value: target,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 92%",
            once: true,
          },
          onUpdate: () => {
            element.textContent = String(Math.round(state.value)).padStart(
              2,
              "0"
            );
          },
        });
      });

      if (flash) {
        gsap.utils.toArray("[data-cyber-section]").forEach((section) => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 62%",
            onEnter: () => {
              gsap.fromTo(
                flash,
                { autoAlpha: 0.85, x: -10 },
                {
                  autoAlpha: 0,
                  x: 0,
                  duration: 0.55,
                  ease: "power2.out",
                  overwrite: true,
                }
              );
            },
          });
        });
      }
    }, root);

    ScrollTrigger.refresh();
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
      if (lenis) lenis.destroy();
      if (tickerTick) gsap.ticker.remove(tickerTick);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      id="experience"
      data-cyber-root
      className="cyber-root relative isolate overflow-x-clip"
    >
      <div className="relative">
        <div className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <CyberCanvas />
          </div>

          <div className="cyber-scanlines absolute inset-0" />
          <div className="cyber-noise absolute inset-0" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#060608]/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060608] via-[#060608]/60 to-transparent" />

          <SystemHud />

          <div
            ref={flashRef}
            className="absolute inset-0 z-40 opacity-0 mix-blend-screen"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgba(255,45,45,0.22), transparent 28%, rgba(255,255,255,0.08) 52%, transparent 74%, rgba(255,45,45,0.18)), repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.06) 3px 4px)",
            }}
          />
        </div>

        <div className="relative z-10 -mt-[100svh]">
          <div className="relative z-10 overflow-hidden border-y border-white/10 bg-[#060608]/65 py-3 backdrop-blur-md">
            <div className="cyber-marquee">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  className="flex shrink-0 items-center"
                  aria-hidden={copy === 1 ? "true" : undefined}
                >
                  {TICKER.map((item) => (
                    <span
                      key={`${copy}-${item}`}
                      className="cyber-ticker flex items-center px-6"
                    >
                      <span className="mr-6 h-1 w-1 rounded-full bg-[#ff2d2d]" />
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── 01 / IDENTITY ─────────────────────────────────────── */}
          <section
            id="about"
            data-cyber-section
            data-index="01"
            className="relative flex min-h-[110svh] items-center px-5 py-28 sm:px-8 lg:px-12"
          >
            <span
              aria-hidden="true"
              data-cyber-parallax="16"
              className="cyber-ghost absolute right-[-2%] top-[8%] hidden text-[26vw] lg:block"
            >
              RA
            </span>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden lg:block"
            >
              {GLYPHS.map((glyph, index) => (
                <span
                  key={glyph.symbol}
                  data-cyber-parallax={index % 2 === 0 ? "10" : "18"}
                  className={`absolute font-mono text-white/[0.08] ${glyph.className}`}
                >
                  {glyph.symbol}
                </span>
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-6xl">
              <SectionHead
                index="01"
                label="IDENTITY / DOSSIER"
                title={
                  <>
                    I BUILD{" "}
                    <span className="cyber-outline">DIGITAL</span>
                    <br className="hidden sm:block" /> SYSTEMS
                    <span className="cyber-red">.</span>
                  </>
                }
                description="Software engineer working across web platforms, mobile apps, and the infrastructure that keeps them alive."
              />

              <div className="mt-12 grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
                <div>
                  <div data-cyber-reveal>
                    <p className="cyber-label">
                      <DecodeText>HELLO, I&apos;M RIZKI APRITA</DecodeText>
                    </p>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
                      I build web products, mobile apps, and the systems behind
                      them. From interface to infrastructure, I like owning the
                      whole signal chain.
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
                      Based in Surabaya. Seven years of turning ambiguous ideas
                      into products that ship, scale, and feel effortless to
                      use.
                    </p>
                  </div>

                  <div
                    data-cyber-stagger
                    className="mt-8 flex flex-wrap gap-2"
                  >
                    {CAPABILITIES.map((capability) => (
                      <span
                        key={capability}
                        data-cyber-item
                        className="cyber-chip"
                      >
                        {capability}
                      </span>
                    ))}
                  </div>

                  <div
                    data-cyber-stagger
                    className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3"
                  >
                    {MANIFEST.map((item) => (
                      <div
                        key={item.index}
                        data-cyber-item
                        className="bg-[#070709]/80 p-4"
                      >
                        <span className="cyber-mono text-[9px] tracking-[0.24em] text-[#ff2d2d]">
                          {item.index}
                        </span>
                        <h3 className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-200">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="cyber-panel p-5" data-cyber-reveal>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="cyber-label text-[#ff2d2d]">
                        FILE / IDENTITY
                      </span>
                      <span className="cyber-mono text-[9px] tracking-[0.2em] text-zinc-600">
                        ENCRYPTED
                      </span>
                    </div>

                    <dl className="mt-3 divide-y divide-white/[0.06]">
                      {DOSSIER.map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-baseline justify-between gap-6 py-2.5"
                        >
                          <dt className="cyber-mono text-[9px] tracking-[0.22em] text-zinc-600">
                            {key}
                          </dt>
                          <dd className="cyber-mono text-right text-[11px] text-zinc-300">
                            {value === "Available for select work" ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d2d]" />
                                {value}
                              </span>
                            ) : (
                              value
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="cyber-panel p-5" data-cyber-reveal>
                    <div className="flex items-center justify-between">
                      <span className="cyber-label">CURRENT SIGNAL</span>
                      <span className="flex items-end gap-1">
                        {[3, 6, 4, 8, 5, 9, 4, 7].map((height, index) => (
                          <span
                            key={index}
                            className="w-1 animate-pulse bg-[#ff2d2d]/70"
                            style={{
                              height: `${height * 2}px`,
                              animationDelay: `${index * 90}ms`,
                            }}
                          />
                        ))}
                      </span>
                    </div>
                    <p className="mt-4 text-sm font-bold uppercase leading-snug tracking-[0.08em] text-zinc-200">
                      Building systems that feel inevitable.
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                      Open to collaborations on products with unusual problems
                      and high standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 02 / ARCHIVE ──────────────────────────────────────── */}
          <section
            id="portfolio"
            data-cyber-section
            data-index="02"
            className="relative px-5 py-28 sm:px-8 lg:px-12"
          >
            <div className="mx-auto w-full max-w-6xl">
              <SectionHead
                index="02"
                label="ARCHIVE / DECLASSIFIED"
                title={
                  <>
                    SELECTED WORK
                    <span className="cyber-red">.</span>
                  </>
                }
                description="A declassified index of products shipped across web, mobile, and backend. Hover to preview. Open a file to inspect."
              />

              <ProjectArchive />

              <div
                data-cyber-reveal
                className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"
              >
                <span className="cyber-mono text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                  END OF INDEX / CLEARANCE LEVEL 02
                </span>
                <span className="cyber-mono text-[9px] uppercase tracking-[0.24em] text-zinc-500">
                  10 FILES RECOVERED
                </span>
              </div>
            </div>
          </section>

          {/* ── 03 / MODULES ──────────────────────────────────────── */}
          <section
            id="skills"
            data-cyber-section
            data-index="03"
            className="relative px-5 py-28 sm:px-8 lg:px-12"
          >
            <span
              aria-hidden="true"
              data-cyber-parallax="12"
              className="cyber-ghost absolute right-[-1%] top-[10%] hidden text-[20vw] lg:block"
            >
              50
            </span>

            <div className="relative mx-auto w-full max-w-6xl">
              <SectionHead
                index="03"
                label="MODULES / TECH STACK"
                title={
                  <>
                    TECH MATRIX
                    <span className="cyber-red">.</span>
                  </>
                }
                description="The modules I run in production: languages, frameworks, data layers, and the operations stack holding it all together."
              />

              <SkillMatrix />
            </div>
          </section>

          {/* ── 04 / UPLINK ───────────────────────────────────────── */}
          <section
            id="contact"
            data-cyber-section
            data-index="04"
            className="relative flex min-h-[100svh] flex-col justify-center px-5 py-28 sm:px-8 lg:px-12"
          >
            <div className="mx-auto w-full max-w-6xl">
              <SectionHead
                index="04"
                label="UPLINK / CONTACT"
                title={
                  <>
                    OPEN A CHANNEL
                    <span className="cyber-red">.</span>
                  </>
                }
                description="Have an idea that needs a system? Open a channel. The fastest route is WhatsApp — no brief required."
              />

              <div className="mt-10">
                <ContactUplink />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
