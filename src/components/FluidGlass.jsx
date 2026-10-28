"use client";

import { useEffect, useRef } from "react";

/* Port of the liquid-glass POC: WebGL2 Navier-Stokes fluid (splat -> curl ->
 * vorticity -> divergence/pressure -> gradient -> advection -> normals) with
 * screen-space chromatic refraction on top. Scene retinted to #060608 + red. */

const CFG = {
  brushRadius: 0.003,
  movePower: 6000,
  moveClamp: 14,
  splashRadius: 0.012,
  splashPower: 26,
  densityDiss: 0.988,
  veloDiss: 0.995,
  vort: 10,
  pressureIters: 2,
  clearPressure: 0.99,
  normalEpsilon: 0.16,
  etaR: 1 / 1.3,
  etaB: 1 / 1.7,
  camDist: 3.0,
  dispFactor: 0.85,
  normalStrength: 1.5,
  pool: 0.44,
  ambient: 0.35, // idle drips so the glass is alive without a mouse
};

const VS_BASE = `#version 300 es
in vec2 a_position;
out highp vec2 vUv;
void main(){ vUv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0., 1.); }`;

const VS_TEXEL = `#version 300 es
in vec2 a_position;
uniform vec2 u_texelSize;
out highp vec2 vUv, vL, vR, vT, vB;
void main(){
  vUv = a_position * 0.5 + 0.5;
  vL = vUv - vec2(u_texelSize.x, 0.);  vR = vUv + vec2(u_texelSize.x, 0.);
  vT = vUv + vec2(0., u_texelSize.y);  vB = vUv - vec2(0., u_texelSize.y);
  gl_Position = vec4(a_position, 0., 1.);
}`;

const FS_CLEAR = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_tex; uniform float u_value;
void main(){ fragColor.rgb = u_value * texture(u_tex, vUv).rgb; fragColor.a = 1.; }`;

const FS_SPLAT = `#version 300 es
precision highp float; precision highp sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_base; uniform float u_aspect;
uniform vec3 u_color; uniform vec2 u_point; uniform vec2 u_prevPoint; uniform float u_radius;
void main(){
  vec3 base = texture(u_base, vUv).xyz;
  vec2 p = u_point, pp = u_prevPoint, uv = vUv;
  p.x *= u_aspect; pp.x *= u_aspect; uv.x *= u_aspect;
  vec2 dP = p - pp;
  float ldP = length(dP);
  if (ldP < 1e-4){ fragColor = vec4(base, 1.); return; }
  vec2 ndP = dP / ldP;
  float d = clamp(dot(ndP, uv - pp), 0., ldP);
  vec2 q = uv - (pp + ndP * d);
  vec3 splat = exp(-dot(q, q) / u_radius) * u_color;
  fragColor = vec4(base + splat, 1.);
}`;

const FS_ADVECT = `#version 300 es
precision highp float; precision highp sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_velocity; uniform sampler2D u_source;
uniform vec2 u_texelSize; uniform float u_ds; uniform float u_dissipation;
void main(){
  vec2 coord = vUv - u_ds * texture(u_velocity, vUv).xy * u_texelSize;
  fragColor.rgb = u_dissipation * texture(u_source, coord).rgb;
  fragColor.a = 1.;
}`;

const FS_DIVERGENCE = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vL, vR, vT, vB; out vec4 fragColor;
uniform sampler2D u_velocity;
void main(){
  float L = texture(u_velocity, vL).x;
  float R = texture(u_velocity, vR).x;
  float T = texture(u_velocity, vT).y;
  float B = texture(u_velocity, vB).y;
  vec2 C = texture(u_velocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0., 0., 1.);
}`;

