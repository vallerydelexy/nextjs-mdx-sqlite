# Camden Lock Tower & Persistent FluidGlass: Atmosphere & Transparent Asset Integration

* **Author:** Rizki Aprita
* **Date:** 2026-10-29
* **Status:** Ideation / Brainstorm Refinement

## Overview

A targeted aesthetic overhaul resolving the visual disconnection between the Camden Lock tower illustration and the persistent WebGL2 canvas.

This refinement replaces the raw social media screenshot with a pristine, transparent architectural illustration asset (isolated alpha channel, zero social UI chrome, no rectangular borders) generated via image generation models. In tandem, the WebGL2 Navier-Stokes shader is updated with a multi-stop atmospheric gradient function (`FS_SCENE`) that renders a magic-hour twilight sky (deep indigo at zenith, dusk violet, rose, and glowing apricot/peach at horizon) in night mode, and a crisp azure-to-cream atmosphere in day mode. The transparent tower sits directly inside this living canvas, with vector telephone wires and flying swallows providing subpixel foreground depth.

## Analysis

### 1. Visual Aesthetics & Atmosphere Harmony (Design & Comprehension)
* **Elimination of Social UI Chrome**: The existing asset contains Instagram/TikTok buttons (likes, comments, audio icons) and hard rectangular box boundaries. Removing these transforms the presentation from an uncurated moodboard screenshot into an intentional, bespoke piece of creative technology.
* **Procedural Magic-Hour Twilight**: The sky is transferred from a pre-baked static image into the WebGL2 shader itself (`FS_SCENE`), where it fluidly refracts through the glass. In Night Mode, the sky cascades from deep indigo (`#0A071B`) through dusk violet (`#2E154D`) and rose (`#7C2D6E`) down into glowing sunset peach (`#F97352`) at the horizon. In Day Mode, it transitions from crisp cerulean (`#4BA3E3`) through sky mist (`#BAE6FD`) to sunlit cream (`#FEF9C3`).
* **Borderless Spatial Integration**: With an alpha-channel cutout, the tower has no hard rectangular outline. The WebGL fluid glass waves and sunset glows shine directly through the tower's open balconies, wooden rafters, and water tank scaffolding.

### 2. Shader & Engine Mechanics (Codebase Details & Implementation)
* **Vertical Sky Gradient in `FS_SCENE`**: Replaces the radial circle wash in `fluidShaders.js` with a polynomial vertical gradient function parameterized by `u_theme` (0.0 = Day, 1.0 = Night). This adds zero GPU overhead as `FS_SCENE` already executes full-screen once per frame to an offscreen FBO.
* **Refraction Optical Consistency**: In `FS_REFRACT`, reflection colors (`skycDay` and `skycNight`) are aligned with the new multi-stop sky palette so that chromatic light refractions and surface specular highlights reflect the exact same sky tones.
* **Edge Halo Prevention**: Transparent cutout extraction from AI generation must avoid white or black fringing along fine antenna and rafter lines.

### 3. Layer Separation Strategy (Structural)
* **Backplane (WebGL2 Canvas, `z-index: -10`)**: Full-viewport procedural sky gradient and responsive Navier-Stokes chromatic fluid ripples.
* **Midground (`TowerParallax.jsx`, `z-index: 0`)**: Clean transparent Camden Lock tower (`camden_tower_clean.webp` or `.png`) moving at `0.65x` scroll speed with an organic left gradient mask.
* **Foreground (SVG Vector Layer, `z-index: 1`)**: Telephone cables, street brackets, hanging lanterns, and flying swallow silhouettes moving at `1.35x` scroll speed for subpixel depth.

## Goals vs. Non-Goals

### In-Scope Goals
* Generate a clean architectural Camden Lock tower illustration without text, watermarks, or social UI chrome, with an alpha-channel transparent background.
* Update `FS_SCENE` and `FS_REFRACT` in `fluidShaders.js` to render the multi-stop twilight sunset and daytime atmosphere.
* Retune `TowerParallax.jsx` to mount the transparent tower and clean vector foreground without competing box gradients.
* Maintain 60fps/120fps performance with 512x512 FBO solver grid and 2.5s idle advection throttling.

### Out-of-Scope Non-Goals
* Re-implementing 3D geometry meshes in Three.js (raster parallax + vector silhouettes remain the chosen lightweight stack).
* Modifying editorial content cards, MDX blog engines, or backend Prisma models.

## Key Decisions & Staging for Next Steps

1. **Asset Generation Pipeline**: Deploy `image-generator` to create the clean architectural tower on a neutral/transparent background, followed by clean alpha masking.
2. **Shader Gradient Mathematics**: Formulate the multi-stop polynomial color ramp in GLSL within `fluidShaders.js`.
3. **Execution Ready**: Staging for review and immediate application.
