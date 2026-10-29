# Stage 9: Implementation Readiness Test Audit Report

**Target:** `docs/designs/camden_lock_portfolio_redesign.md` (`lines 251-345`)  
**Lenses Applied:** `egm-implementation-readiness`, `egm-codebase-details`, `egm-style`  
**Standards Evaluated:** `implementation-readiness-standard`, `codebase-details-standard`

---

## Executive Summary

| Total Findings | 🔴 Blockers | 🟡 Majors | 🟢 Nits | Verdict |
| :---: | :---: | :---: | :---: | :---: |
| **8** | **3** | **3** | **2** | ⚠️ **CHANGES REQUIRED BEFORE IMPLEMENTATION** |

The implementation plan provides a strong high-level architectural decomposition, but contains critical gaps that would block an autonomous engineer during execution: omitted shader dependencies (`FS_NORMALDELTA`), missing raster asset definitions and unaddressed open questions, absence of the `LenisSmoothScrollProvider` in the target file manifest, hallucinated data properties in `webProjects` (`metrics`), and missing `"use client"` / SSR guardrails for Next.js 16 App Router.

---

## Prioritized Findings (Blockers -> Major -> Nits)

### 1. Missing Lenis Scroll Provider Component in Target Files Manifest - Severity: Blocker
* **Reviewer Lens:** `egm-implementation-readiness`
* **Affected Scope:** Lines 253–270, 307–310 (Target Files 4 & 14, Architecture line 85)
* **Discrepancy Description**: The Architecture diagram (line 85) specifies `Page Root --> Lenis Smooth Scroll Provider --> Asymmetric Grid Container`, and Section 3 specifies synchronization between Lenis and GSAP ScrollTrigger. However, the Target Files list omits any smooth scroll provider or wrapper component (`SmoothScrollProvider.jsx`). Neither `TowerParallax.jsx` nor `src/app/page.jsx` specifies who instantiates Lenis, who registers the GSAP ticker sync (`gsap.ticker.add((time) => lenis.raf(time * 1000))`), or how cleanup is handled on unmount. Without this, smooth scrolling will either fail to initialize or create conflicting scroll listeners across components.
* **Rationale & Recommendation**: Add `src/components/providers/SmoothScrollProvider.jsx` (or an explicit client wrapper in `src/app/page.jsx`) to Target Files. Detail the exact initialization pattern with `"use client"`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.lagSmoothing(0)`, and unmount cleanup.

---

### 2. Omission of `FS_NORMALDELTA` from `fluidShaders.js` Export Specification - Severity: Blocker
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** Lines 259–262 (Target File 2: `src/components/fluid/fluidShaders.js`)
* **Discrepancy Description**: Target File 2 enumerates the shaders to export: `VS_BASE`, `VS_TEXEL`, `FS_CLEAR`, `FS_SPLAT`, `FS_ADVECT`, `FS_DIVERGENCE`, `FS_CURL`, `FS_VORTICITY`, `FS_PRESSURE`, `FS_GRADIENT`, `FS_NORMAL`, `FS_SCENE`, `FS_REFRACT`. It completely omits `FS_NORMALDELTA` (present at lines 167–176 of `FluidGlass.jsx`). `FS_REFRACT` directly requires the normal delta texture uniform (`uniform sampler2D u_normDelta;`) to calculate rim lighting (`vec3 edg = texture(u_normDelta, fragUv).xyz; vec3 rim = ...`). Omitting `FS_NORMALDELTA` causes WebGL shader compilation or framebuffer attachment to fail at runtime with an `undefined` reference.
* **Rationale & Recommendation**: Add `FS_NORMALDELTA` explicitly to the exported shader string list in `src/components/fluid/fluidShaders.js` and specify its execution pass in `FluidGlassBackground.jsx`.

---

### 3. Missing Parallax Raster Assets in Target Files and Unresolved Asset Location - Severity: Blocker
* **Reviewer Lens:** `egm-implementation-readiness`
* **Affected Scope:** Lines 267–270 (Target File 4: `TowerParallax.jsx`), Lines 38–40 (Open Questions)
* **Discrepancy Description**: `TowerParallax.jsx` specifies three raster layers: `tower-sky-bg.webp`, `tower-midground.webp`, and `tower-foreground.webp`. However, the implementation plan neither lists these image files under `Target Files to Create` (e.g., `public/images/tower/`), nor specifies their target dimensions, aspect ratios, or exact file paths. Furthermore, Open Question 1 (lines 38–40) asked whether assets should be hosted locally or on CDN, but the implementation plan leaves this undecided. An implementer executing this plan cannot build or render the parallax without knowing where these assets are sourced, placed, and bundled.
* **Rationale & Recommendation**: Formally resolve Open Question 1 and add `public/images/tower/` to Target Files to Create with:
  * `tower-sky-bg.webp` (1440x2560px, compressed atmospheric gradient)
  * `tower-midground.webp` (1440x2560px, Camden Lock tower illustration with transparent background)
  * `tower-foreground.webp` (1440x2560px, silhouetted wires/birds with transparent background)
  * Budget cap: Combined payload $\le 350\text{KB}$.

---

### 4. Missing Client Component Directives (`"use client"`) and SSR Boundaries in Next.js 16 App Router - Severity: Major
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 263–270, 303–310 (Target Files 3, 4, 13, 14)
* **Discrepancy Description**: In Next.js 16, `src/app/layout.jsx` and `src/app/page.jsx` are Server Components by default. Mounting `<FluidGlassBackground />` directly in `layout.jsx` without explicitly enforcing `"use client"` and SSR guards (`typeof window !== 'undefined'`, mounting only inside `useEffect`, or using dynamic import `{ ssr: false }`) will crash prerendering on WebGL canvas operations, `requestAnimationFrame`, and `window.matchMedia`.
* **Rationale & Recommendation**: Explicitly specify the `"use client"` directive for `FluidGlassBackground.jsx`, `TowerParallax.jsx`, and `FrostedCard.jsx` (if interactive). Specify that `FluidGlassBackground.jsx` must guard WebGL initialization behind `useEffect` or an `isMounted` state flag to prevent SSR evaluation crashes.

---

### 5. Data Contract Mismatch in `ProjectShowcase.jsx` (`metrics` & Live Preview URLs) - Severity: Major
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** Lines 283–286 (Target File 8: `src/components/tower/ProjectShowcase.jsx`)
* **Discrepancy Description**: Target File 8 claims it reads `webProjects` from `src/utils/ProjectsData.js` and renders "live preview links, metrics, and technology badges". However, inspection of `src/utils/ProjectsData.js` confirms that `webProjects` has NO `metrics` property (only `title`, `description`, `stacks`, `year`, and optional `domain`, `image`, `imageSet`, `logo`). Furthermore, several items (e.g., `Intel Partners Roundtable`) lack any domain or URL, and `domain` entries lack URL schemes (e.g., `"kuncie.com"` instead of `"https://kuncie.com"`).
* **Rationale & Recommendation**: 
  1. Remove the requirement for `metrics` or specify a clear fallback/conditional render when absent.
  2. Define an explicit URL resolution helper: `project.domain ? (project.domain.startsWith('http') ? project.domain : "https://" + project.domain) : null`.
  3. Specify fallback badge rendering for projects lacking external links.

---

### 6. Undefined Design Token Values and Inconsistent Palette Naming - Severity: Major
* **Reviewer Lens:** `egm-codebase-details` & `egm-style`
* **Affected Scope:** Lines 295–302 (Target Files 11 & 12: `globals.css` and `tailwind.config.js`)
* **Discrepancy Description**: A discrepancy exists between CSS variables and Tailwind tokens:
  * `globals.css` lists: `--color-dusk-indigo`, `--color-dusk-amber`, `--color-sun-cream`, `--color-sun-sky`.
  * `tailwind.config.js` lists: `dusk`, `amber`, `terracotta`, `cream`, `cerulean`.
  Neither file specifies the exact HEX, RGB, or HSL color values. `terracotta` and `cerulean` are listed in Tailwind config but omitted from `globals.css`. Without concrete values, the implementer will be forced to guess, leading to palette drift.
* **Rationale & Recommendation**: Provide concrete color constants in both target file descriptions:
  * `dusk-indigo`: `#121018`
  * `dusk-amber`: `#F59E0B`
  * `terracotta`: `#D97706`
  * `sun-cream`: `#FDFBF7`
  * `sun-cerulean`: `#38BDF8`
  Ensure 1:1 parity between CSS variable definitions and Tailwind theme extensions.

