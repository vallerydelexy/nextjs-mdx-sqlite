"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const BG_VERTEX = `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const BG_FRAGMENT = `
  precision highp float;

  uniform vec2 uRes;
  uniform float uTime;
  uniform float uScroll;

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

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    float t = uTime;

    vec3 col = vec3(0.014, 0.015, 0.019);

    float glowA = exp(-pow(length(p - vec2(-0.55, -0.4)) * 2.1, 2.0));
    col += vec3(0.34, 0.02, 0.02) * glowA * 0.33;

    float glowB = exp(-pow(length(p - vec2(0.55, 0.42)) * 1.7, 2.0));
    col += vec3(0.05, 0.06, 0.075) * glowB * 0.8;

    vec2 cell = abs(fract(p * 6.0 + vec2(0.0, t * 0.015 + uScroll * 0.9)) - 0.5);
    float grid = 1.0 - smoothstep(0.485, 0.5, max(cell.x, cell.y));
    float falloff = 1.0 - smoothstep(0.1, 1.05, length(p));
    col += vec3(0.45, 0.47, 0.52) * grid * 0.038 * falloff;

    vec2 cell5 = abs(fract(p * 1.2 + vec2(0.0, t * 0.01)) - 0.5);
    float grid5 = 1.0 - smoothstep(0.47, 0.5, max(cell5.x, cell5.y));
    col += vec3(0.9, 0.06, 0.06) * grid5 * 0.03 * falloff;

    float scan = exp(-pow((uv.y - fract(t * 0.045 + uScroll * 0.25)) * 110.0, 2.0));
    col += vec3(0.9, 0.1, 0.1) * scan * 0.05;

    float grain = noise(gl_FragCoord.xy * 0.09 + vec2(t * 20.0, -t * 13.0));
    col += (grain - 0.5) * 0.028;

    float vignette = 1.0 - smoothstep(0.25, 1.35, length(p * vec2(0.82, 1.0)));
    col *= 0.38 + 0.62 * vignette;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const PARTICLE_VERTEX = `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.24 + aPhase) * 0.4;
    p.x += cos(uTime * 0.17 + aPhase * 1.31) * 0.28;
    p.z += sin(uTime * 0.11 + aPhase * 0.63) * 0.35;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (36.0 / max(1.0, -mv.z));

    vAlpha = 0.18 + 0.55 * (0.5 + 0.5 * sin(uTime * 0.9 + aPhase));
    vColor = aColor;
  }
`;

const PARTICLE_FRAGMENT = `
  precision mediump float;

  varying float vAlpha;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.05, 0.5, d);
    gl_FragColor = vec4(vColor, alpha * vAlpha);
  }
`;

function createParticles(count, spread, zRange, sizeRange, colors) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const colorData = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.72;
    positions[i * 3 + 2] = zRange[0] + Math.random() * (zRange[1] - zRange[0]);

    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
    phases[i] = Math.random() * Math.PI * 2;

    color.set(colors[Math.floor(Math.random() * colors.length)]);
    colorData[i * 3] = color.r;
    colorData[i * 3 + 1] = color.g;
    colorData[i * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colorData, 3));

  return geometry;
}

