export const VS_BASE = `#version 300 es
in vec2 a_position;
out highp vec2 vUv;
void main(){ vUv = a_position * 0.5 + 0.5; gl_Position = vec4(a_position, 0., 1.); }`;

export const VS_TEXEL = `#version 300 es
in vec2 a_position;
uniform vec2 u_texelSize;
out highp vec2 vUv, vL, vR, vT, vB;
void main(){
  vUv = a_position * 0.5 + 0.5;
  vL = vUv - vec2(u_texelSize.x, 0.);  vR = vUv + vec2(u_texelSize.x, 0.);
  vT = vUv + vec2(0., u_texelSize.y);  vB = vUv - vec2(0., u_texelSize.y);
  gl_Position = vec4(a_position, 0., 1.);
}`;

export const FS_CLEAR = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_tex; uniform float u_value;
void main(){ fragColor.rgb = u_value * texture(u_tex, vUv).rgb; fragColor.a = 1.; }`;

export const FS_SPLAT = `#version 300 es
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

export const FS_ADVECT = `#version 300 es
precision highp float; precision highp sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_velocity; uniform sampler2D u_source;
uniform vec2 u_texelSize; uniform float u_ds; uniform float u_dissipation;
void main(){
  vec2 coord = vUv - u_ds * texture(u_velocity, vUv).xy * u_texelSize;
  fragColor.rgb = u_dissipation * texture(u_source, coord).rgb;
  fragColor.a = 1.;
}`;

export const FS_DIVERGENCE = `#version 300 es
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

export const FS_CURL = `#version 300 es
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

export const FS_VORTICITY = `#version 300 es
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

export const FS_PRESSURE = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vL, vR, vT, vB; out vec4 fragColor;
uniform sampler2D u_pressure; uniform sampler2D u_divergence;
void main(){
  float L = texture(u_pressure, vL).x; float R = texture(u_pressure, vR).x;
  float T = texture(u_pressure, vT).x; float B = texture(u_pressure, vB).x;
  float divergence = texture(u_divergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0., 0., 1.);
}`;

export const FS_GRADIENT = `#version 300 es
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

export const FS_NORMAL = `#version 300 es
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

export const FS_NORMALDELTA = `#version 300 es
precision mediump float; precision mediump sampler2D;
in highp vec2 vUv, vR, vB; out vec4 fragColor;
uniform sampler2D u_normal;
void main(){
  vec3 C = texture(u_normal, vUv).xyz;
  vec3 R = texture(u_normal, vR).xyz;
  vec3 B = texture(u_normal, vB).xyz;
  fragColor = vec4(abs(R - C) + abs(B - C), 1.);
}`;