---

### 7. Unspecified HTML Anchor IDs for In-Page Navigation (`#portfolio` & `#contact`) - Severity: Nit
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** Lines 283–294 (Target Files 8 & 10: `ProjectShowcase.jsx` and `ContactSection.jsx`)
* **Discrepancy Description**: The global navigation (`src/config/routes.js`) routes to `/#portfolio` and `/#contact`. The hero section CTA also targets `#portfolio`. The implementation plan does not explicitly instruct `ProjectShowcase.jsx` to declare `id="portfolio"` or `ContactSection.jsx` to declare `id="contact"`. If the implementer uses different IDs or omits them, navigation links will break silently.
* **Rationale & Recommendation**: Explicitly document in Target Files 8 and 10:
  * `ProjectShowcase.jsx`: Root `<section id="portfolio" ...>`
  * `ContactSection.jsx`: Root `<section id="contact" ...>`

---

### 8. Incomplete Cleanup Guidance for `LayoutHeader.jsx` (`overCyber` Flags) - Severity: Nit
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** Lines 311–314 (Target File 15: `src/components/LayoutHeader.jsx`)
* **Discrepancy Description**: `LayoutHeader.jsx` currently contains hardcoded cyber state flags:
  `const overCyber = pathname === "/" && !isAtTop;`
  and hardcoded cyber styling: `border-b border-white/10 bg-[#060608]/85 text-zinc-300 backdrop-blur supports-[backdrop-filter]:bg-[#060608]/70`.
  The plan says "Updates navigation bar to use the warm frosted glass style...", but does not explicitly instruct removing `overCyber` and replacing it with a theme-aware frosted navbar style that matches `<FrostedCard />`.
* **Rationale & Recommendation**: Explicitly instruct replacing `overCyber` logic in `LayoutHeader.jsx` with standard scroll-based transparency (`isAtTop ? "bg-transparent border-transparent" : "bg-stone-50/80 dark:bg-[#121018]/80 backdrop-blur-md border-b border-stone-200/50 dark:border-amber-500/20"`).

---

## Conclusion & Next Actions

Before proceeding with implementation, update Section "Detailed Implementation Plan" in `docs/designs/camden_lock_portfolio_redesign.md` to address the 3 Blockers and 3 Majors identified above.