const FS_CURL = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vL, vR, vT, vB; out vec4 fragColor;
uniform sampler2D u_velocity;
void main(){
  float L = texture(u_velocity, vL).y;
  float R = texture(u_velocity, vR).y;
  float T = texture(u_velocity, vT).x;
  float B = texture(u_velocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0., 0., 1.);
}`;

const FS_VORTICITY = `#version 300 es
precision highp float; precision highp sampler2D;
in highp vec2 vUv, vL, vR, vT, vB; out vec4 fragColor;
uniform sampler2D u_velocity; uniform sampler2D u_curl;
uniform float u_curlStrength; uniform float u_ds;
void main(){
  float L = texture(u_curl, vL).x; float R = texture(u_curl, vR).x;
  float T = texture(u_curl, vT).x; float B = texture(u_curl, vB).x;
  float C = texture(u_curl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= u_curlStrength * C;
  force.y *= -1.0;
  vec2 vel = texture(u_velocity, vUv).xy;
  fragColor = vec4(vel + force * u_ds, 0., 1.);
}`;

const FS_PRESSURE = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vL, vR, vT, vB; out vec4 fragColor;
uniform sampler2D u_pressure; uniform sampler2D u_divergence;
void main(){
  float L = texture(u_pressure, vL).x; float R = texture(u_pressure, vR).x;
  float T = texture(u_pressure, vT).x; float B = texture(u_pressure, vB).x;
  float C = texture(u_pressure, vUv).x;
  float divergence = texture(u_divergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0., 0., 1.);
}`;

const FS_GRADIENT = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vL, vR, vT, vB; out vec4 fragColor;
uniform sampler2D u_pressure; uniform sampler2D u_velocity;
void main(){
  float L = texture(u_pressure, vL).x; float R = texture(u_pressure, vR).x;
  float T = texture(u_pressure, vT).x; float B = texture(u_pressure, vB).x;
  vec2 velocity = texture(u_velocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  fragColor = vec4(velocity, 0., 1.);
}`;

const FS_NORMAL = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vR, vB; out vec4 fragColor;
uniform sampler2D u_density; uniform float u_eps;
void main(){
  float C = length(texture(u_density, vUv).xy);
  float R = length(texture(u_density, vR).xy);
  float B = length(texture(u_density, vB).xy);
  vec2 dN = vec2(R - C, B - C);
  vec3 N = vec3(0., 1., 0.);
  vec2 eps = vec2(u_eps, 0.);
  N = normalize(N + cross(dN.x * N + eps.xyy, dN.y * N + eps.yyx));
  fragColor = vec4(N, 1.);
}`;

const FS_NORMALDELTA = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vR, vB; out vec4 fragColor;
uniform sampler2D u_normal;
void main(){
  vec3 C = texture(u_normal, vUv).xyz;
  vec3 R = texture(u_normal, vR).xyz;
  vec3 B = texture(u_normal, vB).xyz;
  fragColor = vec4(abs(R - C) + abs(B - C), 1.);
}`;

/* Scene behind the glass. Retinted from the POC's pastel purple to the site
 * palette: #060608 base, red cast, near-white glass bodies so the chromatic
 * split stays visible. */
const FS_SCENE = `#version 300 es
precision highp float;
in highp vec2 vUv; out vec4 fragColor;
uniform float u_time; uniform vec2 u_res;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  vec2 uv = vUv;
  vec3 col = vec3(0.024, 0.024, 0.032);
  col += vec3(0.22, 0.012, 0.012) * pow(1. - length(uv - vec2(0.5, 0.42)), 2.4) * 0.25;

  for (int i = 0; i < 5; i++) {
    float f = float(i) * 1.379;
    vec2 c = vec2(0.18 + 0.64 * hash(vec2(float(i), 1.3)),
                  (0.22 + 0.6 * hash(vec2(float(i), 7.7))) * 0.9 + 0.07);
    c.x += 0.10 * sin(u_time * (0.15 + 0.1 * f) + f * 5.0) - 0.05;
    c.y += 0.07 * cos(u_time * (0.11 + 0.07 * f) + f * 3.0);
    float r = 0.10 + 0.07 * hash(vec2(f, 9.1));
    float k = hash(vec2(f, 4.3));
    // cool glass bodies with a red cast: keeping blue in the mix is what makes
    // the 1/1.3 vs 1/1.7 split visible
    vec3 tint = mix(vec3(0.55, 0.63, 0.85), vec3(1.0, 0.32, 0.34), smoothstep(0.4, 0.9, k) * 0.4);
    float d = length(uv - c) / r;
    col += tint * (0.30 * exp(-d * d * 4.0));
    col += vec3(0.82, 0.84, 0.90) * exp(-d * d * 40.0) * 0.12;
  }

  float g = 0.04 + 0.015 * sin(uv.y * 30.0 + u_time * 0.4);
  col += g * vec3(1.0, 0.42, 0.34) * 0.45 * (0.5 + 0.5 * sin(uv.x * 9.0 + u_time * 0.5));

  float beam = exp(-pow((uv.x * 1.6 - uv.y + 0.3 + 0.08 * sin(u_time * 0.3)) * 7.0, 2.0));
  col += vec3(0.70, 0.74, 0.86) * beam * 0.12;

  col += vec3(1.0, 0.28, 0.30) * exp(-pow((uv.y - 0.30) * 160.0, 2.0)) * 0.10;
  col += vec3(0.55, 0.62, 1.0) * exp(-pow((uv.y - 0.66) * 140.0, 2.0)) * 0.08;

  col = pow(col, vec3(0.9));
  fragColor = vec4(col, 1.);
}`;

const FS_REFRACT = `#version 300 es
precision highp float; precision highp sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_scene; uniform sampler2D u_normal; uniform sampler2D u_normDelta;
uniform sampler2D u_density;
uniform vec2 u_res; uniform float u_time;
uniform float u_tanX, u_tanY; uniform float u_camDist;
uniform float u_etaR, u_etaB; uniform float u_dispFactor;
uniform float u_normalStrength; uniform float u_pool;
vec2 toUv(vec3 h, vec3 cam){
  vec3 hc = h - cam; float z = max(-hc.z, 1e-4);
  return vec2(0.5 + 0.5 * hc.x / z / u_tanX, 0.5 + 0.5 * hc.y / z / u_tanY);
}
void main(){
  vec2 fragUv = gl_FragCoord.xy / u_res;
  vec2 ndc = fragUv * 2.0 - 1.0;
  vec3 cam = vec3(0., 0., u_camDist);
  vec3 dir = normalize(vec3(ndc.x * u_tanX, ndc.y * u_tanY, -1.0));
  vec3 vPos = cam + u_camDist * dir;
  vec3 view = dir;

  vec3 n = texture(u_normal, fragUv).xyz;
  vec3 nrm = normalize(vec3(n.x * u_normalStrength, n.z * u_normalStrength, max(n.y, 0.15)));

  float disp = clamp(length(texture(u_density, fragUv).xy) * 0.12, 0., 1.2);
  float dd = disp * disp * u_dispFactor;

  vec3 dR = refract(view, nrm, u_etaR);
  vec3 dB = refract(view, nrm, u_etaB);
  vec3 hitR = vPos + dR * dd;
  vec3 hitB = vPos + dB * dd;
  vec2 uvR = toUv(hitR, cam);
  vec2 uvB = toUv(hitB, cam);

  vec3 cR = texture(u_scene, uvR).rgb;
  vec3 cG = texture(u_scene, mix(uvR, uvB, 0.5)).rgb;
  vec3 cB = texture(u_scene, uvB).rgb;
  vec3 liquid = vec3(cR.r, cG.g, cB.b);

  vec3 plain = texture(u_scene, fragUv).rgb;

  float dCenter = length(fragUv - vec2(0.5, 0.5));
  float mask = 1.0 - smoothstep(u_pool, u_pool + 0.10, dCenter);
  mask *= mask;

  vec3 refl = reflect(view, nrm);
  float f = pow(1.0 - clamp(dot(nrm, -view), 0., 1.), 5.0);
  vec3 skyc = mix(vec3(0.30, 0.32, 0.42), vec3(0.95, 0.35, 0.32), pow(max(refl.y * 0.5 + 0.5, 0.), 3.0));
  vec3 reflCol = skyc * (0.04 + 0.5 * f * disp);

  vec3 edg = texture(u_normDelta, fragUv).xyz;
  vec3 rim = vec3(1.0, 0.45, 0.45) * clamp(dot(edg, vec3(0.333)) * 8.0, 0., 1.) * 0.25;

  vec3 L = normalize(vec3(-0.5, 0.6, 0.7));
  vec3 H = normalize(L - view);
  float spec = pow(max(dot(nrm, H), 0.), 140.0) * mask * (0.5 + disp * 1.5);

  vec3 col = mix(plain, liquid, mask);
  col += reflCol * mask;
  col += rim;
  col += vec3(1., 0.98, 0.93) * spec;
  fragColor = vec4(col, 1.);
}`;

export default function FluidGlass({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return undefined; // canvas CSS bg is the fallback

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ---------------------------- helpers ---------------------------- */
    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    function link(vs, fs) {
      const vsObj = compile(gl.VERTEX_SHADER, vs);
      const fsObj = compile(gl.FRAGMENT_SHADER, fs);
      if (!vsObj || !fsObj) return null;
      const p = gl.createProgram();
      gl.attachShader(p, vsObj);
      gl.attachShader(p, fsObj);
      gl.bindAttribLocation(p, 0, "a_position");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    }

    const programs = {
      clear: link(VS_TEXEL, FS_CLEAR),
      splat: link(VS_BASE, FS_SPLAT),
      advect: link(VS_TEXEL, FS_ADVECT),
      div: link(VS_TEXEL, FS_DIVERGENCE),
      curl: link(VS_TEXEL, FS_CURL),
      vort: link(VS_TEXEL, FS_VORTICITY),
      press: link(VS_TEXEL, FS_PRESSURE),
      grad: link(VS_TEXEL, FS_GRADIENT),
      norm: link(VS_TEXEL, FS_NORMAL),
      normd: link(VS_TEXEL, FS_NORMALDELTA),
      scene: link(VS_BASE, FS_SCENE),
      refr: link(VS_BASE, FS_REFRACT),
    };
    if (Object.values(programs).some((p) => !p)) return undefined;

    const LOC = {};
    for (const [name, p] of Object.entries(programs)) {
      LOC[name] = {};
      const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i += 1) {
        const info = gl.getActiveUniform(p, i);
        if (info) LOC[name][info.name] = gl.getUniformLocation(p, info.name);
      }
    }

    const U = (prog, name, fn, ...args) => {
      const loc = LOC[prog][name];
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

    // half-float targets when available, 8-bit as a last resort
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
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internal,
        w,
        h,
        0,
        gl.RGBA,
        type,
        null
      );
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

      VW = Math.max(160, Math.min(380, Math.round(minD / 2.2)));
      VH = VW;
      DW = VW * 2;
      DH = VH * 2;

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

    /* ------------------------- draw plumbing ------------------------- */
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
    const texel = (prog, w, h) => U(prog, "u_texelSize", gl.uniform2f, 1 / w, 1 / h);

    /* --------------------------- simulation -------------------------- */
    let px = 0.5;
    let py = 0.5;
    let primed = false;
    let pending = null;
    let pendingClick = null;
    let ambientT = 0;

    function splat(x, y, prevX, prevY, power, radius) {
      gl.useProgram(programs.splat);
      U("splat", "u_aspect", gl.uniform1f, aspect);
      U("splat", "u_radius", gl.uniform1f, radius);
      U("splat", "u_point", gl.uniform2f, x, y);
      U("splat", "u_prevPoint", gl.uniform2f, prevX, prevY);

      const dx = Math.max(
        -CFG.moveClamp,
        Math.min(CFG.moveClamp, (x - prevX) * CFG.movePower)
      );
      const dy = Math.max(
        -CFG.moveClamp,
        Math.min(CFG.moveClamp, (y - prevY) * CFG.movePower)
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
        splat(pending.x, pending.y, px, py, 1.0, CFG.brushRadius);
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
          CFG.splashPower,
          CFG.splashRadius
        );
        pendingClick = null;
      }

      ambientT -= ds;
      if (ambientT <= 0) {
        ambientT = 1.4 + Math.random() * 2.0;
        const ax = 0.15 + Math.random() * 0.7;
        const ay = 0.15 + Math.random() * 0.7;
        splat(
          ax,
          ay,
          ax + 0.004 * (Math.random() - 0.5),
          ay + 0.004 * (Math.random() - 0.5),
          CFG.ambient * 0.15,
          CFG.brushRadius * 2.5
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
      U("vort", "u_curlStrength", gl.uniform1f, CFG.vort);
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
      U("clear", "u_value", gl.uniform1f, CFG.clearPressure);
      bind(pressR.t, 0);
      U("clear", "u_tex", gl.uniform1i, 0);
      inFbo(pressW);
      draw();
      [pressR, pressW] = [pressW, pressR];

      gl.useProgram(programs.press);
      texel("press", VW, VH);
      for (let i = 0; i < CFG.pressureIters; i += 1) {
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
      U("advect", "u_dissipation", gl.uniform1f, CFG.veloDiss);
      bind(veloR.t, 0);
      U("advect", "u_velocity", gl.uniform1i, 0);
      bind(veloR.t, 1);
      U("advect", "u_source", gl.uniform1i, 1);
      inFbo(veloW);
      draw();
      [veloR, veloW] = [veloW, veloR];

      texel("advect", DW, DH);
      U("advect", "u_dissipation", gl.uniform1f, CFG.densityDiss);
      bind(veloR.t, 0);
      U("advect", "u_velocity", gl.uniform1i, 0);
      bind(densR.t, 1);
      U("advect", "u_source", gl.uniform1i, 1);
      inFbo(densW);
      draw();
      [densR, densW] = [densW, densR];

      gl.useProgram(programs.norm);
      texel("norm", DW, DH);
      U("norm", "u_eps", gl.uniform1f, CFG.normalEpsilon);
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

    /* ---------------------------- frames ----------------------------- */
    function drawScene(time) {
      gl.useProgram(programs.scene);
      U("scene", "u_time", gl.uniform1f, time);
      U("scene", "u_res", gl.uniform2f, SW, SH);
      inFbo(scene);
      draw();
    }

    function composite(time) {
      gl.useProgram(programs.refr);
      U("refr", "u_time", gl.uniform1f, time);
      U("refr", "u_res", gl.uniform2f, SW, SH);
      const tanY = Math.tan((60 * Math.PI) / 180 / 2);
      const tanX = tanY * aspect;
      U("refr", "u_tanX", gl.uniform1f, tanX);
      U("refr", "u_tanY", gl.uniform1f, tanY);
      U("refr", "u_camDist", gl.uniform1f, CFG.camDist);
      U("refr", "u_etaR", gl.uniform1f, CFG.etaR);
      U("refr", "u_etaB", gl.uniform1f, CFG.etaB);
      U("refr", "u_dispFactor", gl.uniform1f, CFG.dispFactor);
      U("refr", "u_normalStrength", gl.uniform1f, CFG.normalStrength);
      U("refr", "u_pool", gl.uniform1f, CFG.pool);
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
      SW = Math.max(2, Math.round(canvas.clientWidth * dpr));
      SH = Math.max(2, Math.round(canvas.clientHeight * dpr));
      canvas.width = SW;
      canvas.height = SH;
      aspect = SW / SH;
      buildTargets();
      if (reducedMotion) {
        drawScene(0);
        composite(0);
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();

    // seed a few swirls so the glass is alive before the first pointer move
    [[0.28, 0.35], [0.62, 0.68], [0.72, 0.42], [0.4, 0.72]].forEach(
      ([x, y], i) => {
        splat(
          x,
          y,
          x + 0.01 * Math.cos(i),
          y + 0.01 * Math.sin(i * 2),
          3.5,
          CFG.splashRadius * 1.4
        );
      }
    );

    if (reducedMotion) {
      drawScene(0);
      composite(0);
      return () => {
        resizeObserver.disconnect();
        freeTargets();
      };
    }

    let raf = 0;
    let last = performance.now();
    let inView = true;

    // paint the glass before the first rAF so there is no black flash on load
    drawScene(performance.now() / 1000);
    composite(performance.now() / 1000);

    function render(now) {
      raf = 0;
      const ds = Math.min((now - last) / 1000, 0.05);
      last = now;
      drawScene(now / 1000);
      step(ds);
      composite(now / 1000);
      raf = requestAnimationFrame(render);
    }

    function start() {
      if (raf || !inView) return;
      last = performance.now();
      raf = requestAnimationFrame(render);
    }

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    /* --------------------------- interaction ------------------------- */
    function point(event) {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width);
      const y = 1 - (event.clientY - rect.top) / Math.max(1, rect.height);
      if (x < 0 || x > 1 || y < 0 || y > 1) return null;
      return { x, y };
    }

    function onPointerMove(event) {
      const p = point(event);
      if (!p) return;
      // the very first move only anchors the splat origin, otherwise the
      // pointer streaks all the way from the centre of the hero
      if (!primed) {
        primed = true;
        px = p.x;
        py = p.y;
        return;
      }
      pending = p;
    }

    function onPointerDown(event) {
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

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
      freeTargets();
      Object.values(programs).forEach((p) => gl.deleteProgram(p));
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 -z-10 h-full w-full bg-[#060608] ${className}`}
    />
  );
}
