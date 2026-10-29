"use client";

import { forwardRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const FrostedCard = forwardRef(function FrostedCard(
  {
    children,
    className,
    id,
    interactive = true,
    glare = true,
    onPointerMove,
    onPointerLeave,
    ...props
  },
  ref
) {
  const handlePointerMove = useCallback(
    (e) => {
      if (!glare) return;
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
      card.style.setProperty("--glare-opacity", "1");

      if (onPointerMove) onPointerMove(e);
    },
    [glare, onPointerMove]
  );

  const handlePointerLeave = useCallback(
    (e) => {
      if (!glare) return;
      e.currentTarget.style.setProperty("--glare-opacity", "0");
      if (onPointerLeave) onPointerLeave(e);
    },
    [glare, onPointerLeave]
  );

  return (
    <div
      ref={ref}
      id={id}
      onPointerMove={glare ? handlePointerMove : onPointerMove}
      onPointerLeave={glare ? handlePointerLeave : onPointerLeave}
      className={cn(
        // iOS 26 Squircle Geometry
        "group relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px]",
        // Optical Refraction & Translucency
        "backdrop-blur-2xl backdrop-saturate-[190%]",
        // Multi-stop Liquid Glass body (reveals underlying WebGL atmospheric waves)
        "bg-gradient-to-b from-white/75 via-white/50 to-white/35",
        "dark:bg-gradient-to-b dark:from-white/[0.09] dark:via-[#13101d]/65 dark:to-[#0a0712]/80",
        // Perimeter Refractive Rim
        "border border-white/60 dark:border-white/10",
        // Dual-Bevel Specular Inset Reflection & Deep Ambient Shadow
        "shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.85),inset_0_-1px_1px_0_rgba(0,0,0,0.05),0_20px_45px_-15px_rgba(0,0,0,0.07)]",
        "dark:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_-1px_1.5px_0_rgba(0,0,0,0.5),0_25px_50px_-15px_rgba(0,0,0,0.65)]",
        // Tactile micro-motion
        interactive &&
          "transition-[transform,box-shadow,background-color,border-color] duration-500 ease-out hover:scale-[1.005] hover:shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.05),0_28px_60px_-18px_rgba(0,0,0,0.12)] dark:hover:shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_-1px_1.5px_0_rgba(0,0,0,0.5),0_32px_64px_-16px_rgba(0,0,0,0.75)]",
        // Top Specular Hairline with Iridescent Sheen
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-[1px]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/95 before:to-transparent",
        "dark:before:via-amber-300/40",
        // Inner Glass Subsurface Ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-white/30 dark:after:ring-white/5",
        className
      )}
      {...props}
    >
      {/* Dynamic Specular Caustic Spotlight (Follows cursor smoothly across glass) */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 will-change-[opacity]"
          style={{
            opacity: "var(--glare-opacity, 0)",
            background:
              "radial-gradient(650px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.22), transparent 55%)",
          }}
        />
      )}

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

export const LiquidGlassCard = FrostedCard;
export default FrostedCard;