export const FS_SCENE = `#version 300 es
precision highp float;
in highp vec2 vUv; out vec4 fragColor;
uniform float u_time; uniform vec2 u_res; uniform float u_theme;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 hash2(vec2 p){
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

void main(){
  vec2 uv = vUv;
  float y = clamp(uv.y, 0.0, 1.0);

  // Night Mode: Makoto Shinkai Cosmic Twilight Sky
  // Vast starry midnight sapphire sky with a delicate sunset amber horizon at the bottom
  vec3 cNightTop    = vec3(0.016, 0.024, 0.075); // Deep space obsidian indigo #040613
  vec3 cNightMid    = vec3(0.040, 0.068, 0.185); // Midnight starry sapphire #0a112f
  vec3 cNightDusk   = vec3(0.180, 0.080, 0.230); // Dusky violet blush #2e143b
  vec3 cNightPeach  = vec3(0.920, 0.420, 0.260); // Sunset coral #eb6b42
  vec3 cNightAmber  = vec3(0.970, 0.570, 0.330); // Horizon apricot #f89155

  // Delicate warm horizon strictly confined to bottom ~10%
  vec3 colNight = mix(cNightAmber, cNightPeach, smoothstep(0.0, 0.04, y));
  colNight = mix(colNight, cNightDusk,  smoothstep(0.03, 0.10, y));
  colNight = mix(colNight, cNightMid,   smoothstep(0.08, 0.28, y));
  colNight = mix(colNight, cNightTop,   smoothstep(0.25, 0.85, y));

  // Organic, Non-Uniform Twinkling Starfield in Night Sky
  if (uv.y > 0.14) {
    // Layer 1: Fine, organic stardust with randomized 2D cell jitter & independent twinkle
    vec2 grid1 = uv * vec2(120.0, 70.0);
    vec2 id1 = floor(grid1);
    vec2 f1 = fract(grid1);
    vec2 pos1 = hash2(id1); // Random offset breaks grid alignment completely
    float dist1 = length(f1 - pos1);
    float starSeed1 = hash(id1 + vec2(1.7, 4.3));
    // Each star gets an independent frequency, phase, and brightness
    float starRate1 = 1.2 + 3.8 * hash(id1 + vec2(9.1, 2.7));
    float starPhase1 = hash(id1 + vec2(5.3, 8.9)) * 6.28318;
    float starTwinkle1 = 0.25 + 0.75 * pow(0.5 + 0.5 * sin(u_time * starRate1 + starPhase1), 2.0);
    float starMask1 = step(0.68, starSeed1); // ~32% of cells have a star
    float starLight1 = exp(-dist1 * dist1 * 260.0) * starTwinkle1 * starMask1;

    // Layer 2: Sparse, brighter Shinkai landmark stars with soft breathing glow
    vec2 grid2 = (uv + vec2(0.37, 0.51)) * vec2(45.0, 26.0);
    vec2 id2 = floor(grid2);
    vec2 f2 = fract(grid2);
    vec2 pos2 = hash2(id2 + vec2(7.3, 3.1));
    float dist2 = length(f2 - pos2);
    float starSeed2 = hash(id2 + vec2(11.3, 17.9));
    float starRate2 = 0.8 + 2.2 * hash(id2 + vec2(13.5, 7.1));
    float starPhase2 = hash(id2 + vec2(4.1, 15.7)) * 6.28318;
    float starTwinkle2 = 0.35 + 0.65 * (0.5 + 0.5 * sin(u_time * starRate2 + starPhase2));
    float starMask2 = step(0.86, starSeed2); // ~14% of cells
    float core2 = exp(-dist2 * dist2 * 320.0);
    float glow2 = exp(-dist2 * 18.0) * 0.35;
    float starLight2 = (core2 + glow2) * starTwinkle2 * starMask2;

    float nightFade = smoothstep(0.14, 0.35, uv.y);
    vec3 starTint1 = mix(vec3(0.85, 0.92, 1.0), vec3(0.95, 0.88, 1.0), starSeed1);
    vec3 starTint2 = mix(vec3(0.70, 0.90, 1.0), vec3(1.0, 0.92, 0.85), starSeed2);
    colNight += (starTint1 * starLight1 * 0.45 + starTint2 * starLight2 * 0.65) * nightFade;
  }

  // Celestial Comet Arc (Makoto Shinkai streak sweeping across upper sky)
  float cometCurve = 0.48 + 0.60 * uv.x - 0.25 * uv.x * uv.x;
  float distToComet = abs(uv.y - cometCurve);
  float cometIntensity = exp(-distToComet * distToComet * 2800.0) * smoothstep(0.18, 0.88, uv.x);
  float cometGlow = exp(-distToComet * 14.0) * smoothstep(0.12, 0.92, uv.x) * 0.07;
  vec3 cometCore = vec3(0.35, 0.88, 1.0);  // Electric cyan core
  vec3 cometDust = vec3(0.85, 0.35, 0.75); // Magenta/violet stardust
  vec3 cometColor = mix(cometDust, cometCore, clamp(cometIntensity * 2.0, 0.0, 1.0));
  colNight += (cometColor * cometIntensity * 0.75 + cometDust * cometGlow) * smoothstep(0.20, 0.35, y);

  // Day Mode: Bohemian London Camden morning sky (100% untouched)
  // fresh azure -> cerulean -> soft mist -> warm sunlit cream
  vec3 cDayTop   = vec3(0.24, 0.54, 0.86); // Fresh azure #3d8adc
  vec3 cDayMid   = vec3(0.52, 0.76, 0.95); // Cerulean sky #85c2f2
  vec3 cDayLow   = vec3(0.80, 0.91, 0.98); // Soft morning mist #cce8fa
  vec3 cDayWarm  = vec3(0.98, 0.96, 0.92); // Warm sunlit cream #faf5eb

  vec3 colDay = mix(cDayWarm, cDayLow, smoothstep(0.0, 0.35, y));
  colDay = mix(colDay, cDayMid, smoothstep(0.30, 0.70, y));
  colDay = mix(colDay, cDayTop, smoothstep(0.65, 1.00, y));

  vec3 col = mix(colDay, colNight, u_theme);

  // Floating ambient bokeh: in Day mode soft azure/warm bubbles; in Night mode subtle warm lanterns near base
  for (int i = 0; i < 4; i++) {
    float f = float(i) * 1.379;
    vec2 c = vec2(0.15 + 0.70 * hash(vec2(float(i), 1.3)),
                  (0.15 + 0.40 * hash(vec2(float(i), 7.7))) * 0.6 + 0.05);
    c.x += 0.06 * sin(u_time * (0.12 + 0.06 * f) + f * 5.0);
    c.y += 0.04 * cos(u_time * (0.10 + 0.05 * f) + f * 3.0);
    float r = 0.10 + 0.06 * hash(vec2(f, 9.1));
    float k = hash(vec2(f, 4.3));

    vec3 tintDay = mix(vec3(0.35, 0.70, 0.95), vec3(0.98, 0.75, 0.45), smoothstep(0.3, 0.8, k));
    vec3 tintNight = mix(vec3(0.98, 0.60, 0.25), vec3(0.40, 0.75, 1.0), smoothstep(0.4, 0.9, k));
    vec3 tint = mix(tintDay, tintNight, u_theme);

    float d = length(uv - c) / r;
    col += tint * (0.20 * exp(-d * d * 5.0));
  }

  // Horizon warm dusk ray (active mostly near the bottom)
  float beam = exp(-pow((uv.x * 1.2 - uv.y + 0.05 + 0.05 * sin(u_time * 0.25)) * 8.0, 2.0));
  col += mix(vec3(0.85, 0.92, 1.0) * 0.08, vec3(0.98, 0.55, 0.32) * 0.12 * smoothstep(0.25, 0.0, y), u_theme) * beam;

  col = pow(col, vec3(0.96));
  fragColor = vec4(col, 1.);
}`;

