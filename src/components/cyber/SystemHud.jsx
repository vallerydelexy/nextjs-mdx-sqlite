"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = ["01", "02", "03", "04"];

function formatClock(date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export default function SystemHud() {
  const fillRef = useRef(null);
  const [clock, setClock] = useState("--:--:--");
  const [active, setActive] = useState("01");

  useEffect(() => {
    const update = () => setClock(formatClock(new Date()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("[data-cyber-section]")
    );
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.getAttribute("data-index") || "01");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fill = fillRef.current;
    let raf = 0;

    function update() {
      raf = 0;
      if (!fill) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      fill.style.transform = `scaleY(${progress})`;
    }

    function onScroll() {
      if (!raf) raf = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-y-0 right-5 z-30 hidden items-center lg:flex">
      <div className="flex flex-col items-center gap-5">
        <span className="cyber-mono text-[9px] tracking-[0.3em] text-zinc-600 [writing-mode:vertical-rl]">
          SYSTEM / ONLINE
        </span>

        <div className="cyber-hud-rail">
          <div ref={fillRef} className="cyber-hud-fill" />
        </div>

        <div className="flex flex-col items-center gap-2 font-mono text-[9px] tracking-[0.2em]">
          {SECTIONS.map((section) => (
            <span
              key={section}
              className="cyber-hud-step"
              data-active={active === section}
            >
              {section}
            </span>
          ))}
        </div>

        <span className="cyber-mono text-[9px] tracking-[0.24em] text-zinc-600 [writing-mode:vertical-rl]">
          {clock}
        </span>
      </div>
    </div>
  );
}