export default function CyberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch (error) {
      console.warn("Cyber canvas disabled:", error);
      return;
    }

    renderer.setClearColor(0x060608, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060608, 0.052);

    const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 60);
    camera.position.set(0, 0, 9);

    /* ── Procedural background layer ── */
    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bgUniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uScroll: { value: 0 },
    };
    const bgGeometry = new THREE.PlaneGeometry(2, 2);
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: BG_VERTEX,
      fragmentShader: BG_FRAGMENT,
      uniforms: bgUniforms,
      depthTest: false,
      depthWrite: false,
    });
    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgScene.add(bgMesh);

    /* ── Wireframe constructs ── */
    const group = new THREE.Group();
    scene.add(group);

    const grid = new THREE.GridHelper(34, 34, 0x26262c, 0x131316);
    grid.position.y = -3.6;
    grid.material.transparent = true;
    grid.material.opacity = 0.45;
    scene.add(grid);

    const geometryList = [
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.TorusKnotGeometry(0.82, 0.2, 96, 8),
      new THREE.OctahedronGeometry(1.15, 0),
      new THREE.BoxGeometry(1.3, 1.3, 1.3),
      new THREE.DodecahedronGeometry(1.05, 0),
      new THREE.TorusGeometry(1.1, 0.28, 10, 40),
      new THREE.TetrahedronGeometry(1.2, 0),
    ];

    const placements = [
      { x: -4.2, y: 1.5, z: -3.2, color: 0x9aa0aa, opacity: 0.28 },
      { x: 3.7, y: -1.5, z: -1.8, color: 0xff2d2d, opacity: 0.5 },
      { x: -2.6, y: -2.1, z: -4.6, color: 0x8a909a, opacity: 0.2 },
      { x: 4.2, y: 2.2, z: -4.2, color: 0xd4d4d8, opacity: 0.16 },
      { x: -3.7, y: -0.3, z: -5.2, color: 0xff2d2d, opacity: 0.32 },
      { x: 2.7, y: 2.8, z: -5.6, color: 0x9aa0aa, opacity: 0.22 },
      { x: 0.6, y: -3.1, z: -3.8, color: 0xa1a1aa, opacity: 0.24 },
    ];

    const objects = geometryList.map((geometry, index) => {
      const placement = placements[index];
      const material = new THREE.LineBasicMaterial({
        color: placement.color,
        transparent: true,
        opacity: placement.opacity,
      });
      const lines = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        material
      );
      lines.position.set(placement.x, placement.y, placement.z);
      lines.userData = {
        baseY: placement.y,
        spinX: 0.04 + Math.random() * 0.12,
        spinY: 0.06 + Math.random() * 0.16,
        phase: Math.random() * Math.PI * 2,
        amplitude: 0.08 + Math.random() * 0.14,
      };
      group.add(lines);
      geometry.dispose();
      return lines;
    });

    /* ── Custom particle field ── */
    const particleUniforms = {
      uTime: { value: 0 },
    };
    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const dustGeometry = createParticles(
      620,
      18,
      [-13, 4],
      [0.5, 1.6],
      [0xd4d4d8, 0xa1a1aa, 0x71717a]
    );
    const dust = new THREE.Points(dustGeometry, particleMaterial);
    scene.add(dust);

    const sparkGeometry = createParticles(
      90,
      14,
      [-10, 2],
      [1.6, 3.8],
      [0xff2d2d, 0xff5a5a, 0xd4d4d8]
    );
    const sparks = new THREE.Points(sparkGeometry, particleMaterial);
    scene.add(sparks);

    /* ── State ── */
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    let scroll = 0;
    let elapsed = 0;
    let lastFrame = 0;
    let raf = 0;
    let active = true;
    let inView = true;

    const drawingBuffer = new THREE.Vector2();

    function draw(time) {
      bgUniforms.uTime.value = time;
      bgUniforms.uScroll.value = scroll;
      particleUniforms.uTime.value = time;

      renderer.autoClear = false;
      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.clearDepth();
      renderer.render(scene, camera);
    }

    function updateStatic() {
      pointer.x = 0;
      pointer.y = 0;
      scroll = 0;
      draw(0);
    }

    function frame(now) {
      if (!active) {
        raf = 0;
        lastFrame = 0;
        return;
      }

      if (!lastFrame) lastFrame = now;
      const delta = Math.min(now - lastFrame, 50);
      lastFrame = now;
      elapsed += delta;
      const time = elapsed * 0.001;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      scroll += (targetScroll - scroll) * 0.08;

      pointer.x += (pointerTarget.x - pointer.x) * 0.045;
      pointer.y += (pointerTarget.y - pointer.y) * 0.045;

      group.rotation.y = scroll * 2.3 + pointer.x * 0.2;
      group.rotation.x = scroll * 0.6 - pointer.y * 0.14;
      group.position.y = Math.sin(time * 0.24) * 0.1;

      for (const object of objects) {
        const data = object.userData;
        object.rotation.x += data.spinX * (delta / 1000);
        object.rotation.y += data.spinY * (delta / 1000);
        object.position.y =
          data.baseY + Math.sin(time * 0.4 + data.phase) * data.amplitude;
      }

      camera.position.z = 9 - scroll * 1.6;
      camera.position.x = pointer.x * 0.45;
      camera.position.y = -pointer.y * 0.32 + Math.sin(time * 0.3) * 0.04;
      camera.lookAt(0, 0, 0);

      dust.rotation.y = time * 0.008;
      sparks.rotation.y = -time * 0.012;

      draw(time);
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

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.getDrawingBufferSize(drawingBuffer);
      bgUniforms.uRes.value.copy(drawingBuffer);

      if (reducedMotion) updateStatic();
    }

    function onPointerMove(event) {
      pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    function onVisibilityChange() {
      if (document.hidden) {
        stop();
      } else if (inView) {
        start();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        active = inView;
        if (inView && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    resize();
    updateStatic();
    if (!reducedMotion) start();

    return () => {
      active = false;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      bgGeometry.dispose();
      bgMaterial.dispose();
      dustGeometry.dispose();
      sparkGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />;
}