export const FS_REFRACT = `#version 300 es
precision highp float; precision highp sampler2D;
in highp vec2 vUv; out vec4 fragColor;
uniform sampler2D u_scene; uniform sampler2D u_normal; uniform sampler2D u_normDelta;
uniform sampler2D u_density;
uniform vec2 u_res; uniform float u_time; uniform float u_theme;
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
  vec3 skycDay = mix(vec3(0.65, 0.82, 0.98), vec3(0.98, 0.85, 0.70), pow(max(refl.y * 0.5 + 0.5, 0.), 2.5));
  vec3 skycNight = mix(vec3(0.03, 0.05, 0.16), vec3(0.20, 0.65, 0.95), pow(max(refl.y * 0.5 + 0.5, 0.), 2.5));
  vec3 skyc = mix(skycDay, skycNight, u_theme);
  vec3 reflCol = skyc * (0.04 + 0.55 * f * disp);

  vec3 edg = texture(u_normDelta, fragUv).xyz;
  vec3 rimDay = vec3(0.40, 0.75, 0.95) * clamp(dot(edg, vec3(0.333)) * 6.0, 0., 1.) * 0.2;
  vec3 rimNight = mix(vec3(0.95, 0.58, 0.28), vec3(0.30, 0.72, 0.95), smoothstep(0.05, 0.25, fragUv.y)) * clamp(dot(edg, vec3(0.333)) * 8.0, 0., 1.) * 0.22;
  vec3 rim = mix(rimDay, rimNight, u_theme);

  vec3 L = normalize(vec3(-0.5, 0.6, 0.7));
  vec3 H = normalize(L - view);
  float spec = pow(max(dot(nrm, H), 0.), 140.0) * mask * (0.5 + disp * 1.5);

  vec3 col = mix(plain, liquid, mask);
  col += reflCol * mask;
  col += rim;
  col += mix(vec3(1., 0.98, 0.95), vec3(1., 0.95, 0.85), u_theme) * spec;
  fragColor = vec4(col, 1.);
}`;

