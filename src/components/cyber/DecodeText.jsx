"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}/\\|_-+*#%&";

export default function DecodeText({
  children,
  className = "",
  as: Tag = "span",
  speed = 28,
}) {
  const text = typeof children === "string" ? children : "";
  const ref = useRef(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    let interval = 0;
    let frame = 0;
    const total = Math.max(18, text.length * 2);

    function tick() {
      frame += 1;
      const progress = Math.min(1, frame / total);
      const revealed = Math.floor(progress * text.length);
      let next = "";

      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (char === " ") next += " ";
        else if (i < revealed) next += char;
        else next += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }

      setDisplay(next);

      if (progress >= 1) {
        window.clearInterval(interval);
        setDisplay(text);
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setDisplay(text.replace(/[^ ]/g, "░"));
        interval = window.setInterval(tick, speed);
      },
      { threshold: 0.6 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
    };
  }, [text, speed]);

  return (
    <Tag ref={ref} className={`relative inline-block ${className}`} aria-label={text}>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 whitespace-nowrap"
      >
        {display}
      </span>
    </Tag>
  );
}
