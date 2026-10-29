"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { FLUID_CONFIG, THEME_PALETTES } from "./fluidConfig";
import {
  VS_BASE,
  VS_TEXEL,
  FS_CLEAR,
  FS_SPLAT,
  FS_ADVECT,
  FS_DIVERGENCE,
  FS_CURL,
  FS_VORTICITY,
  FS_PRESSURE,
  FS_GRADIENT,
  FS_NORMAL,
  FS_NORMALDELTA,
  FS_SCENE,
  FS_REFRACT,
} from "./fluidShaders";

export default function FluidGlassBackground() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const themeProgress = useRef({ val: 1.0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const isDark = resolvedTheme === "dark";
    gsap.to(themeProgress.current, {
      val: isDark ? 1.0 : 0.0,
      duration: 0.75,
      ease: "power2.out",
    });
  }, [resolvedTheme, mounted]);

  useEffect(() => {
    if (!mounted) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(s));
      }
      return s;
    }

    function link(vs, fs) {
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn(gl.getProgramInfoLog(p));
      }
      return p;
    }

    const vsBase = compile(gl.VERTEX_SHADER, VS_BASE);
    const vsTexel = compile(gl.VERTEX_SHADER, VS_TEXEL);

    const programs = {
      clear: link(vsBase, compile(gl.FRAGMENT_SHADER, FS_CLEAR)),
      splat: link(vsBase, compile(gl.FRAGMENT_SHADER, FS_SPLAT)),
      advect: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_ADVECT)),
      div: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_DIVERGENCE)),
      curl: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_CURL)),
      vort: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_VORTICITY)),
      press: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_PRESSURE)),
      grad: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_GRADIENT)),
      norm: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_NORMAL)),
      normd: link(vsTexel, compile(gl.FRAGMENT_SHADER, FS_NORMALDELTA)),
      scene: link(vsBase, compile(gl.FRAGMENT_SHADER, FS_SCENE)),
      refr: link(vsBase, compile(gl.FRAGMENT_SHADER, FS_REFRACT)),
    };

    const LOC = {};
    for (const [name, prog] of Object.entries(programs)) {
      LOC[name] = {};
      const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i += 1) {
        const info = gl.getActiveUniform(prog, i);
        if (!info) continue;
        LOC[name][info.name] = gl.getUniformLocation(prog, info.name);
      }
    }

    const U = (prog, name, fn, ...args) => {
      const loc = LOC[prog]?.[name];
      if (loc != null) fn.apply(gl, [loc, ...args]);
    };

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
    gl.bindVertexArray(null);

    let H_INT, H_TYPE;
    if (gl.getExtension("EXT_color_buffer_half_float")) {
      H_INT = gl.RGBA16F;
      H_TYPE = gl.HALF_FLOAT;
    } else if (gl.getExtension("EXT_color_buffer_float")) {
      H_INT = gl.RGBA32F;
      H_TYPE = gl.FLOAT;
    } else {
      H_INT = gl.RGBA8;
      H_TYPE = gl.UNSIGNED_BYTE;
    }
    const filterLinear = Boolean(
      gl.getExtension("OES_texture_half_float_linear") ||
      gl.getExtension("OES_texture_float_linear")
    );
    const FILT_F = filterLinear ? gl.LINEAR : gl.NEAREST;

    let allocated = [];
    function mkFbo(w, h, internal, type, filter) {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, gl.RGBA, type, null);
      gl.bindTexture(gl.TEXTURE_2D, null);

      const f = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        t,
        0
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      const target = { f, t, w, h };
      allocated.push({ f, t });
      return target;
    }

    function freeTargets() {
      for (const { f, t } of allocated) {
        gl.deleteFramebuffer(f);
        gl.deleteTexture(t);
      }
      allocated = [];
    }

    let SW = 2;
    let SH = 2;
    let VW = 2;
    let VH = 2;
    let DW = 2;
    let DH = 2;
    let prevMin = 0;
    let aspect = 1;
    let veloR, veloW, densR, densW, pressR, pressW, div, curl, normalRT, normDelta, scene;

    function buildTargets() {
      const minD = Math.min(SW, SH);
      if (Math.abs(minD - prevMin) < 4) return;
      prevMin = minD;
      freeTargets();

      VW = Math.max(160, Math.min(FLUID_CONFIG.maxSimResolution / 2, Math.round(minD / 2.2)));
      VH = VW;
      DW = Math.max(200, Math.min(FLUID_CONFIG.maxSimResolution, VW * 2));
      DH = DW;

      const pair = (w, h) => [
        mkFbo(w, h, H_INT, H_TYPE, FILT_F),
        mkFbo(w, h, H_INT, H_TYPE, FILT_F),
      ];
      [veloR, veloW] = pair(VW, VH);
      [densR, densW] = pair(DW, DH);
      [pressR, pressW] = pair(VW, VH);
      div = mkFbo(VW, VH, H_INT, H_TYPE, FILT_F);
      curl = mkFbo(VW, VH, H_INT, H_TYPE, FILT_F);
      normalRT = mkFbo(DW, DH, H_INT, H_TYPE, FILT_F);
      normDelta = mkFbo(DW, DH, H_INT, H_TYPE, FILT_F);
      scene = mkFbo(SW, SH, gl.RGBA8, gl.UNSIGNED_BYTE, gl.LINEAR);
      aspect = SW / SH;
    }

    const bind = (t, unit) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
    };
    const draw = () => {
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
    };
    const inFbo = (f) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, f.f);
      gl.viewport(0, 0, f.w, f.h);
    };
    const texel = (prog, w, h) =>
      U(prog, "u_texelSize", gl.uniform2f, 1 / w, 1 / h);

    let px = 0.5;
    let py = 0.5;
    let primed = false;
    let pending = null;
    let pendingClick = null;
    let ambientT = 0;
    let lastActivityTime = performance.now();

    function splat(x, y, prevX, prevY, power, radius) {
      gl.useProgram(programs.splat);
      U("splat", "u_aspect", gl.uniform1f, aspect);
      U("splat", "u_radius", gl.uniform1f, radius);
      U("splat", "u_point", gl.uniform2f, x, y);
      U("splat", "u_prevPoint", gl.uniform2f, prevX, prevY);

      const dx = Math.max(
        -FLUID_CONFIG.moveClamp,
        Math.min(FLUID_CONFIG.moveClamp, (x - prevX) * FLUID_CONFIG.movePower)
      );
      const dy = Math.max(
        -FLUID_CONFIG.moveClamp,
        Math.min(FLUID_CONFIG.moveClamp, (y - prevY) * FLUID_CONFIG.movePower)
      );

      U("splat", "u_color", gl.uniform3f, dx * power, dy * power, power * 1.5);
      bind(veloR.t, 0);
      U("splat", "u_base", gl.uniform1i, 0);
      inFbo(veloW);
      draw();
      [veloR, veloW] = [veloW, veloR];

      U("splat", "u_color", gl.uniform3f, dx, dy, 1.6);
      bind(densR.t, 0);
      U("splat", "u_base", gl.uniform1i, 0);
      inFbo(densW);
      draw();
      [densR, densW] = [densW, densR];
    }

    function step(ds) {
      if (pending) {
        splat(pending.x, pending.y, px, py, 1.0, FLUID_CONFIG.brushRadius);
        px = pending.x;
        py = pending.y;
        pending = null;
      }
      if (pendingClick) {
        splat(
          pendingClick.x,
          pendingClick.y,
          pendingClick.x + 0.002,
          pendingClick.y + 0.002,
          FLUID_CONFIG.splashPower,
          FLUID_CONFIG.splashRadius
        );
        pendingClick = null;
      }

      ambientT -= ds;
      if (ambientT <= 0) {
        ambientT = 2.0 + Math.random() * 2.5;
        const ax = 0.15 + Math.random() * 0.7;
        const ay = 0.15 + Math.random() * 0.7;
        splat(
          ax,
          ay,
          ax + 0.004 * (Math.random() - 0.5),
          ay + 0.004 * (Math.random() - 0.5),
          FLUID_CONFIG.ambient * 0.15,
          FLUID_CONFIG.brushRadius * 2.5
        );
      }

      gl.useProgram(programs.curl);
      texel("curl", VW, VH);
      bind(veloR.t, 0);
      U("curl", "u_velocity", gl.uniform1i, 0);
      inFbo(curl);
      draw();

      gl.useProgram(programs.vort);
      texel("vort", VW, VH);
      U("vort", "u_curlStrength", gl.uniform1f, FLUID_CONFIG.vort);
      U("vort", "u_ds", gl.uniform1f, ds);
      bind(veloR.t, 0);
      U("vort", "u_velocity", gl.uniform1i, 0);
      bind(curl.t, 1);
      U("vort", "u_curl", gl.uniform1i, 1);
      inFbo(veloW);
      draw();
      [veloR, veloW] = [veloW, veloR];

      gl.useProgram(programs.div);
      texel("div", VW, VH);
      bind(veloR.t, 0);
      U("div", "u_velocity", gl.uniform1i, 0);
      inFbo(div);
      draw();

      gl.useProgram(programs.clear);
      U("clear", "u_value", gl.uniform1f, FLUID_CONFIG.clearPressure);
      bind(pressR.t, 0);
      U("clear", "u_tex", gl.uniform1i, 0);
      inFbo(pressW);
      draw();
      [pressR, pressW] = [pressW, pressR];

      gl.useProgram(programs.press);
      texel("press", VW, VH);
      for (let i = 0; i < FLUID_CONFIG.pressureIters; i += 1) {
        bind(pressR.t, 0);
        U("press", "u_pressure", gl.uniform1i, 0);
        bind(div.t, 1);
        U("press", "u_divergence", gl.uniform1i, 1);
        inFbo(pressW);
        draw();
        [pressR, pressW] = [pressW, pressR];
      }

      gl.useProgram(programs.grad);
      texel("grad", VW, VH);
      bind(pressR.t, 0);
      U("grad", "u_pressure", gl.uniform1i, 0);
      bind(veloR.t, 1);
      U("grad", "u_velocity", gl.uniform1i, 1);
      inFbo(veloW);
      draw();
      [veloR, veloW] = [veloW, veloR];

      gl.useProgram(programs.advect);
      texel("advect", VW, VH);
      U("advect", "u_ds", gl.uniform1f, ds);
      U("advect", "u_dissipation", gl.uniform1f, FLUID_CONFIG.veloDiss);
      bind(veloR.t, 0);
      U("advect", "u_velocity", gl.uniform1i, 0);
      bind(veloR.t, 1);
      U("advect", "u_source", gl.uniform1i, 1);
      inFbo(veloW);
      draw();
      [veloR, veloW] = [veloW, veloR];

      texel("advect", DW, DH);
      U("advect", "u_dissipation", gl.uniform1f, FLUID_CONFIG.densityDiss);
      bind(veloR.t, 0);
      U("advect", "u_velocity", gl.uniform1i, 0);
      bind(densR.t, 1);
      U("advect", "u_source", gl.uniform1i, 1);
      inFbo(densW);
      draw();
      [densR, densW] = [densW, densR];

      gl.useProgram(programs.norm);
      texel("norm", DW, DH);
      U("norm", "u_eps", gl.uniform1f, FLUID_CONFIG.normalEpsilon);
      bind(densR.t, 0);
      U("norm", "u_density", gl.uniform1i, 0);
      inFbo(normalRT);
      draw();

      gl.useProgram(programs.normd);
      texel("normd", DW, DH);
      bind(normalRT.t, 0);
      U("normd", "u_normal", gl.uniform1i, 0);
      inFbo(normDelta);
      draw();
    }

    function drawScene(time) {
      gl.useProgram(programs.scene);
      U("scene", "u_time", gl.uniform1f, time);
      U("scene", "u_res", gl.uniform2f, SW, SH);
      U("scene", "u_theme", gl.uniform1f, themeProgress.current.val);
      inFbo(scene);
      draw();
    }

    function composite(time) {
      gl.useProgram(programs.refr);
      U("refr", "u_time", gl.uniform1f, time);
      U("refr", "u_res", gl.uniform2f, SW, SH);
      U("refr", "u_theme", gl.uniform1f, themeProgress.current.val);
      const tanY = Math.tan((60 * Math.PI) / 180 / 2);
      const tanX = tanY * aspect;
      U("refr", "u_tanX", gl.uniform1f, tanX);
      U("refr", "u_tanY", gl.uniform1f, tanY);
      U("refr", "u_camDist", gl.uniform1f, FLUID_CONFIG.camDist);

      const isNight = themeProgress.current.val;
      const curEtaR = (1 - isNight) * THEME_PALETTES.day.etaR + isNight * THEME_PALETTES.night.etaR;
      const curEtaB = (1 - isNight) * THEME_PALETTES.day.etaB + isNight * THEME_PALETTES.night.etaB;

      U("refr", "u_etaR", gl.uniform1f, curEtaR);
      U("refr", "u_etaB", gl.uniform1f, curEtaB);
      U("refr", "u_dispFactor", gl.uniform1f, FLUID_CONFIG.dispFactor);
      U("refr", "u_normalStrength", gl.uniform1f, FLUID_CONFIG.normalStrength);
      U("refr", "u_pool", gl.uniform1f, FLUID_CONFIG.pool);
      bind(scene.t, 0);
      U("refr", "u_scene", gl.uniform1i, 0);
      bind(normalRT.t, 1);
      U("refr", "u_normal", gl.uniform1i, 1);
      bind(normDelta.t, 2);
      U("refr", "u_normDelta", gl.uniform1i, 2);
      bind(densR.t, 3);
      U("refr", "u_density", gl.uniform1i, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, SW, SH);
      draw();
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      SW = Math.max(2, Math.round(window.innerWidth * dpr));
      SH = Math.max(2, Math.round(window.innerHeight * dpr));
      canvas.width = SW;
      canvas.height = SH;
      aspect = SW / SH;
      buildTargets();
      if (reducedMotion) {
        drawScene(0);
        composite(0);
      }
    }

    window.addEventListener("resize", resize);
    resize();

    [[0.28, 0.35], [0.62, 0.68], [0.72, 0.42], [0.4, 0.72]].forEach(
      ([x, y], i) => {
        splat(
          x,
          y,
          x + 0.01 * Math.cos(i),
          y + 0.01 * Math.sin(i * 2),
          3.5,
          FLUID_CONFIG.splashRadius * 1.4
        );
      }
    );

    if (reducedMotion) {
      drawScene(0);
      composite(0);
      return () => {
        window.removeEventListener("resize", resize);
        freeTargets();
      };
    }

    let raf = 0;
    let last = performance.now();

    drawScene(performance.now() / 1000);
    composite(performance.now() / 1000);

    function render(now) {
      raf = 0;
      const ds = Math.min((now - last) / 1000, 0.05);
      last = now;

      // const isIdle = now - lastActivityTime > FLUID_CONFIG.idleTimeoutMs;
      const isIdle = false;


      drawScene(now / 1000);
      if (!isIdle || ambientT <= 0) {
        step(ds);
      }
      composite(now / 1000);
      raf = requestAnimationFrame(render);
    }

    function start() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(render);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function markActive() {
      lastActivityTime = performance.now();
      if (!raf) start();
    }

    function point(event) {
      const x = event.clientX / Math.max(1, window.innerWidth);
      const y = 1 - event.clientY / Math.max(1, window.innerHeight);
      if (x < 0 || x > 1 || y < 0 || y > 1) return null;
      return { x, y };
    }

    function onPointerMove(event) {
      markActive();
      const p = point(event);
      if (!p) return;
      if (!primed) {
        primed = true;
        px = p.x;
        py = p.y;
        return;
      }
      pending = p;
    }

    function onPointerDown(event) {
      markActive();
      const target = event.target;
      if (
        target &&
        target.closest &&
        target.closest("a, button, [role='button']")
      ) {
        return;
      }
      const p = point(event);
      if (!p) return;
      if (!primed) {
        primed = true;
        px = p.x;
        py = p.y;
      }
      pending = p;
      pendingClick = p;
    }

    function onScroll() {
      markActive();
      if (Math.random() < 0.25) {
        splat(
          0.3 + Math.random() * 0.4,
          0.3 + Math.random() * 0.4,
          0.5,
          0.5,
          0.8,
          FLUID_CONFIG.brushRadius * 2
        );
      }
    }

    function onVisibility() {
      if (document.hidden) stop();
      else {
        markActive();
        start();
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (e) => {
      e.preventDefault();
      stop();
    };
    const onContextRestored = () => {
      buildTargets();
      start();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      freeTargets();
      Object.values(programs).forEach((p) => gl.deleteProgram(p));
      gl.deleteBuffer(buffer);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full transition-colors duration-700 bg-stone-100 dark:bg-[#121018]"
    />
  );
}

