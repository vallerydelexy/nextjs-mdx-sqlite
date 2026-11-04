# Portfolio Restructuring & Historical Case Studies

* **Author:** Rizki Aprita
* **Status:** Approved
* **Date:** 2026-10-31

--------------------------------------------------------------------------------

## Overview

This project restructures `aprita.web.id` to accurately reflect a Senior Full-Stack and Mobile Systems Engineer. It addresses the current presentation gap where high-complexity production work (`SailPro`, `BagiPulsa/Kirimpulsa`, ``) is omitted, defunct projects (`versus.co.id`, `pixelninja.id`) expose dead or third-party owned links, and entry-level design work dilutes technical credibility.

The overhaul delivers:
1. Complete sanitization of external domain links for dead or sold domains without introducing ungrounded status badges.
2. Ingestion of 2 flagship engineering systems (`SailPro`, `BagiPulsa`, ``) into the showcase.
3. Interactive mouse/touch drag navigation on the infinite marquee with a 3-second idle auto-resume.
4. Deep technical case study modal support for all featured systems.
5. A dedicated Vertical Chronological Spine (`OriginTimeline.jsx` / Accordion) documenting an unbroken engineering progression from 2007 middle-school CSS to present enterprise systems.

## The Problem

1. **Broken Window of Defunct Domains**: Projects like `Versus` and `Pixel Ninja` still advertise external domain links that lead to expired DNS, domain squatting, or completely unrelated businesses. Furthermore, removing `domain` naively causes `ProjectShowcase.jsx` to incorrectly label dead startups as active internal production applications.
2. **Hidden Production Capabilities**: Systems demonstrating deep engineering—such as offline-first marine PWA telemetry (`SailPro`), fintech high-throughput payment websockets (`BagiPulsa`), and enterprise Flutter clean architecture (``)—exist only as local repositories on disk and are absent from the live portfolio.
3. **Narrative Dilution**: Student experiments and design work from 2018–2020 are mixed into the primary showcase, presenting the developer as a junior web builder rather than a senior systems engineer.

## Goals

* **Goal 1**: Ingest metadata, tech stacks, and preview assets for `SailPro`, `BagiPulsa/Kirimpulsa`, and `` into `src/utils/ProjectsData.js`.
* **Goal 2**: Remove all dead/sold domain properties and eliminate misleading `"internal" / "Production"` fallback badges across `src/components/tower/ProjectShowcase.jsx`.
* **Goal 3**: Retain the infinite marquee and `backdrop-blur-xl` styling while implementing interactive horizontal swipe/drag controls, hover-pause, and a 3-second idle timeout before auto-resuming.
* **Goal 4**: Introduce an accessible technical case study dialog detailing architectural bottlenecks, system decisions, and quantifiable outcomes for selected projects.
* **Goal 5**: Implement `src/components/tower/OriginTimeline.jsx` as an expandable accordion with a vertical chronological spine on the homepage, framing early engineering history (2007 Friendster CSS, 2010 Macromedia Flash Windows 7 OS clone) into a continuous track record.

## Non-Goals

* **Non-Goal 1**: No speculative corporate badges (e.g., "Acquired by X", "Defunct", "Bankrupt").
* **Non-Goal 2**: No removal or structural degradation of the 3D ambient canvas components (`TowerParallax`, `DioramaCanvas`).
* **Non-Goal 3**: No destructive deletion of historical project data; early projects are reorganized into the origin story timeline.

## Critical User Journeys (CUJs)

### CUJ 1: Technical Recruiter / Tech Lead Evaluates Senior Systems Caliber
* **Given**: A hiring lead lands on `aprita.web.id` looking for senior engineering signals.
* **When**: They view the `ProjectShowcase` section.
* **Then**: They immediately see high-complexity systems (`SailPro`, `BagiPulsa`, ``, `Tehkota`). Dragging the marquee allows inspecting technical stacks. Clicking a project opens a technical case study detailing offline sync, websocket throughput, and architecture. No dead domain links are encountered.

### CUJ 2: Visitor Explores Career Trajectory & Engineering Depth
* **Given**: A visitor scrolls past the modern project showcase.
* **When**: They reach the `OriginTimeline` section.
* **Then**: They see an expandable accordion trigger for the Origin Story. Upon opening, they interact with a vertical chronological spine detailing the developer's journey from 2007 Friendster CSS hacks, through the 2010 Flash Windows 7 clone, to modern distributed mobile/web architecture.

