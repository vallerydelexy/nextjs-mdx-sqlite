"use client";

import { useEffect, useRef } from "react";

const BUBBLE_COUNT = 26;

const VERTEX_SHADER = `
  attribute vec2 aPos;
  void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uLight;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform vec4 uBubbles[${BUBBLE_COUNT}];
  uniform float uBubblesPop[${BUBBLE_COUNT}];

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + 11.7;
      a *= 0.5;
    }
    return v;
  }

  vec3 scene(vec2 uv) {
    float aspect = uRes.x / uRes.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    float t = uTime;

    vec2 warp = vec2(
      fbm(p * 1.05 + vec2(0.0, t * 0.05)),
      fbm(p * 1.05 + vec2(3.7, -t * 0.04) + 8.1)
    );
    vec2 q = p + (warp - 0.5) * 0.3;

    vec3 col = vec3(0.008, 0.0075, 0.006);

    float amber = exp(-pow((q.x * 0.9 + q.y * 0.75 + 0.46) * 2.9, 2.0));
    amber *= 0.32 + 0.95 * fbm(q * 1.9 + vec2(t * 0.06, 0.0));
    col += uColorB * amber * 0.72;

    float sage = exp(-pow(length((q - vec2(-0.46, -0.36)) * vec2(1.0, 1.5)) * 2.1, 2.0));
    sage *= 0.35 + 0.85 * fbm(q * 1.4 - vec2(t * 0.05, 0.0) + 5.3);
    col += uColorA * sage * 0.36;

    float sageBand = exp(-pow((q.y + 0.34 - q.x * 0.22 + (warp.x - 0.5) * 0.5) * 3.4, 2.0));
    col += uColorA * sageBand * 0.10;

    float core = exp(-pow(length((q - vec2(-0.54, 0.3)) * vec2(1.1, 1.3)) * 2.2, 2.0));
    col += uColorC * core * 0.3;

    float vig = smoothstep(1.35, 0.32, length(p * vec2(0.9, 1.0)));
    col *= 0.22 + 0.78 * vig;

    return col;
  }

  vec3 spectrum(float ph) {
    vec3 c = mix(vec3(0.74, 0.72, 0.96), vec3(0.95, 0.78, 0.90), smoothstep(0.0, 0.5, ph));
    return mix(c, vec3(0.70, 0.84, 0.97), smoothstep(0.5, 1.0, ph));
  }

  vec3 sceneLight(vec2 uv) {
    float aspect = uRes.x / uRes.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
    float t = uTime * 0.05;

    vec2 w = vec2(
      fbm(p * 1.15 + vec2(0.0, t)),
      fbm(p * 1.15 + vec2(7.3, -t) + 4.1)
    );
    vec2 q = p + (w - 0.5) * 0.85;

    float h = fbm(q * 1.5 + vec2(t * 0.6, -t * 0.4));
    float h2 = fbm(q * 4.2 - vec2(t * 0.5, t * 0.3));

    vec3 irid = spectrum(fract(h * 1.6 + h2 * 0.75));
    vec3 col = mix(vec3(0.52, 0.53, 0.82), vec3(0.93, 0.92, 0.98), smoothstep(0.3, 0.78, h * 0.65 + h2 * 0.35));
    col = mix(col, irid, 0.55);

    float seam = pow(1.0 - abs(2.0 * h2 - 1.0), 6.0);
    col += mix(vec3(1.0, 0.94, 0.99), irid, 0.5) * seam * 0.22;

    float bloom = exp(-pow(length((q - vec2(-0.45, 0.4)) * vec2(1.0, 1.2)) * 1.5, 2.0));
    col += vec3(1.0, 0.9, 0.96) * bloom * 0.07;

    float cool = exp(-pow(length((q - vec2(0.5, -0.5)) * vec2(1.0, 1.3)) * 1.4, 2.0));
    col += vec3(0.68, 0.78, 1.0) * cool * 0.07;

    float vig = smoothstep(1.5, 0.4, length(p));
    col *= 0.92 + 0.12 * vig;

    return col;
  }

  vec3 bubbleLayer(vec2 uv, vec3 col) {
    float aspect = uRes.x / uRes.y;

    for (int i = 0; i < ${BUBBLE_COUNT}; i++) {
      vec4 b = uBubbles[i];
      float pop = uBubblesPop[i];
      vec2 d = (uv - b.xy) * vec2(aspect, 1.0);
      float len = length(d);

      if (pop < 1.0 && len < b.z * (1.25 + pop * 1.9)) {
        float seed = b.w;
        float ang = atan(d.y, d.x);
        float ampA = 0.06 + 0.09 * fract(seed * 0.371);
        float ampB = 0.02 + 0.05 * fract(seed * 0.733);
        float shape = 1.0
          + ampA * sin(ang * 3.0 + seed)
          + ampB * sin(ang * 5.0 - seed * 1.7);
        float r = b.z * shape;
        vec3 tint = 0.5 + 0.5 * cos(vec3(0.0, 2.094, 4.188) + ang + seed + uTime * 0.15);

        if (pop > 0.0) {
          float t = len / max(r * (1.0 + pop * 1.5), 0.0001);
          float ring = smoothstep(0.82, 0.96, t) * (1.0 - smoothstep(0.96, 1.03, t));
          float fade = 1.0 - pop;
          vec3 popCol = mix(vec3(0.98, 0.95, 0.90), tint, 0.55);
          col += popCol * ring * fade * 0.85;
          col += vec3(1.0, 0.97, 0.90) * exp(-pow(t * 3.0, 2.0)) * fade * 0.20;
        } else {
          float t = len / max(r, 0.0001);

          if (t < 1.05) {
            float aa = max(0.012, 1.5 / max(r * uRes.y, 1.0));
            float inside = 1.0 - smoothstep(1.0 - aa, 1.0, t);

            float rim = smoothstep(0.55, 0.94, t) * (1.0 - smoothstep(0.94, 1.0, t));
            float edge = pow(smoothstep(0.82, 0.99, t), 2.0);

            vec3 glass = col * (1.03 + 0.10 * (1.0 - t));
            glass += tint * rim * 0.14;
            glass += vec3(0.98, 0.96, 0.92) * edge * 0.30;

            vec2 hp = d - vec2(-0.42, 0.40) * r;
            float spec = exp(-pow(length(hp) / (0.13 * r), 2.0));
            glass += vec3(1.0, 0.98, 0.94) * spec * 0.55;

            vec2 hp2 = d - vec2(0.36, -0.32) * r;
            float spec2 = exp(-pow(length(hp2) / (0.18 * r), 2.0));
            glass += vec3(0.72, 0.78, 0.85) * spec2 * 0.06;

            col = mix(col, glass, inside * 0.92);
          }
        }
      }
    }

    return col;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    float aspect = uRes.x / uRes.y;
    vec2 auv = (uv - 0.5) * vec2(aspect, 1.0);

    vec3 col = uLight > 0.5 ? sceneLight(uv) : scene(uv);

    col = bubbleLayer(uv, col);

    // Pointer light: a broad bloom that refracts the surface it passes over.
    vec2 ld = (auv - uMouse) * vec2(1.0, 1.1);
    float ldist = length(ld);

    if (ldist < 1.2) {
      float falloff = exp(-pow(ldist / 0.46, 2.0));
      float core = exp(-pow(ldist / 0.15, 2.0));

      float swirl = fbm(auv * 3.1 + vec2(uTime * 0.09, -uTime * 0.07));
      float grain2 = fbm(auv * 6.4 + swirl * 1.8 - uTime * 0.05);
      float filament = pow(1.0 - abs(2.0 * grain2 - 1.0), 7.0);

      vec3 irid = mix(
        0.5 + 0.5 * cos(6.2831 * (swirl * 1.5 + ldist * 0.9 + vec3(0.0, 0.18, 0.36))),
        spectrum(fract(swirl * 1.4 + ldist * 0.8)),
        uLight
      );
      vec3 lightCol = mix(vec3(1.0, 0.94, 0.97), irid, 0.6);
      lightCol += vec3(1.0, 0.82, 0.94) * filament * 0.6;

      col = mix(col, col * vec3(1.03, 0.99, 1.05), falloff * uLight * 0.7);
      col += lightCol * falloff * mix(0.46, 0.16, uLight);
      col += irid * pow(core, 2.0) * 0.18;
      col += vec3(1.0, 0.97, 0.98) * pow(core, 1.4) * mix(0.34, 0.1, uLight);
    }

    float grain = hash(gl_FragCoord.xy * 0.7 + fract(uTime) * 137.0) - 0.5;
    col += grain * 0.05;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const COLORS = {
  a: [0.4706, 0.6196, 0.4431],
  b: [0.8784, 0.5804, 0.2588],
  c: [0.9098, 0.7882, 0.2863],
};

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(message || "Shader compilation failed");
  }
  return shader;
}

export default function HeroCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    let program;
    try {
      const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
      }
    } catch (error) {
      console.warn("Hero canvas disabled:", error);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const position = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      res: gl.getUniformLocation(program, "uRes"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      time: gl.getUniformLocation(program, "uTime"),
      light: gl.getUniformLocation(program, "uLight"),
      a: gl.getUniformLocation(program, "uColorA"),
      b: gl.getUniformLocation(program, "uColorB"),
      c: gl.getUniformLocation(program, "uColorC"),
      bubbles: gl.getUniformLocation(program, "uBubbles"),
      pop: gl.getUniformLocation(program, "uBubblesPop"),
    };

    gl.useProgram(program);

    gl.uniform3fv(uniforms.a, COLORS.a);
    gl.uniform3fv(uniforms.b, COLORS.b);
    gl.uniform3fv(uniforms.c, COLORS.c);


    const POP_SECONDS = 0.55;

    const bubbles = Array.from({ length: BUBBLE_COUNT }, () => ({
      x: 0,
      y: 0,
      r: 0,
      seed: 0,
      vx: 0,
      vy: 0,
      pop: 0,
      respawnAt: 0,
    }));

    const bubbleData = new Float32Array(BUBBLE_COUNT * 4);
    const bubblePop = new Float32Array(BUBBLE_COUNT);

    function resetBubble(bubble) {
      bubble.x = 0.06 + Math.random() * 0.88;
      bubble.y = 0.06 + Math.random() * 0.88;
      bubble.r = 0.008 + Math.pow(Math.random(), 2.6) * 0.075;
      bubble.seed = Math.random() * 48;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.01 + Math.random() * 0.04;
      bubble.vx = Math.cos(angle) * speed;
      bubble.vy = Math.sin(angle) * speed;
      bubble.pop = 0;
      bubble.respawnAt = 0;
    }

    bubbles.forEach(resetBubble);

    function uploadBubbles() {
      for (let i = 0; i < BUBBLE_COUNT; i += 1) {
        const bubble = bubbles[i];
        const base = i * 4;
        bubbleData[base] = bubble.x;
        bubbleData[base + 1] = bubble.y;
        bubbleData[base + 2] = bubble.r;
        bubbleData[base + 3] = bubble.seed;
        bubblePop[i] = bubble.pop;
      }
      gl.uniform4fv(uniforms.bubbles, bubbleData);
      gl.uniform1fv(uniforms.pop, bubblePop);
    }

    function stepBubbles(delta) {
      const dt = delta / 1000;
      const time = elapsed * 0.001;

      for (const bubble of bubbles) {
        if (bubble.pop > 0 && bubble.pop < 1) {
          bubble.pop = Math.min(1, bubble.pop + dt / POP_SECONDS);
          if (bubble.pop >= 1) {
            bubble.respawnAt = time + 1.5 + Math.random() * 2.5;
          }
          continue;
        }

        if (bubble.respawnAt) {
          if (time >= bubble.respawnAt) resetBubble(bubble);
          continue;
        }

        bubble.x += (bubble.vx * dt) / aspect;
        bubble.y += bubble.vy * dt;

        const radiusX = (bubble.r * 1.15) / aspect;
        const radiusY = bubble.r * 1.15;

        if (bubble.x < radiusX) {
          bubble.x = radiusX;
          bubble.vx = Math.abs(bubble.vx);
        } else if (bubble.x > 1 - radiusX) {
          bubble.x = 1 - radiusX;
          bubble.vx = -Math.abs(bubble.vx);
        }

        if (bubble.y < radiusY) {
          bubble.y = radiusY;
          bubble.vy = Math.abs(bubble.vy);
        } else if (bubble.y > 1 - radiusY) {
          bubble.y = 1 - radiusY;
          bubble.vy = -Math.abs(bubble.vy);
        }
      }
    }

    let aspect = 1;
    let elapsed = 0;
    let lastFrame = 0;
    let raf = 0;
    let running = true;
    let inView = true;
    let lastPointer = -Infinity;

    const mouse = [0, 0];
    const target = [0, 0];

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw() {
      gl.useProgram(program);
      gl.uniform2f(uniforms.res, canvas.width, canvas.height);
      gl.uniform2f(uniforms.mouse, mouse[0], mouse[1]);
      gl.uniform1f(uniforms.time, elapsed / 1000);
      uploadBubbles();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function resize() {
      const rect = parent.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const pixelWidth = Math.max(1, Math.round(nextWidth * dpr));
      const pixelHeight = Math.max(1, Math.round(nextHeight * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
        gl.viewport(0, 0, pixelWidth, pixelHeight);
      }

      aspect = nextWidth / Math.max(1, nextHeight);
      if (reducedMotion) draw();
    }

    function frame(now) {
      if (!running) {
        lastFrame = 0;
        return;
      }
      if (!lastFrame) lastFrame = now;
      const delta = Math.min(now - lastFrame, 50);
      lastFrame = now;
      elapsed += delta;
      stepBubbles(delta);

      if (now - lastPointer > 2400) {
        const t = elapsed * 0.001;
        const idleX = Math.min(0.32, aspect * 0.2);
        target[0] = idleX + Math.sin(t * 0.37) * Math.min(0.028, aspect * 0.03);
        target[1] = Math.cos(t * 0.29) * 0.022;
      }

      const ease = 1 - Math.exp(-delta * 0.0016);
      mouse[0] += (target[0] - mouse[0]) * ease;
      mouse[1] += (target[1] - mouse[1]) * ease;

      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (reducedMotion || raf) return;
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    }

    function onPointer(event) {
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        lastPointer = -Infinity;
        return;
      }

      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      const idleX = Math.min(0.32, aspect * 0.2);
      target[0] = idleX + (x - 0.5) * aspect * 0.032;
      target[1] = (y - 0.5) * 0.026;
      lastPointer = performance.now();
    }

    function onPointerDown(event) {
      if (event.button !== 0) return;
      if (event.target && event.target.closest && event.target.closest("a, button, [role='button']")) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);

      if (x < 0 || x > 1 || y < 0 || y > 1) return;

      let popped = false;

      for (const bubble of bubbles) {
        if (bubble.pop > 0 || bubble.respawnAt) continue;

        const dx = (x - bubble.x) * aspect;
        const dy = y - bubble.y;
        const hitRadius = bubble.r * 1.2;

        if (dx * dx + dy * dy <= hitRadius * hitRadius) {
          bubble.pop = reducedMotion ? 1 : 0.0001;
          popped = true;
        }
      }

      if (popped && !raf) draw();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && running) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    function syncTheme() {
      const light = document.documentElement.classList.contains("dark") ? 0 : 1;
      gl.uniform1f(uniforms.light, light);
      if (!raf) draw();
    }

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    syncTheme();

    resize();
    const idleX = Math.min(0.32, aspect * 0.2);
    target[0] = idleX;
    mouse[0] = idleX;
    target[1] = 0;
    mouse[1] = 0;
    draw();
    if (!reducedMotion && inView) start();

    return () => {
      running = false;
      stop();
      resizeObserver.disconnect();
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("pointerdown", onPointerDown);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 -z-10 h-full w-full bg-[#c8cbf2] dark:bg-[#0b0908] ${className}`}
    />
  );
}
