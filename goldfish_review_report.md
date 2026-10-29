# Goldfish Annotated Review Report

**Status:** resolved  
**Target:** `docs/designs/camden_lock_portfolio_redesign.md` (`lines 251-345`)

## Prioritized Findings & AI Suggestions

### 1. Missing Lenis Scroll Provider Component in Target Files Manifest [`egm-implementation-readiness`] - Severity: Blocker
*   **Affected Scope:** [Lines 253-270, 307-310](docs/designs/camden_lock_portfolio_redesign.md#L253-L270) (Target Files 4 & 14, Architecture line 85)
*   **Discrepancy Description:** The Architecture diagram specifies `Page Root --> Lenis Smooth Scroll Provider --> Asymmetric Grid Container`, and Section 3 specifies synchronization between Lenis and GSAP ScrollTrigger. However, the Target Files list omits any smooth scroll provider component. Without this, smooth scrolling and GSAP scroll velocity sync cannot initialize reliably.
*   **Rationale:** An implementer executing the file manifest would have no dedicated component to instantiate Lenis or register the GSAP ticker sync.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Adding a dedicated client wrapper `src/components/providers/SmoothScrollProvider.jsx` ensures centralized lifecycle management, GSAP ticker binding, and clean teardown on unmount.
*   ***Proposed Edit:***
    *   Location: Target Files to Create/Modify
    *   Change: Add `src/components/providers/SmoothScrollProvider.jsx` as Target File 1, defining `"use client"`, Lenis initialization, `gsap.ticker.add((time) => lenis.raf(time * 1000))`, `lenis.on('scroll', ScrollTrigger.update)`, and unmount cleanup.

### 2. Omission of `FS_NORMALDELTA` from `fluidShaders.js` Export Specification [`egm-codebase-details`] - Severity: Blocker
*   **Affected Scope:** [Lines 259-262](docs/designs/camden_lock_portfolio_redesign.md#L259-L262) (Target File 2: `src/components/fluid/fluidShaders.js`)
*   **Discrepancy Description:** Target File 2 enumerates shaders to export but omits `FS_NORMALDELTA`. `FS_REFRACT` directly samples the normal delta texture (`uniform sampler2D u_normDelta;`) for rim lighting calculation.
*   **Rationale:** Omitting `FS_NORMALDELTA` results in runtime WebGL compile or framebuffer binding failures.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** `FS_NORMALDELTA` is a mandatory pipeline stage present in the working shader code and must be explicitly exported.
*   ***Proposed Edit:***
    *   Location: Target File 2 (`src/components/fluid/fluidShaders.js`)
    *   Change: Append `FS_NORMALDELTA` to the exported shader list.

### 3. Missing Parallax Raster Assets in Target Files and Unresolved Asset Location [`egm-implementation-readiness`] - Severity: Blocker
*   **Affected Scope:** [Lines 38-40, 267-270](docs/designs/camden_lock_portfolio_redesign.md#L38-L40) (Open Questions & Target File 4)
*   **Discrepancy Description:** Open Question 1 asked whether assets should be hosted locally or on CDN, and Target Files omitted the actual raster image files needed for `TowerParallax.jsx`.
*   **Rationale:** The implementer cannot assemble the parallax layout without defined asset locations, dimensions, and formats.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Hosting the assets locally under `public/images/tower/` ensures offline development, zero external CDN latency, and strict payload enforcement.
*   ***Proposed Edit:***
    *   Location: Open Questions & Target Files to Create
    *   Change: Mark Question 1 resolved (Local hosting under `public/images/tower/`). Add `public/images/tower/tower-sky-bg.webp`, `public/images/tower/tower-midground.webp`, and `public/images/tower/tower-foreground.webp` under Target Files to Create with dimensions (1440x2560px) and combined $\le 350\text{KB}$ payload.

### 4. Missing Client Component Directives (`"use client"`) and SSR Boundaries in Next.js 16 App Router [`egm-style`] - Severity: Major
*   **Affected Scope:** [Lines 263-270, 303-310](docs/designs/camden_lock_portfolio_redesign.md#L263-L270) (Target Files 3, 4, 13, 14)
*   **Discrepancy Description:** Next.js 16 App Router treats components as Server Components by default. Browser-dependent WebGL code, pointer events, and GSAP tweens will crash during SSR if not isolated.
*   **Rationale:** Next.js build and prerender will throw errors accessing `window`, `document`, or WebGL contexts.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Explicit client boundaries and mounting guards prevent SSR crashes.
*   ***Proposed Edit:***
    *   Location: Target Files 3, 4, 5
    *   Change: Specify `"use client"` directive and mounting check (`isMounted` or `useEffect` guard) for `FluidGlassBackground.jsx`, `TowerParallax.jsx`, and `FrostedCard.jsx`.

### 5. Data Contract Mismatch in `ProjectShowcase.jsx` (`metrics` & Live Preview URLs) [`egm-codebase-details`] - Severity: Major
*   **Affected Scope:** [Lines 283-286](docs/designs/camden_lock_portfolio_redesign.md#L283-L286) (Target File 8: `ProjectShowcase.jsx`)
*   **Discrepancy Description:** The design expects `metrics` on `webProjects` and raw live preview URLs, but `webProjects` in `src/utils/ProjectsData.js` contains no `metrics` property, and domain strings lack protocol schemes.
*   **Rationale:** Unchecked property access or malformed URL navigation will cause broken links or missing UI elements.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Aligning the component props with existing real data schema prevents runtime bugs.
*   ***Proposed Edit:***
    *   Location: Target File 8 (`ProjectShowcase.jsx`)
    *   Change: Remove `metrics` requirement. Add protocol normalization helper (`domain.startsWith('http') ? domain : 'https://' + domain`) and fallback handling for projects without external links.

### 6. Undefined Design Token Values and Inconsistent Palette Naming [`egm-codebase-details`, `egm-style`] - Severity: Major
*   **Affected Scope:** [Lines 295-302](docs/designs/camden_lock_portfolio_redesign.md#L295-L302) (Target Files 11 & 12: `globals.css` and `tailwind.config.js`)
*   **Discrepancy Description:** Palette names and concrete hex values are inconsistent and partially omitted between `globals.css` and `tailwind.config.js`.
*   **Rationale:** Leaves styling values ambiguous for the developer, creating palette drift.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Pinning exact hex values establishes strict 1:1 parity across CSS variables and Tailwind classes.
*   ***Proposed Edit:***
    *   Location: Target Files 11 & 12
    *   Change: Define exact shared tokens: `dusk-indigo` (`#121018`), `dusk-amber` (`#F59E0B`), `terracotta` (`#D97706`), `sun-cream` (`#FDFBF7`), and `sun-cerulean` (`#38BDF8`).

### 7. Unspecified HTML Anchor IDs for In-Page Navigation (`#portfolio` & `#contact`) [`egm-codebase-details`] - Severity: Nit
*   **Affected Scope:** [Lines 283-294](docs/designs/camden_lock_portfolio_redesign.md#L283-L294) (Target Files 8 & 10)
*   **Discrepancy Description:** In-page links in navigation and hero point to `/#portfolio` and `/#contact`, but target components did not mandate these anchor IDs.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Prevents broken in-page jump navigation.
*   ***Proposed Edit:***
    *   Location: Target Files 8 & 10
    *   Change: Specify `id="portfolio"` on `ProjectShowcase.jsx` and `id="contact"` on `ContactSection.jsx`.

### 8. Incomplete Cleanup Guidance for `LayoutHeader.jsx` (`overCyber` Flags) [`egm-codebase-details`] - Severity: Nit
*   **Affected Scope:** [Lines 311-314](docs/designs/camden_lock_portfolio_redesign.md#L311-L314) (Target File 15: `LayoutHeader.jsx`)
*   **Discrepancy Description:** `LayoutHeader.jsx` contains lingering `overCyber` logic and hardcoded `#060608` styles.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:** Eliminates dead cyberpunk logic and harmonizes navbar with `<FrostedCard />`.
*   ***Proposed Edit:***
    *   Location: Target File 15
    *   Change: Replace `overCyber` state with scroll-based theme-aware frosted navbar styling (`isAtTop ? "bg-transparent border-transparent" : "bg-stone-50/80 dark:bg-[#121018]/80 backdrop-blur-md border-b border-stone-200/50 dark:border-amber-500/20"`).