--------------------------------------------------------------------------------

## Technical Plan (Architecture)

### 1. Data Schema & Separation of Concerns

To prevent initial page bundle bloat, project display data and deep case study text are split cleanly:

```text
+-----------------------------------------------------------------------+
|                              page.jsx                                 |
|                                                                       |
|  +---------------------------+        +----------------------------+  |
|  |     ProjectShowcase       |        |       OriginTimeline       |  |
|  |  (Reads webProjects list) |        | (Reads originMilestones)   |  |
|  +-------------+-------------+        +----------------------------+  |
|                |                                                      |
|         (User clicks card)                                            |
|                v                                                      |
|  +---------------------------+                                        |
|  |     CaseStudyModal        | <--- Loads src/data/caseStudies/*.js   |
|  |  (Radix Dialog / Drawer)  |      (Dynamic on demand)               |
|  +---------------------------+                                        |
+-----------------------------------------------------------------------+
```

#### `src/utils/ProjectsData.js` Updates
- **Dead Domains Purged**: `versus.co.id` and `pixelninja.id` fields removed.
- **New Projects Added**:
  - `sailpro`: Maritime PWA, offline sync, custom map engine, bidirectional WebSockets (Next.js, TypeScript, Leaflet/MapLibre, WebSockets).
  - `bagipulsa`: Fintech payment gateway & digital goods distribution, real-time transaction WebSockets (Flutter, Node.js, WebSockets, MySQL).

- **Slug Keying**: Each entry gains a unique `slug` (e.g. `sailpro`, `bagipulsa`, `tehkota`, `versus`, `atapkita`) mapping directly to detailed technical case study content.

### 2. Interactive Infinite Marquee Engine (`ProjectShowcase.jsx`)

The current CSS animation approach (`animate-marquee-left` / `animate-marquee-right`) uses static keyframes that cannot be scrubbed smoothly by mouse drag or touch swipes without jumping.

#### Architecture of the Interactive Marquee:
1. **Interactive Container**: Wraps the duplicated card tracks with a unified touch/pointer controller:
   - `onPointerDown`: Captures start X coordinate and pauses the ticker animation.
   - `onPointerMove`: Applies direct `transform: translateX(...)` based on drag delta (clamped to the loop width for seamless infinite rollover).
   - `onPointerUp` / `onPointerLeave`: Triggers a 3000ms idle timer (`setTimeout`).
2. **Idle Timer Engine**:
   - If no mouse move, scroll, or touch event occurs within 3 seconds, a smooth velocity transition re-engages the continuous animation loop.
   - Hovering (`onMouseEnter`) pauses the marquee immediately; leaving resets the 3s timer.
3. **Card Cleanliness**:
   - If `project.domain` is present and valid, renders a subtle external link icon.
   - If `project.domain` is absent, **no badge is rendered** (neither `"internal"` nor `"Production"`). It renders the year and primary stack cleanly.
   - The entire card is keyboard-accessible (`Enter` or `Space` opens the case study modal).

### 3. Technical Case Study Modal (`CaseStudyModal.jsx`)

A reusable, accessible dialog built using `@radix-ui/react-dialog` (already present in the repository dependencies):
- **Structure**:
  - **Header**: Project Title, Year, Primary Architecture Tags.
  - **Section 1: The Core Problem & Constraints**: Physical or business limitations (e.g., zero internet on ships at sea, high-concurrency payment drops).
  - **Section 2: System Architecture & Decisions**: Data flows, state synchronization, client-server models.
  - **Section 3: Hardest Bottleneck Overcome**: Detailed engineering breakdown (e.g., race conditions, optimistic UI rollback, conflict resolution).
  - **Section 4: Technical Stack & Artifacts**: Key technologies, code snippets or architecture diagrams.
- **Dismissibility**: Accessible via `ESC`, overlay click, or close button; locks background scroll via body scroll locking.

### 4. Interactive Origin Story Section (`OriginTimeline.jsx` / Accordion)

A dedicated, collapsible section inserted between `ProjectShowcase` and `SkillsetSection` on `src/app/page.jsx`:
- **Accordion Wrapper**: Kept cleanly collapsed by default with a clear, engaging trigger: *"The Origin Story (2007–Present): From Flash OS Clones to Enterprise Systems"*. Visitors who want to know the backstory can expand it on demand without forcing passive visitors through secondary biographical details.
- **Visual Design**: Once expanded, reveals a vertical neon/amber glowing spine with retro UI accents that visually anchor your engineering trajectory.
- **Milestones**:
  1. **2007–2009: The Friendster Era**:
     - *Focus*: Middle school curiosity. Reverse-engineering CSS rules, learning DOM quirks, customizing profile layouts for friends.
     - *Artifact/Styling*: Terminal / CSS snippet accent.
  2. **2010–2012: The Flash OS Clone**:
     - *Focus*: Macromedia Flash & ActionScript. Building a fully functional Windows 7 desktop clone with draggable windows, custom MS Paint, taskbar, and calculator. Rejected by the animation teacher because "an operating system is not a cartoon".
     - *Artifact/Styling*: Retro window frame aesthetic.
  3. **2018–2020: Commercial Agency & Hybrid Systems**:
     - *Focus*: Get Indonesia, Duta Sarana Computer, first full-stack and mobile client rollouts.
  4. **2021–Present: Enterprise Systems & Distributed Architecture**:
     - *Focus*: Offline-first marine telemetry (SailPro), real-time fintech payment engines (BagiPulsa), enterprise ERPs (Tehkota), Flutter state architecture ().
- **Ergonomics**: Zero forced viewport bloat; expands cleanly on demand.

--------------------------------------------------------------------------------

## Alternatives Considered

### Alternative A: Replacing the Infinite Marquee with a Stationary Grid
* **Description**: Completely delete the horizontal infinite scrolling marquee in `ProjectShowcase.jsx` and replace it with a standard 2- or 3-column static responsive card grid.
* **Pros**: Eliminates the "moving target" click problem entirely; zero JavaScript overhead for drag scrubbing; avoids marquee layout complexity.
* **Cons**: Destroys the visual rhythm, dynamism, and "living diorama" character of the site. The user specifically invested time into building the ambient marquee aesthetic and expressed a strong preference to retain it.
* **Reason for Rejection**: Rejected. The interactive drag-to-scrub controller paired with a 3-second idle auto-resume resolves the click ergonomics issue while preserving the visual identity of the website.

### Alternative B: Corporate Status Badges ("Acquired by Kuncie", "Ceased Operations")
* **Description**: Replace dead domain links with explicit status tags detailing corporate acquisitions or business shutdowns.
* **Pros**: Explains why a domain is no longer accessible to curious visitors.
* **Cons**: Oversteps developer boundaries by speculating on or publicly airing private corporate/management developments; adds negative or bureaucratic visual clutter to a portfolio intended to highlight engineering capability.
* **Reason for Rejection**: Strongly rejected. A developer's portfolio is a showcase of code, architecture, and execution. Removing the domain link entirely and focusing on an engineering case study represents the technical work accurately without venturing into corporate politics.

### Alternative C: Fully Expanded Static Timeline on the Homepage
* **Description**: Insert the entire 2007–2026 vertical timeline expanded by default directly between the showcase and skillset sections.
* **Pros**: Immediately visible without interaction.
* **Cons**: Consumes excessive vertical viewport height with historical backstory that is secondary to hiring leads looking for immediate production capability proof.
* **Reason for Rejection / Refinement**: Replaced with an **Accordion / Expandable Drawer** pattern. The timeline header gives a compelling summary snippet, and interested tech leads can expand the full interactive retrospective with a single click.

--------------------------------------------------------------------------------

## Non-Functional Requirements

### 1. Performance & GPU Compositing
* Card elements will continue to leverage `backdrop-blur-xl` and existing frosted glass styling as designed.
* Drag-to-scroll execution will use `requestAnimationFrame` and CSS hardware-accelerated transforms (`translate3d`) to prevent layout thrashing and maintain 60fps interaction during pointer drags.

### 2. Accessibility & Keyboard Navigation
* All project cards in the marquee will be rendered as accessible buttons (`role="button"`, `tabIndex={0}`) with descriptive `aria-label` attributes for screen readers.
* Infinite marquee clones will be marked with `aria-hidden="true"` so screen readers do not encounter repetitive card announcements.
* Case study modals and the origin accordion will trap keyboard focus appropriately, support `ESC` dismissal, and maintain accessible `aria-expanded` attributes.

### 3. Responsive Adaptability
* The marquee adapts touch drag thresholds for mobile viewports.
* The accordion contents format gracefully on mobile without horizontal clipping.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

### Target Files to Create/Modify

#### 1. `src/utils/ProjectsData.js` (Modify)
* **Scope**: Data Schema & Catalog Ingestion
* **Proposed Changes**:
  - Remove dead `domain` strings from `versus` and `pixelninja`.
  - Add metadata, tech stacks, and slugs for new production systems:
    - `sailpro` (Clearscope): Offline PWA marine operations, real-time websockets, custom map engine (`nextjs`, `typescript`, `leaflet`, `websockets`, `tailwind`).
    - `bagipulsa` (Ramon): High-throughput fintech payment engine, real-time balance websockets (`flutter`, `nodejs`, `mysql`, `websockets`).

  - Add `slug` keys across all projects to bind directly to case study records.

#### 2. `public/images/` (Ingest Assets)
* **Scope**: Static Media Assets
* **Proposed Changes**:
  - Ingest screenshot/mockup assets from:
    - `D:\Documents\Projects\Clearscope\` for SailPro.
    - `D:\Documents\Projects\Ramon\` for BagiPulsa / Kirimpulsa.
    - `D:\Documents\Projects\jepri\flutter-mobile-internal\` for .


#### 3. `src/data/caseStudies.js` (Create)
* **Scope**: Technical Case Study Narratives
* **Proposed Changes**:
  - Export structured case study objects keyed by project `slug`.
  - Adhere to the standardized 4-part technical rubric:
    1. Core Problem & Physical Constraints
    2. System Architecture & Technical Decisions
    3. Hardest Engineering Bottleneck Overcome (Concurrency, Offline Sync, State Recovery)
    4. Production Impact & Tech Stack

#### 4. `src/components/tower/ProjectShowcase.jsx` (Modify)
* **Scope**: UI & Interaction Engine
* **Proposed Changes**:
  - Implement mouse drag & touch swipe event listeners (`onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerLeave`).
  - Calculate translation offsets on top of continuous scrolling via CSS transforms.
  - Add 3000ms idle timer to smoothly re-engage continuous marquee animation after interaction.
  - Clean up card markup: remove misleading `"internal" / "Production"` fallback badges; only render external links if a verified domain exists.
  - Add click-to-open handler binding each card to `CaseStudyModal`.

#### 5. `src/components/tower/CaseStudyModal.jsx` (Create)
* **Scope**: Radix Dialog Modal Component
* **Proposed Changes**:
  - Built using `@radix-ui/react-dialog`.
  - Renders project title, tech badges, problem statement, architecture breakdown, bottleneck post-mortem, and screenshots.
  - Keyboard accessible (`ESC` to close, focus trapped).

#### 6. `src/components/tower/OriginTimeline.jsx` (Create)
* **Scope**: Interactive Collapsible Accordion Component
* **Proposed Changes**:
  - Expandable accordion with glowing border header: *"Origin Story: 2007–Present"*.
  - When opened, renders the vertical chronological spine with 4 historical milestones:
    - 2007–2009 Friendster CSS hacks
    - 2010–2012 Macromedia Flash Windows 7 clone (with custom MS Paint)
    - 2018–2020 Commercial agency systems
    - 2021–Present Distributed systems, offline engines & fintech mobile
  - Clean collapsible animation using Tailwind transitions.

#### 7. `src/app/page.jsx` (Modify)
* **Scope**: Page Layout Orchestration
* **Proposed Changes**:
  - Import and mount `<OriginTimeline />` directly below `<ProjectShowcase />` and above `<SkillsetSection />`.

### Verification Plan

* **Lint & Build**:
  - Run `npm run build` to confirm zero Next.js static generation or SSR errors.
  - Confirm all image paths resolve cleanly without broken asset 404s.
* **Manual / Interactive Smoke Testing**:
  - Verify drag-to-scroll on marquee: drag left, drag right, release, and confirm marquee smoothly resumes after 3 seconds.
  - Click on project cards (`SailPro`, `Versus`, `BagiPulsa`) and verify the case study modal opens with rich technical details.
  - Confirm dead links (`versus.co.id`, `pixelninja.id`) no longer render as clickable anchor tags, and misleading "internal" badges are gone.
  - Toggle the Origin Story accordion: verify smooth expand/collapse and responsive layout on both desktop and mobile viewports.

--------------------------------------------------------------------------------

*Drafted with EGM*
