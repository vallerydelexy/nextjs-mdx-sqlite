"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export default function DioramaCanvas({ className = "" }) {
  const mountRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const setTodRef = useRef(null);

  useEffect(() => {
    if (setTodRef.current) {
      setTodRef.current(resolvedTheme === "dark" ? "night" : "day");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId;
    const FPS = 24;

    /* ------------------------------------------------------------- Ghibli Palette -- */
    const PAL = {
      // Warm painterly stucco walls (Totoro / Kiki / Howl warm cottage aesthetic)
      wallF: "#fdf6e7", // bright sunlit butter-cream
      wallL: "#fffdf5", // highlight warm ivory
      wallS: "#e2d5c1", // warm shaded stucco
      wallD: "#c4b39c", // deep shade stucco
      brick: "#b85638", // exposed rustic clay brick
      brickDark: "#85361e",

      // Baked terracotta clay roof tiles
      tile: "#cf5634", // vibrant warm terracotta
      tileDark: "#91331c", // shaded tile
      tileLight: "#e8724d", // sun-struck highlight tile
      tileUnder: "#5e2010", // dark underside wood

      // Cedar, oak & chestnut timber framing
      wood: "#583b27", // rich warm chestnut
      woodDark: "#382315", // dark umber timber beam
      woodLight: "#8e6545", // warm sunlit wood
      woodFascia: "#462c1b",

      // Foundation stone & cobblestones
      stoneCap: "#d0cbbe",
      stoneBase: "#9c9485",
      stoneDark: "#6b6456",

      // Metals & brass
      metal: "#555260", metalDark: "#373542", metalLight: "#848194",
      brass: "#dfa745", brassLight: "#f8d578", brassDark: "#9a6c22",

      // Water cistern
      tankWood: "#8a7560", tankDark: "#5c4d3d", tankLight: "#ad9982", tankBand: "#38363c",

      // Glowing stained-glass / paper lantern windows
      glass: "#ffb84d", glassTop: "#ffe29e", glassWarm: "#ff8c2b",

      // Lush Studio Ghibli foliage & grass
      grassTop: "#6ea845", // vibrant field green
      grassLight: "#8ec754", // sun-struck chartreuse
      grassDark: "#47722b", // deep shadow moss
      earth: "#4f3a29", // cliff soil underbelly
      earthDark: "#362619",

      pot: "#b86340", potDark: "#8a4325",
      cat: "#241f26", bird: "#4a4550",

      // Colorful cottage flowers
      flower: ["#ff7360", "#ffce4f", "#b890e8", "#fff2da", "#ff5c4d", "#52abff", "#ff8eb5"]
    };

    function hex2rgb(h) {
      const n = parseInt(h.slice(1), 16);
      return [n >> 16 & 255, n >> 8 & 255, n & 255];
    }
    function shade(h, k) {
      const c = hex2rgb(h);
      return "rgb(" + Math.min(255, (c[0] * k) | 0) + "," + Math.min(255, (c[1] * k) | 0) + "," + Math.min(255, (c[2] * k) | 0) + ")";
    }
    function rgba(h, a) {
      const c = hex2rgb(h);
      return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
    }

    let seed = 4177;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }
    function rr(a, b) {
      return a + rnd() * (b - a);
    }

    function canvas(w, h, ss = 2) {
      const c = document.createElement("canvas");
      c.width = Math.round(w * ss);
      c.height = Math.round(h * ss);
      const g = c.getContext("2d");
      g.scale(ss, ss);
      g.lineJoin = "round";
      g.lineCap = "round";
      return { c, g, w, h };
    }

    const createdTextures = [];
    function texture(c) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      t.minFilter = THREE.LinearFilter;
      createdTextures.push(t);
      return t;
    }

    function pathRect(g, x, y, w, h, r = 0) {
      r = Math.min(r, w / 2, h / 2);
      g.beginPath();
      g.moveTo(x + r, y);
      g.lineTo(x + w - r, y);
      g.quadraticCurveTo(x + w, y, x + w, y + r);
      g.lineTo(x + w, y + h - r);
      g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      g.lineTo(x + r, y + h);
      g.quadraticCurveTo(x, y + h, x, y + h - r);
      g.lineTo(x, y + r);
      g.quadraticCurveTo(x, y, x + r, y);
      g.closePath();
    }
    function fillRect(g, x, y, w, h, fill, r = 0) {
      pathRect(g, x, y, w, h, r);
      g.fillStyle = fill;
      g.fill();
    }
    function strokeRect(g, x, y, w, h, col, lw, r = 0) {
      pathRect(g, x, y, w, h, r);
      g.strokeStyle = col;
      g.lineWidth = lw;
      g.stroke();
    }
    function line(g, x1, y1, x2, y2, col, lw) {
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      g.strokeStyle = col;
      g.lineWidth = lw;
      g.stroke();
    }
    function poly(g, pts, fill, stroke, lw = 1.4) {
      g.beginPath();
      g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
      g.closePath();
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
    }
    function ellipse(g, x, y, rx, ry, fill, stroke, lw = 1.2) {
      g.beginPath();
      g.ellipse(x, y, rx, ry, 0, 0, 6.2832);
      if (fill) { g.fillStyle = fill; g.fill(); }
      if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
    }

    const INK = "rgba(48,34,38,0.60)";
    const INK2 = "rgba(36,24,28,0.85)";

    /* ------------------------------------------------------------- Face Painters -- */

    function wallFill(g, w, h, opts = {}) {
      // Warm Ghibli watercolor stucco gradient
      const grd = g.createLinearGradient(0, 0, w * 0.25, h);
      grd.addColorStop(0, PAL.wallL);
      grd.addColorStop(0.35, PAL.wallF);
      grd.addColorStop(1, PAL.wallD);
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);

      // Painterly watercolor stipples
      for (let i = 0; i < 30; i++) {
        g.fillStyle = rnd() < 0.5 ? "rgba(224,195,150,0.08)" : "rgba(255,250,235,0.12)";
        g.beginPath();
        g.ellipse(rr(0, w), rr(0, h), rr(14, 55), rr(10, 32), 0, 0, 6.2832);
        g.fill();
      }

      // Exposed rustic cottage brickwork peeking through stucco
      if (opts.brick !== false) {
        const bw = 20, bh = 9;
        const bxStart = opts.brickX || rr(15, Math.max(20, w - 80));
        const byStart = opts.brickY || (h - 28);
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 3; c++) {
            const bx = bxStart + c * (bw + 2) + (r % 2 ? bw * 0.45 : 0);
            const by = byStart + r * (bh + 2);
            fillRect(g, bx, by, bw, bh, shade(PAL.brick, 0.9 + (c % 2) * 0.15), 1.5);
            strokeRect(g, bx, by, bw, bh, "rgba(50,20,10,0.3)", 0.9, 1.5);
          }
        }
      }

      // Half-timbered Tudor/Ghibli timber beams (vertical frame & top trim)
      line(g, 2, 0, 2, h, rgba(PAL.woodDark, 0.8), 3.5);
      line(g, w - 2, 0, w - 2, h, rgba(PAL.woodDark, 0.8), 3.5);
      line(g, 0, 2, w, 2, rgba(PAL.woodDark, 0.8), 3);

      if (opts.crossTimber) {
        // Diagonal timber brace
        line(g, 4, h - 4, w * 0.45, 4, rgba(PAL.wood, 0.45), 3);
        line(g, w - 4, h - 4, w * 0.55, 4, rgba(PAL.wood, 0.45), 3);
      }

      g.strokeStyle = INK;
      g.lineWidth = 1.5;
      g.strokeRect(0.8, 0.8, w - 1.6, h - 1.6);
    }

    function eaveShadow(g, w, h, depth = 32) {
      const grd = g.createLinearGradient(0, 0, 0, depth);
      grd.addColorStop(0, "rgba(42,26,22,0.48)");
      grd.addColorStop(0.55, "rgba(42,26,22,0.18)");
      grd.addColorStop(1, "rgba(42,26,22,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, depth);
    }

    function baseShadow(g, w, h, depth = 22) {
      const grd = g.createLinearGradient(0, h - depth, 0, h);
      grd.addColorStop(0, "rgba(36,26,30,0)");
      grd.addColorStop(1, "rgba(36,26,30,0.35)");
      g.fillStyle = grd;
      g.fillRect(0, h - depth, w, depth);
    }

    function windowUnit(g, x, y, w, h, opts = {}) {
      const arch = opts.arch || 0;
      const fw = 7;

      g.save();
      g.beginPath();
      if (arch) {
        g.moveTo(x, y + h);
        g.lineTo(x, y + arch);
        g.quadraticCurveTo(x, y, x + w / 2, y);
        g.quadraticCurveTo(x + w, y, x + w, y + arch);
        g.lineTo(x + w, y + h);
        g.closePath();
      } else {
        g.rect(x, y, w, h);
      }
      g.fillStyle = PAL.wood;
      g.fill();
      g.strokeStyle = INK2;
      g.lineWidth = 1.8;
      g.stroke();
      g.restore();

      const ix = x + fw, iy = y + fw, iw = w - fw * 2, ih = h - fw * 2;

      g.save();
      g.beginPath();
      if (arch) {
        g.moveTo(ix, iy + ih);
        g.lineTo(ix, iy + arch * 0.8);
        g.quadraticCurveTo(ix, iy, x + w / 2, iy);
        g.quadraticCurveTo(x + w - fw, iy, x + w - fw, iy + arch * 0.8);
        g.lineTo(x + w - fw, iy + ih);
        g.closePath();
      } else {
        g.rect(ix, iy, iw, ih);
      }
      g.clip();

      // Honey-amber warm glowing window light (anime evening glow)
      const gl = g.createLinearGradient(ix, iy, ix, iy + ih);
      gl.addColorStop(0, "#ffefa8");
      gl.addColorStop(0.35, "#ffc660");
      gl.addColorStop(0.75, "#f79634");
      gl.addColorStop(1, "#c95818");
      g.fillStyle = gl;
      g.fillRect(ix, iy, iw, ih);

      // Glass reflection streak
      g.fillStyle = "rgba(255,255,255,0.28)";
      g.beginPath();
      g.moveTo(ix, iy + ih * 0.1);
      g.lineTo(ix + iw * 0.65, iy + ih);
      g.lineTo(ix + iw * 0.35, iy + ih);
      g.lineTo(ix, iy + ih * 0.45);
      g.closePath();
      g.fill();

      // Draped Ghibli lace curtains
      const cur = Math.min(14, iw * 0.24);
      g.fillStyle = "rgba(255,252,240,0.8)";
      g.beginPath();
      g.moveTo(ix, iy);
      g.lineTo(ix + cur, iy);
      g.quadraticCurveTo(ix + cur * 0.4, iy + ih * 0.55, ix + cur * 0.85, iy + ih);
      g.lineTo(ix, iy + ih);
      g.closePath();
      g.fill();

      g.beginPath();
      g.moveTo(ix + iw, iy);
      g.lineTo(ix + iw - cur, iy);
      g.quadraticCurveTo(ix + iw - cur * 0.4, iy + ih * 0.55, ix + iw - cur * 0.85, iy + ih);
      g.lineTo(ix + iw, iy + ih);
      g.closePath();
      g.fill();

      // Wooden glazing bars / muntins
      const cols = opts.cols || 2, rows = opts.rows || 2;
      for (let i = 1; i < cols; i++) {
        line(g, ix + iw * i / cols, iy, ix + iw * i / cols, iy + ih, rgba(PAL.woodDark, 0.85), 3);
      }
      for (let k = 1; k < rows; k++) {
        line(g, ix, iy + ih * k / rows, ix + iw, iy + ih * k / rows, rgba(PAL.woodDark, 0.8), 2.5);
      }
      g.restore();

      // Window sill & trim
      fillRect(g, x - 5, y + h - 2, w + 10, 7, PAL.stoneCap, 2);
      strokeRect(g, x - 5, y + h - 2, w + 10, 7, INK, 1.2, 2);
      if (opts.box) flowerBox(g, x - 4, y + h + 5, w + 8, PAL.wood);
    }

    function flowerBox(g, x, y, w, base) {
      fillRect(g, x, y, w, 14, base, 2);
      fillRect(g, x, y, w, 3.5, shade(base, 1.25), 2);
      strokeRect(g, x, y, w, 14, INK2, 1.2, 2);
      for (let i = 0; i < w / 9; i++) {
        const fx = x + 5 + i * 9 + rr(-2, 2);
        ellipse(g, fx, y - 2 + rr(-3, 1), 4.5, 3.5, PAL.flower[i % PAL.flower.length], "rgba(40,36,46,0.25)", 0.9);
        ellipse(g, fx - 4, y + 4, 4.8, 3.0, PAL.grassLight);
        ellipse(g, fx + 4, y + 6, 5.2, 3.2, PAL.grassDark);
      }
    }

    function doorUnit(g, x, y, w, h) {
      const grd = g.createLinearGradient(x, y, x + w, y);
      grd.addColorStop(0, PAL.woodLight);
      grd.addColorStop(1, PAL.woodDark);
      fillRect(g, x, y, w, h, grd, 2);
      strokeRect(g, x, y, w, h, INK2, 1.8, 2);

      // Glass upper panel
      fillRect(g, x + 5, y + 7, w - 10, h * 0.4, "rgba(255,220,130,0.78)", 1);
      line(g, x + 5, y + 7 + h * 0.4, x + w - 5, y + 7 + h * 0.4, rgba(PAL.woodDark, 0.8), 2.5);
      line(g, x + w / 2, y + 7, x + w / 2, y + 7 + h * 0.4, rgba(PAL.woodDark, 0.8), 2);

      // Wood lower panel
      fillRect(g, x + 5, y + h * 0.54, w - 10, h * 0.38, "rgba(45,26,16,0.38)", 1);

      // Brass round door knob
      ellipse(g, x + w - 10, y + h * 0.52, 3, 3, PAL.brassLight, INK, 1);
    }

    function awning(g, cx, y, w, base) {
      poly(g, [
        [cx - w / 2 - 6, y + 22],
        [cx + w / 2 + 6, y + 22],
        [cx + w / 2, y],
        [cx - w / 2, y]
      ], base, INK2, 1.5);
      for (let i = 1; i < 4; i++) {
        const t = i / 4;
        line(g, cx - w / 2 + w * t, y + 1, cx - w / 2 - 6 + (w + 12) * t, y + 21, "rgba(48,16,8,0.25)", 1.5);
      }
      fillRect(g, cx - w / 2 - 7, y + 20, w + 14, 4.5, shade(base, 0.75), 1);
      const sh = g.createLinearGradient(0, y + 24, 0, y + 48);
      sh.addColorStop(0, "rgba(42,24,20,0.35)");
      sh.addColorStop(1, "rgba(42,24,20,0)");
      g.fillStyle = sh;
      g.fillRect(cx - w / 2 - 8, y + 24, w + 16, 24);
    }

    function lantern(g, x, y, s) {
      line(g, x, y - 24 * s, x, y - 5 * s, PAL.brassDark, 2.2 * s);
      line(g, x - 12 * s, y - 5 * s, x + 12 * s, y - 5 * s, PAL.brass, 2.2 * s);
      poly(g, [[x - 9 * s, y - 3 * s], [x + 9 * s, y - 3 * s], [x + 6 * s, y + 15 * s], [x - 6 * s, y + 15 * s]], rgba(PAL.glass, 0.95), INK2, 1.2);
      fillRect(g, x - 11 * s, y + 13 * s, 22 * s, 4 * s, PAL.brassDark, 1.5);
      poly(g, [[x - 10 * s, y - 3 * s], [x + 10 * s, y - 3 * s], [x + 6 * s, y - 9 * s], [x - 6 * s, y - 9 * s]], PAL.brass, INK2, 1.1);
    }

    function roofTiles(g, w, h) {
      g.fillStyle = shade(PAL.tile, 0.68);
      g.fillRect(0, 0, w, h);

      const rows = Math.max(4, Math.round(h / 20));
      const cols = Math.max(4, Math.round(w / 24));
      const tw = w / cols, rh = h / rows;

      for (let r = -1; r <= rows; r++) {
        for (let c = -1; c <= cols; c++) {
          const x = c * tw + (r % 2 ? tw * 0.5 : 0);
          const y = r * rh;
          g.fillStyle = shade(PAL.tile, 0.85 + rnd() * 0.28);
          pathRect(g, x + 1, y + 1, tw - 2, rh + 3.5, 3);
          g.fill();
          g.strokeStyle = "rgba(48,16,8,0.32)";
          g.lineWidth = 1.1;
          g.stroke();
          // Sunlight highlight on rim
          g.fillStyle = "rgba(255,225,190,0.24)";
          g.fillRect(x + 2, y + 2, tw - 4, 2);
        }
      }

      const grd = g.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(255,200,160,0.16)");
      grd.addColorStop(1, "rgba(35,14,6,0.26)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
    }

    function deckPlanks(g, w, h) {
      g.fillStyle = PAL.wood;
      g.fillRect(0, 0, w, h);
      for (let i = 0; i < h / 8; i++) {
        fillRect(g, 1, i * 8, w - 2, 6.8, shade(PAL.wood, 0.9 + (i % 3) * 0.08), 1);
      }
      const grd = g.createLinearGradient(0, 0, 0, h);
      grd.addColorStop(0, "rgba(255,225,190,0.14)");
      grd.addColorStop(1, "rgba(24,14,8,0.30)");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
    }

    function clothTexture(kind, base) {
      const w = 128, h = 152, cv = canvas(w, h, 3), g = cv.g;
      const ink = "rgba(50,40,42,0.80)";
      function fold(x, y1, y2, a) {
        line(g, x, y1, x + 3, y2, "rgba(55,42,36," + a + ")", 2);
      }
      if (kind === "towel") {
        poly(g, [[26, 18], [102, 18], [104, 132], [24, 134]], base, ink, 1.6);
        g.save(); pathRect(g, 24, 18, 80, 116, 2); g.clip();
        g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(24, 18, 26, 116);
        g.fillStyle = "rgba(60,35,25,0.18)"; g.fillRect(88, 18, 18, 116);
        g.restore();
        fold(56, 26, 128, 0.16);
      } else if (kind === "shirt") {
        poly(g, [[42, 20], [86, 20], [104, 34], [118, 62], [104, 72], [94, 54], [94, 132], [34, 132], [34, 54], [24, 72], [10, 62], [26, 34]], base, ink, 1.6);
        poly(g, [[50, 20], [64, 34], [78, 20]], "rgba(248,244,236,0.9)", ink, 1.2);
        fold(58, 40, 128, 0.16);
      } else if (kind === "stripes") {
        poly(g, [[42, 20], [86, 20], [104, 34], [118, 62], [104, 72], [94, 54], [94, 132], [34, 132], [34, 54], [24, 72], [10, 62], [26, 34]], base, ink, 1.6);
        g.save();
        g.beginPath();
        g.moveTo(42, 20); g.lineTo(86, 20); g.lineTo(104, 34); g.lineTo(118, 62); g.lineTo(104, 72); g.lineTo(94, 54);
        g.lineTo(94, 132); g.lineTo(34, 132); g.lineTo(34, 54); g.lineTo(24, 72); g.lineTo(10, 62); g.lineTo(26, 34);
        g.closePath(); g.clip();
        g.fillStyle = "rgba(215,82,68,0.92)";
        for (let s = 0; s < 8; s++) g.fillRect(6, 26 + s * 14, 118, 7);
        g.restore();
        poly(g, [[50, 20], [64, 34], [78, 20]], "rgba(248,244,236,0.85)", ink, 1.2);
      } else if (kind === "jeans") {
        poly(g, [[38, 16], [90, 16], [92, 60], [86, 136], [66, 136], [64, 62], [62, 62], [60, 136], [40, 136], [34, 60]], base, ink, 1.6);
        line(g, 52, 34, 50, 130, "rgba(40,50,70,0.5)", 1.6);
        g.fillStyle = "rgba(40,50,70,0.25)"; g.fillRect(38, 16, 54, 11);
      } else {
        poly(g, [[24, 22], [106, 18], [110, 122], [20, 126]], base, ink, 1.6);
        fold(58, 30, 120, 0.14);
      }
      return cv.c;
    }

    function leafCluster(seedOffset, base) {
      const s = 128, cv = canvas(s, s, 2), g = cv.g;
      seed = 1000 + seedOffset * 77;
      g.strokeStyle = "rgba(40,62,30,0.55)";
      g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(64, 118); g.quadraticCurveTo(54, 76, 66, 40); g.stroke();
      for (let i = 0; i < 20; i++) {
        const a = rr(0, 6.2832), r = Math.pow(rnd(), 0.55) * 46;
        const x = s / 2 + Math.cos(a) * r, y = s / 2 + Math.sin(a) * r * 0.9;
        g.save();
        g.translate(x, y);
        g.rotate(rr(-1.7, 1.7));
        const sc = rr(0.95, 1.6);
        g.scale(sc, sc);
        g.beginPath();
        g.moveTo(0, -10);
        g.bezierCurveTo(9, -8, 9, 6, 0, 11);
        g.bezierCurveTo(-9, 6, -9, -8, 0, -10);
        g.fillStyle = shade(base, rr(0.8, 1.25));
        g.fill();
        g.strokeStyle = "rgba(30,48,22,0.65)";
        g.lineWidth = 1.3;
        g.stroke();
        g.restore();
      }
      return cv.c;
    }

    function smokeSprite(v) {
      const s = 256, cv = canvas(s, s, 2), g = cv.g;
      seed = 500 + v * 97;
      // Multi-lobed soft Ghibli cloud puff
      const lobes = [
        { x: s / 2 - 14, y: s / 2 + 10, r: 48 },
        { x: s / 2 + 16, y: s / 2 + 8, r: 46 },
        { x: s / 2 - 8, y: s / 2 - 16, r: 52 },
        { x: s / 2 + 12, y: s / 2 - 10, r: 44 },
        { x: s / 2, y: s / 2, r: 58 }
      ];

      // Draw soft cloud base lobes with feathered edges (smooth falloff to 0 opacity)
      for (let p = 0; p < lobes.length; p++) {
        const lb = lobes[p];
        const grd = g.createRadialGradient(lb.x - 8, lb.y - 10, lb.r * 0.15, lb.x, lb.y, lb.r);
        grd.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grd.addColorStop(0.38, "rgba(252, 248, 240, 0.85)");
        grd.addColorStop(0.7, "rgba(230, 222, 210, 0.45)");
        grd.addColorStop(0.9, "rgba(215, 205, 195, 0.12)");
        grd.addColorStop(1, "rgba(200, 190, 180, 0)"); // Smooth zero-edge fade (no hard cuts!)
        g.fillStyle = grd;
        g.beginPath();
        g.arc(lb.x, lb.y, lb.r, 0, 6.2832);
        g.fill();
      }

      // Soft painterly cloud bottom shading (subtle warm Ghibli shadow)
      for (let q = 0; q < 3; q++) {
        const lb = lobes[q];
        const shGrd = g.createRadialGradient(lb.x + 4, lb.y + 14, 2, lb.x + 4, lb.y + 14, lb.r * 0.65);
        shGrd.addColorStop(0, "rgba(180, 168, 156, 0.22)");
        shGrd.addColorStop(0.6, "rgba(180, 168, 156, 0.08)");
        shGrd.addColorStop(1, "rgba(180, 168, 156, 0)");
        g.fillStyle = shGrd;
        g.beginPath();
        g.arc(lb.x + 4, lb.y + 14, lb.r * 0.65, 0, 6.2832);
        g.fill();
      }

      return cv.c;
    }

    function catBody() {
      const cv = canvas(96, 110, 3), g = cv.g;
      g.fillStyle = PAL.cat;
      g.beginPath(); g.ellipse(52, 74, 22, 25, 0, 0, 6.2832); g.fill();
      g.beginPath();
      g.moveTo(30, 96);
      g.bezierCurveTo(25, 62, 27, 46, 35, 38);
      g.lineTo(52, 38);
      g.bezierCurveTo(64, 46, 70, 62, 68, 96);
      g.quadraticCurveTo(50, 104, 30, 96);
      g.closePath(); g.fill();
      g.beginPath(); g.ellipse(40, 38, 18, 16, 0, 0, 6.2832); g.fill();
      g.beginPath(); g.moveTo(24, 30); g.lineTo(23, 8); g.lineTo(39, 22); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(57, 28); g.lineTo(60, 8); g.lineTo(44, 21); g.closePath(); g.fill();
      g.beginPath();
      g.moveTo(30, 88); g.quadraticCurveTo(25, 104, 34, 105); g.lineTo(49, 105);
      g.quadraticCurveTo(44, 96, 46, 84); g.closePath(); g.fill();
      g.fillStyle = "#f0c94f";
      g.beginPath(); g.ellipse(33, 38, 3.8, 2.7, -0.1, 0, 6.2832); g.fill();
      g.beginPath(); g.ellipse(47, 38, 3.8, 2.7, 0.1, 0, 6.2832); g.fill();
      g.fillStyle = "#1e1a22";
      g.beginPath(); g.ellipse(33.3, 38, 1.25, 2.4, 0, 0, 6.2832); g.fill();
      g.beginPath(); g.ellipse(47.3, 38, 1.25, 2.4, 0, 0, 6.2832); g.fill();
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.beginPath(); g.arc(32, 36.7, 0.8, 0, 6.2832); g.fill();
      g.beginPath(); g.arc(46, 36.7, 0.8, 0, 6.2832); g.fill();
      return cv.c;
    }

    function catTail() {
      const cv = canvas(96, 110, 3), g = cv.g;
      g.strokeStyle = PAL.cat;
      g.lineCap = "round";
      g.lineWidth = 11;
      g.beginPath();
      g.moveTo(18, 100);
      g.bezierCurveTo(48, 96, 62, 66, 54, 40);
      g.bezierCurveTo(50, 26, 36, 24, 30, 33);
      g.stroke();
      return cv.c;
    }

    function birdSprite(up) {
      const cv = canvas(64, 44, 3), g = cv.g;
      const d = up ? -1 : 1;
      g.strokeStyle = PAL.bird;
      g.lineWidth = 4.2;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(12, 24);
      g.quadraticCurveTo(21, 24 + d * 9, 32, 21);
      g.quadraticCurveTo(43, 24 + d * 9, 52, 24);
      g.stroke();
      return cv.c;
    }

    /* ---------------------------------------------------------------- 3D setup -- */

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);

    const canvasElement = renderer.domElement;
    canvasElement.style.display = "block";
    canvasElement.style.width = "100%";
    canvasElement.style.height = "100%";
    container.appendChild(canvasElement);

    const scene = new THREE.Scene();
    scene.background = null;

    // Center diorama target at the heart of the tower cottage
    const TARGET = new THREE.Vector3(0, 168, 0);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 8000);

    let baseYaw = THREE.MathUtils.degToRad(22);
    let basePitch = THREE.MathUtils.degToRad(12);
    let curYaw = baseYaw;
    let curPitch = basePitch;
    let targetYaw = baseYaw;
    let targetPitch = basePitch;

    function updateCameraPos() {
      camera.position.set(
        TARGET.x + Math.sin(curYaw) * Math.cos(curPitch) * 3000,
        TARGET.y + Math.sin(curPitch) * 3000,
        TARGET.z + Math.cos(curYaw) * Math.cos(curPitch) * 3000
      );
      camera.up.set(0, 1, 0);
      camera.lookAt(TARGET);
    }
    updateCameraPos();

    function fit() {
      if (!container || !renderer || !camera) return;
      const vw = container.clientWidth || window.innerWidth;
      const vh = container.clientHeight || (vw * 0.75);
      const aspect = vw / vh;

      const isMobile = vw < 768 || aspect < 1.0;
      if (isMobile) {
        // Vertical mobile framing: center on tower and frame full height cleanly without cropping
        TARGET.set(0, 195, 0);
        let h = 485;
        let w = h * aspect;
        if (w < 380) {
          w = 380;
          h = w / aspect;
        }
        camera.left = -w / 2; camera.right = w / 2;
        camera.top = h / 2; camera.bottom = -h / 2;
      } else {
        // Desktop landscape 3/4 framing
        TARGET.set(0, 170, 0);
        let h = 510;
        let w = h * aspect;
        if (w < 680) {
          w = 680;
          h = w / aspect;
        }
        camera.left = -w / 2; camera.right = w / 2;
        camera.top = h / 2; camera.bottom = -h / 2;
      }

      camera.updateProjectionMatrix();
      updateCameraPos();
      renderer.setSize(vw, vh, false);
    }

    // Subtle pointer parallax tilt across the whole window viewport
    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetYaw = baseYaw + nx * THREE.MathUtils.degToRad(5.5);
      targetPitch = THREE.MathUtils.clamp(basePitch - ny * THREE.MathUtils.degToRad(3.5), 0.05, 0.45);
    };
    window.addEventListener("pointermove", handlePointerMove);

    const createdMaterials = [];
    const createdGeometries = [];

    function mat(w, h, painter, opts) {
      const cv = canvas(w, h, (opts && opts.ss) || 2);
      painter(cv.g, w, h);
      const m = new THREE.MeshBasicMaterial({ map: texture(cv.c) });
      createdMaterials.push(m);
      return m;
    }

    function flatMat(color) {
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
      createdMaterials.push(m);
      return m;
    }

    function addBox(w, h, d, mats, x, y, z) {
      const geo = new THREE.BoxGeometry(w, h, d);
      createdGeometries.push(geo);
      const m = new THREE.Mesh(geo, mats);
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    }

    function body(x0, x1, y0, y1, z0, z1, frontMat, sideMat, topMat) {
      const w = x1 - x0, h = y1 - y0, d = z1 - z0;
      const dark = flatMat("#2a1a12");
      return addBox(w, h, d, [sideMat, sideMat, topMat, dark, frontMat, sideMat],
        (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    }

    /* ------------------------------------------------------------- Pitched Gable Roof -- */
    function addPitchedGableRoof(x0, x1, yBase, z0, z1, roofHeight, matTiles, matUnder) {
      const w = x1 - x0 + 24;
      const d = z1 - z0;
      const xMid = (x0 + x1) / 2;
      const zMid = (z0 + z1) / 2;
      const halfD = d / 2 + 14;
      const slopeLen = Math.sqrt(halfD * halfD + roofHeight * roofHeight);
      const angle = Math.atan2(roofHeight, halfD);

      const roofThickness = 7;
      const roofMat = [flatMat(PAL.woodDark), flatMat(PAL.woodDark), matTiles, matUnder, flatMat(PAL.woodDark), flatMat(PAL.woodDark)];

      // Front sloping plane
      const frontMesh = addBox(w, roofThickness, slopeLen, roofMat, xMid, yBase + roofHeight / 2, zMid + halfD / 2);
      frontMesh.rotation.x = angle;

      // Rear sloping plane
      const rearMesh = addBox(w, roofThickness, slopeLen, roofMat, xMid, yBase + roofHeight / 2, zMid - halfD / 2);
      rearMesh.rotation.x = -angle;

      // Terracotta ridge cap
      const ridgeCap = addBox(w + 2, 8, 12, flatMat(PAL.tileDark), xMid, yBase + roofHeight + 2, zMid);

      // Triangular gable walls on the sides
      addBox(6, roofHeight - 2, d - 4, flatMat(PAL.wallS), x0 + 3, yBase + roofHeight / 2 - 2, zMid);
      addBox(6, roofHeight - 2, d - 4, flatMat(PAL.wallS), x1 - 3, yBase + roofHeight / 2 - 2, zMid);

      // Exposed rafter brackets under eaves
      const rafterMat = flatMat(PAL.woodDark);
      for (let rx = x0 + 6; rx <= x1; rx += 24) {
        addBox(4, 6, 12, rafterMat, rx, yBase - 1, z1 + 8);
        addBox(4, 6, 12, rafterMat, rx, yBase - 1, z0 - 8);
      }

      return { frontMesh, rearMesh, ridgeCap };
    }

    /* ------------------------------------------------- Floating Island Diorama Base -- */
    // Top Grass Mound
    const islandGeo = new THREE.CylinderGeometry(180, 195, 26, 36);
    createdGeometries.push(islandGeo);
    const grassTopCv = canvas(256, 256, 2);
    const gg = grassTopCv.g;
    const ggrd = gg.createRadialGradient(128, 128, 20, 128, 128, 128);
    ggrd.addColorStop(0, PAL.grassLight);
    ggrd.addColorStop(0.65, PAL.grassTop);
    ggrd.addColorStop(1, PAL.grassDark);
    gg.fillStyle = ggrd;
    gg.fillRect(0, 0, 256, 256);
    // Grass blades & tiny flowers
    for (let i = 0; i < 90; i++) {
      const gx = rr(20, 236), gy = rr(20, 236);
      ellipse(gg, gx, gy, rr(2, 4), rr(1.5, 3), PAL.grassLight);
      if (rnd() < 0.25) {
        ellipse(gg, gx + 2, gy - 2, 2.5, 2.5, PAL.flower[i % PAL.flower.length]);
      }
    }
    const islandTopMat = new THREE.MeshBasicMaterial({ map: texture(grassTopCv.c) });
    createdMaterials.push(islandTopMat);

    // Island Earth / Cliff Rim
    const islandRimCv = canvas(256, 64, 2);
    const irg = islandRimCv.g;
    const igrd = irg.createLinearGradient(0, 0, 0, 64);
    igrd.addColorStop(0, PAL.grassDark);
    igrd.addColorStop(0.3, PAL.earth);
    igrd.addColorStop(1, PAL.earthDark);
    irg.fillStyle = igrd;
    irg.fillRect(0, 0, 256, 64);
    for (let r = 0; r < 24; r++) {
      ellipse(irg, rr(0, 256), rr(16, 56), rr(8, 24), rr(4, 12), "rgba(30,18,12,0.35)");
    }
    const islandRimMat = new THREE.MeshBasicMaterial({ map: texture(islandRimCv.c) });
    createdMaterials.push(islandRimMat);

    const islandMat = [islandRimMat, islandTopMat, flatMat(PAL.earthDark)];
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, -13, 0);
    scene.add(islandMesh);

    // Stone Steps from Grass to Porch
    const stepMat = flatMat(PAL.stoneBase);
    addBox(56, 6, 24, stepMat, 38, -2, 92);
    addBox(62, 6, 22, stepMat, 38, -7, 102);

    /* --------------------------------------------------------------- Geometry -- */
    /* Vertical Ghibli Tower House Stack:
       Level 1 (Ground Cottage): x: -90 to 90, y: 0 to 110, z: -80 to 65
       Level 2 (Mid-Tower):     x: -70 to 75, y: 110 to 195, z: -70 to 55
       Level 3 (Attic/Roof):    x: -55 to 60, y: 195 to 255, z: -60 to 45 + Steep Pitched Roof to y=300
       Level 4 (Water Tower):   Scaffold & Cedar Tank perched on roof from y=290 to y=420!
    */

    const L1 = { x0: -92, x1: 92, y0: 0, y1: 110, z0: -80, z1: 65 };
    const L2 = { x0: -72, x1: 76, y0: 110, y1: 195, z0: -70, z1: 52 };
    const L3 = { x0: -56, x1: 60, y0: 195, y1: 255, z0: -58, z1: 42 };

    /* --------------------------- Level 1 Materials (Ground Cottage) --------------------------- */
    const matL1front = mat(L1.x1 - L1.x0, L1.y1 - L1.y0, (g, w, h) => {
      wallFill(g, w, h, { brick: true, brickX: 18, brickY: h - 34 });
      eaveShadow(g, w, h, 28);
      // Large arched bay window on the left
      windowUnit(g, 16, 24, 76, 68, { arch: 24, cols: 3, rows: 2, box: true });
      // Front cottage wooden door on the right
      doorUnit(g, 114, 26, 44, 82);
      // Scalloped striped awning over door
      awning(g, 136, 12, 68, PAL.tileDark);
      // Brass lantern next to door
      lantern(g, 100, 36, 0.95);
      baseShadow(g, w, h, 20);
    });

    const matL1side = mat(L1.z1 - L1.z0, L1.y1 - L1.y0, (g, w, h) => {
      wallFill(g, w, h, { brick: true, brickX: 20, brickY: h - 28 });
      eaveShadow(g, w, h, 24);
      // Side window
      windowUnit(g, 36, 30, 58, 56, { cols: 2, rows: 2, box: true });
      baseShadow(g, w, h, 20);
    });

    /* --------------------------- Level 2 Materials (Mid-Tower) --------------------------- */
    const matL2front = mat(L2.x1 - L2.x0, L2.y1 - L2.y0, (g, w, h) => {
      wallFill(g, w, h, { crossTimber: true, brick: false });
      eaveShadow(g, w, h, 26);
      // Twin cottage windows with flower planter boxes
      windowUnit(g, 18, 22, 50, 52, { cols: 2, rows: 2, box: true });
      windowUnit(g, 80, 22, 50, 52, { cols: 2, rows: 2, box: true });
      // Electric meter / conduit box
      fillRect(g, 62, 42, 12, 18, PAL.metalLight, 1.5);
      strokeRect(g, 62, 42, 12, 18, INK, 1, 1.5);
      baseShadow(g, w, h, 18);
    });

    const matL2side = mat(L2.z1 - L2.z0, L2.y1 - L2.y0, (g, w, h) => {
      wallFill(g, w, h, { crossTimber: true, brick: false });
      eaveShadow(g, w, h, 22);
      // Balcony door / window opening onto side cantilevered balcony
      windowUnit(g, 32, 18, 54, 60, { cols: 2, rows: 2 });
      baseShadow(g, w, h, 16);
    });

    /* --------------------------- Level 3 Materials (Attic / Gable) --------------------------- */
    const matL3front = mat(L3.x1 - L3.x0, L3.y1 - L3.y0, (g, w, h) => {
      wallFill(g, w, h, { crossTimber: true, brick: false });
      eaveShadow(g, w, h, 24);
      windowUnit(g, 34, 14, 48, 42, { cols: 2, rows: 2 });
      baseShadow(g, w, h, 14);
    });

    const matL3side = mat(L3.z1 - L3.z0, L3.y1 - L3.y0, (g, w, h) => {
      wallFill(g, w, h, { brick: false });
      eaveShadow(g, w, h, 20);
      // Round attic window
      ellipse(g, w / 2, 30, 16, 16, PAL.glassTop, INK2, 1.8);
      line(g, w / 2, 14, w / 2, 46, rgba(PAL.woodDark, 0.8), 2.2);
      line(g, w / 2 - 16, 30, w / 2 + 16, 30, rgba(PAL.woodDark, 0.8), 2.2);
      baseShadow(g, w, h, 14);
    });

    const matRoofTiles = mat(160, 120, roofTiles);
    const matRoofUnder = flatMat(PAL.tileUnder);
    const darkTop = flatMat("#3c2b22");

    // Add 3-tier building bodies
    body(L1.x0, L1.x1, L1.y0, L1.y1, L1.z0, L1.z1, matL1front, matL1side, darkTop);
    body(L2.x0, L2.x1, L2.y0, L2.y1, L2.z0, L2.z1, matL2front, matL2side, darkTop);
    body(L3.x0, L3.x1, L3.y0, L3.y1, L3.z0, L3.z1, matL3front, matL3side, darkTop);

    // Overhanging Roof Eaves between Level 1 and Level 2
    addPitchedGableRoof(L1.x0 - 4, L1.x1 + 4, L1.y1 - 2, L1.z0 - 4, L1.z1 + 4, 22, matRoofTiles, matRoofUnder);

    // Overhanging Roof Eaves between Level 2 and Level 3
    addPitchedGableRoof(L2.x0 - 3, L2.x1 + 3, L2.y1 - 2, L2.z0 - 3, L2.z1 + 3, 18, matRoofTiles, matRoofUnder);

    // Master Rooftop Pitched Gable Roof on Level 3 (Ghibli peak!)
    addPitchedGableRoof(L3.x0 - 6, L3.x1 + 6, L3.y1 - 2, L3.z0 - 6, L3.z1 + 6, 48, matRoofTiles, matRoofUnder);

    /* --------------------------------------------------- Ghibli Attic Dormer Window -- */
    const DORM_X = 2, DORM_Y = L3.y1 + 10, DORM_Z = L3.z1 + 10;
    const dormMat = mat(44, 38, (g, w, h) => {
      wallFill(g, w, h, { brick: false });
      windowUnit(g, 6, 3, 32, 32, { arch: 10, cols: 2, rows: 2, box: true });
    });
    addBox(42, 36, 28, [flatMat(PAL.wallS), flatMat(PAL.wallS), darkTop, flatMat("#251914"), dormMat, flatMat(PAL.wallS)],
      DORM_X, DORM_Y + 12, DORM_Z);
    addPitchedGableRoof(DORM_X - 23, DORM_X + 23, DORM_Y + 28, DORM_Z - 15, DORM_Z + 15, 14, matRoofTiles, matRoofUnder);

    /* --------------------------------------------------- Front Porch & Deck Setup -- */
    const porchW = 82, porchD = 38;
    const porchX = 38, porchZ = L1.z1 + porchD / 2;
    const matDeckTop = mat(porchW, porchD, deckPlanks);
    const matDeckWood = flatMat(PAL.woodDark);
    addBox(porchW, 10, porchD, [matDeckWood, matDeckWood, matDeckTop, matDeckWood, matDeckWood, matDeckWood],
      porchX, 5, porchZ);

    // Wooden Porch Railing & Posts
    const postMat = flatMat(PAL.wood);
    const railMat = flatMat(PAL.woodLight);
    for (let rx = porchX - porchW / 2 + 4; rx <= porchX + porchW / 2 - 4; rx += 24) {
      addBox(5, 28, 5, postMat, rx, 18, porchZ + porchD / 2 - 2);
    }
    addBox(porchW, 5, 6, railMat, porchX, 32, porchZ + porchD / 2 - 2);
    addBox(porchW, 4, 5, postMat, porchX, 22, porchZ + porchD / 2 - 2);

    // Tea table & teapot on porch deck
    addBox(16, 12, 16, railMat, porchX - 24, 11, porchZ);
    addBox(5, 4, 5, flatMat("#ffffff"), porchX - 24, 19, porchZ); // teacup
    addBox(8, 7, 7, flatMat("#2b3e4f"), porchX - 18, 20, porchZ - 2); // teapot

    /* --------------------------------------------------- Level 2 Cantilevered Balcony -- */
    const balcW = 34, balcD = 68;
    const balcX = L2.x0 - balcW / 2 + 2, balcZ = (L2.z0 + L2.z1) / 2;
    addBox(balcW, 8, balcD, [matDeckWood, matDeckWood, matDeckTop, matDeckWood, matDeckWood, matDeckWood],
      balcX, L2.y0 + 4, balcZ);
    // Wooden corbels / support struts underneath balcony
    addBox(4, 24, 12, postMat, balcX + 6, L2.y0 - 8, balcZ - 20);
    addBox(4, 24, 12, postMat, balcX + 6, L2.y0 - 8, balcZ + 20);
    // Balcony railing
    addBox(4, 24, balcD, postMat, balcX - balcW / 2 + 2, L2.y0 + 16, balcZ);
    addBox(5, 4, balcD, railMat, balcX - balcW / 2 + 2, L2.y0 + 28, balcZ);

    /* ------------------------------------------------------------ Chimney --- */
    // Brickwork Chimney climbing up the left wall
    const chimneyCv = canvas(64, 256, 2);
    const cg = chimneyCv.g;
    cg.fillStyle = PAL.brick;
    cg.fillRect(0, 0, 64, 256);
    for (let row = 0; row < 24; row++) {
      const y = row * 10;
      line(cg, 0, y, 64, y, "rgba(240,230,215,0.45)", 1.2);
      for (let c = 0; c < 4; c++) {
        const x = c * 16 + (row % 2 ? 8 : 0);
        line(cg, x, y, x, y + 10, "rgba(240,230,215,0.40)", 1);
        if (rnd() < 0.25) fillRect(cg, x + 1, y + 1, 14, 8, shade(PAL.brickDark, 0.85), 0);
      }
    }
    const chimneyMat = new THREE.MeshBasicMaterial({ map: texture(chimneyCv.c) });
    createdMaterials.push(chimneyMat);

    const CHIMNEY_X = -84, CHIMNEY_Z = -25;
    const chimneyGeo = new THREE.CylinderGeometry(9, 10, 290, 16);
    createdGeometries.push(chimneyGeo);
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(CHIMNEY_X, 145, CHIMNEY_Z);
    scene.add(chimney);

    const capMat = flatMat(PAL.tileDark);
    const capGeo = new THREE.CylinderGeometry(15, 12, 14, 16);
    createdGeometries.push(capGeo);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(CHIMNEY_X, 292, CHIMNEY_Z);
    scene.add(cap);

    const cap2Geo = new THREE.CylinderGeometry(17, 17, 5, 16);
    createdGeometries.push(cap2Geo);
    const cap2 = new THREE.Mesh(cap2Geo, flatMat(PAL.tileLight));
    cap2.position.set(CHIMNEY_X, 299, CHIMNEY_Z);
    scene.add(cap2);

    /* --------------------------------------------------------- Rooftop Water Tower --- */
    // The Crown of the Tower: Cedar Water Cistern on Scaffold Legs
    const TANK_X = 12, TANK_Z = -14;
    const TANK_BASE_Y = 285;
    const legMat = flatMat(PAL.woodDark);

    // 4 Heavy timber trestle legs
    const legW = 32, legD = 32;
    addBox(5, 68, 5, legMat, TANK_X - legW / 2, TANK_BASE_Y + 34, TANK_Z - legD / 2);
    addBox(5, 68, 5, legMat, TANK_X + legW / 2, TANK_BASE_Y + 34, TANK_Z - legD / 2);
    addBox(5, 68, 5, legMat, TANK_X - legW / 2, TANK_BASE_Y + 34, TANK_Z + legD / 2);
    addBox(5, 68, 5, legMat, TANK_X + legW / 2, TANK_BASE_Y + 34, TANK_Z + legD / 2);

    // Cross brace ties
    addBox(legW + 6, 3, 3, legMat, TANK_X, TANK_BASE_Y + 22, TANK_Z - legD / 2);
    addBox(legW + 6, 3, 3, legMat, TANK_X, TANK_BASE_Y + 22, TANK_Z + legD / 2);
    addBox(legW + 6, 3, 3, legMat, TANK_X, TANK_BASE_Y + 50, TANK_Z - legD / 2);
    addBox(legW + 6, 3, 3, legMat, TANK_X, TANK_BASE_Y + 50, TANK_Z + legD / 2);

    // Tank platform
    addBox(54, 6, 54, flatMat(PAL.woodDark), TANK_X, TANK_BASE_Y + 68, TANK_Z);

    // Cedar stave water tank
    const tankCv = canvas(256, 128, 2);
    const tg = tankCv.g;
    const tgrd = tg.createLinearGradient(0, 0, 256, 0);
    tgrd.addColorStop(0, PAL.tankLight);
    tgrd.addColorStop(0.35, PAL.tankWood);
    tgrd.addColorStop(0.8, shade(PAL.tankWood, 0.9));
    tgrd.addColorStop(1, PAL.tankDark);
    tg.fillStyle = tgrd;
    tg.fillRect(0, 0, 256, 128);
    // Vertical cedar plank lines
    for (let p = 0; p < 24; p++) {
      line(tg, p * 11, 0, p * 11, 128, "rgba(50,35,25,0.4)", 1.2);
    }
    // Dark iron hoops & rivets
    for (let i = 0; i < 3; i++) {
      const y = 24 + i * 36;
      line(tg, 0, y, 256, y, PAL.tankBand, 3.2);
      line(tg, 0, y + 2, 256, y + 2, "rgba(255,248,235,0.35)", 1.2);
      for (let r = 0; r < 18; r++) ellipse(tg, r * 14 + 6, y + 1, 1.4, 1.4, "#222");
    }
    const tankBody = new THREE.MeshBasicMaterial({ map: texture(tankCv.c) });
    createdMaterials.push(tankBody);

    const tankGeo = new THREE.CylinderGeometry(28, 28, 54, 24);
    createdGeometries.push(tankGeo);
    const tank = new THREE.Mesh(tankGeo, tankBody);
    tank.position.set(TANK_X, TANK_BASE_Y + 98, TANK_Z);
    scene.add(tank);

    // Conical Ghibli wooden tank roof
    const tankTopGeo = new THREE.ConeGeometry(32, 28, 24);
    createdGeometries.push(tankTopGeo);
    const tankTop = new THREE.Mesh(tankTopGeo, flatMat(PAL.tileDark));
    tankTop.position.set(TANK_X, TANK_BASE_Y + 138, TANK_Z);
    scene.add(tankTop);

    // Inspection ladder climbing up the side
    const ladderMat = flatMat(PAL.wood);
    addBox(2.5, 68, 2.5, ladderMat, TANK_X + 31, TANK_BASE_Y + 70, TANK_Z - 10);
    addBox(2.5, 68, 2.5, ladderMat, TANK_X + 31, TANK_BASE_Y + 70, TANK_Z + 10);
    for (let lr = 0; lr < 6; lr++) {
      addBox(2.5, 2, 20, ladderMat, TANK_X + 31, TANK_BASE_Y + 44 + lr * 12, TANK_Z);
    }

    /* ----------------------------------------------- Ghibli Brass Weathercock Vane --- */
    const vaneGroup = new THREE.Group();
    vaneGroup.position.set(TANK_X, TANK_BASE_Y + 152, TANK_Z);
    scene.add(vaneGroup);

    const mastGeo = new THREE.CylinderGeometry(1.4, 1.4, 34, 8);
    createdGeometries.push(mastGeo);
    vaneGroup.add(new THREE.Mesh(mastGeo, flatMat(PAL.brassDark)));

    const arrowGeo = new THREE.BoxGeometry(22, 3, 2);
    createdGeometries.push(arrowGeo);
    const vaneArrow = new THREE.Mesh(arrowGeo, flatMat(PAL.brassLight));
    vaneArrow.position.y = 15;
    vaneGroup.add(vaneArrow);

    /* ------------------------------------------------------- Laundry + Clothesline -- */
    const ROPE_A = new THREE.Vector3(balcX - balcW / 2 + 2, L2.y0 + 26, balcZ - 16);
    const ROPE_B = new THREE.Vector3(porchX - porchW / 2 + 6, 30, porchZ + porchD / 2 - 4);

    function ropeAt(t) {
      const x = ROPE_A.x + (ROPE_B.x - ROPE_A.x) * t;
      const y = ROPE_A.y + (ROPE_B.y - ROPE_A.y) * t - Math.sin(t * Math.PI) * 14;
      const z = ROPE_A.z + (ROPE_B.z - ROPE_A.z) * t;
      return new THREE.Vector3(x, y, z);
    }

    const ropeGeoPts = [];
    for (let ri = 0; ri <= 20; ri++) ropeGeoPts.push(ropeAt(ri / 20));
    const ropeCurve = new THREE.CatmullRomCurve3(ropeGeoPts);
    const ropeGeo = new THREE.TubeGeometry(ropeCurve, 20, 0.8, 5, false);
    createdGeometries.push(ropeGeo);
    scene.add(new THREE.Mesh(ropeGeo, flatMat("#4a3a30")));

    const CLOTHES = [
      { kind: "towel", color: "#c97a52", w: 32, h: 42, t: 0.16, sway: 0.06 },
      { kind: "shirt", color: "#8fa7c4", w: 34, h: 44, t: 0.36, sway: 0.055 },
      { kind: "stripes", color: "#f0ece2", w: 36, h: 46, t: 0.58, sway: 0.055 },
      { kind: "jeans", color: "#6f88a6", w: 30, h: 48, t: 0.80, sway: 0.045 }
    ];

    const clothMeshes = [];
    CLOTHES.forEach((cfg, i) => {
      const tex = texture(clothTexture(cfg.kind, cfg.color));
      const geo = new THREE.PlaneGeometry(cfg.w, cfg.h, 6, 8);
      createdGeometries.push(geo);
      geo.translate(0, -cfg.h / 2, 0);
      const material = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, side: THREE.DoubleSide, depthWrite: false
      });
      createdMaterials.push(material);
      const m = new THREE.Mesh(geo, material);
      const p = ropeAt(cfg.t);
      m.position.set(p.x, p.y, p.z + 2);
      scene.add(m);
      clothMeshes.push({
        mesh: m, base: geo.attributes.position.clone(), w: cfg.w, h: cfg.h,
        sway: cfg.sway, phase: i * 1.31, pos: m.position.clone()
      });
    });

    /* ------------------------------------------------------------- Ghibli Ivy & Flora -- */
    const ivyTextures = [
      texture(leafCluster(1, PAL.grassDark)),
      texture(leafCluster(2, PAL.grassTop)),
      texture(leafCluster(3, PAL.grassLight))
    ];

    const ivy = [];
    const ivyGeo = new THREE.PlaneGeometry(1, 1);
    createdGeometries.push(ivyGeo);

    function addIvy(x, y, z, size, rot) {
      let idx = (ivy.length * 7 + Math.round(x + y + z)) % ivyTextures.length;
      if (idx < 0) idx += ivyTextures.length;
      const tex = ivyTextures[idx];
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide
      });
      createdMaterials.push(mat);
      const m = new THREE.Mesh(ivyGeo, mat);
      m.scale.set(size, size, 1);
      m.position.set(x, y, z);
      m.rotation.z = rot;
      scene.add(m);
      ivy.push({ mesh: m, rot, phase: rr(0, 6.28), base: new THREE.Vector3(x, y, z) });
    }

    function ivyLine(x0, y0, x1, y1, z, count, size, spread) {
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        addIvy(
          x0 + (x1 - x0) * t + rr(-spread, spread),
          y0 + (y1 - y0) * t + rr(-spread, spread),
          z + rr(-1, 3),
          size * rr(0.75, 1.25),
          rr(-3.14, 3.14)
        );
      }
    }

    ivyLine(L1.x0 + 4, 100, L1.x0 + 4, 12, L1.z1 + 2, 7, 48, 6);
    ivyLine(L1.x0 + 20, 104, L1.x1 - 20, 104, L1.z1 + 2, 8, 42, 6);
    ivyLine(L2.x0 + 4, 185, L2.x0 + 4, 115, L2.z1 + 2, 6, 44, 5);
    ivyLine(L2.x1 - 4, 185, L2.x1 - 4, 115, L2.z1 + 2, 6, 44, 5);
    ivyLine(L1.x1 - 4, 100, L1.x1 - 4, 12, L1.z1 + 2, 6, 46, 6);

    /* -------------------------------------------------------------------- Cat -- */
    const CAT_X = porchX + 22, CAT_Y = 10, CAT_Z = porchZ + 8;
    const catMat = new THREE.MeshBasicMaterial({
      map: texture(catBody()), transparent: true, depthWrite: false
    });
    createdMaterials.push(catMat);
    const catMesh = new THREE.Mesh(ivyGeo, catMat);
    catMesh.scale.set(44, 52, 1);
    catMesh.position.set(CAT_X, CAT_Y + 26, CAT_Z);
    scene.add(catMesh);

    const tailPivot = new THREE.Group();
    tailPivot.position.set(CAT_X + 10, CAT_Y + 32, CAT_Z + 1);
    scene.add(tailPivot);

    const tailGeo = new THREE.PlaneGeometry(42, 48, 1, 1);
    createdGeometries.push(tailGeo);
    tailGeo.translate(13, 20, 0);
    const tailMat = new THREE.MeshBasicMaterial({
      map: texture(catTail()), transparent: true, depthWrite: false
    });
    createdMaterials.push(tailMat);
    const tailMesh = new THREE.Mesh(tailGeo, tailMat);
    tailPivot.add(tailMesh);

    /* ------------------------------------------------------------------ Smoke -- */
    const smokeTex = [texture(smokeSprite(1)), texture(smokeSprite(2)), texture(smokeSprite(3))];
    const smoke = [];
    for (let si = 0; si < 8; si++) {
      const smMat = new THREE.MeshBasicMaterial({
        map: smokeTex[si % 3], transparent: true, opacity: 0, depthWrite: false
      });
      createdMaterials.push(smMat);
      const sm = new THREE.Mesh(ivyGeo, smMat);
      sm.quaternion.copy(camera.quaternion);
      scene.add(sm);
      smoke.push({ mesh: sm, offset: si / 8, seed: rr(0, 6.28), spin: rr(-0.4, 0.4) });
    }

    /* ------------------------------------------------------------------ Birds -- */
    const birdTex = [texture(birdSprite(true)), texture(birdSprite(false))];
    const birds = [];
    for (let bi = 0; bi < 3; bi++) {
      const bMat = new THREE.MeshBasicMaterial({
        map: birdTex[0], transparent: true, depthWrite: false
      });
      createdMaterials.push(bMat);
      const bm = new THREE.Mesh(ivyGeo, bMat);
      const bs = 22 + bi * 3;
      bm.scale.set(bs, bs * 0.7, 1);
      bm.quaternion.copy(camera.quaternion);
      scene.add(bm);
      birds.push({ mesh: bm, a: rr(0, 6.28), rx: 80 + bi * 16, ry: 22 + bi * 6, sp: 0.35 + bi * 0.08, cy: 375 - bi * 20 });
    }

    /* --------------------------------------------- Floating Ghibli Petals / Pollen -- */
    const petals = [];
    const petalColors = ["#ffd5cc", "#ffe8b3", "#dcf4b8", "#ffffff"];
    for (let pi = 0; pi < 18; pi++) {
      const pColor = petalColors[pi % petalColors.length];
      const pMat = flatMat(pColor);
      pMat.transparent = true;
      pMat.opacity = 0.75;
      pMat.depthWrite = false;
      const pMesh = new THREE.Mesh(ivyGeo, pMat);
      const pSize = rr(4, 7);
      pMesh.scale.set(pSize, pSize * 0.6, 1);
      scene.add(pMesh);
      petals.push({
        mesh: pMesh,
        x: rr(-180, 180),
        y: rr(20, 360),
        z: rr(-120, 120),
        vx: rr(-0.4, -0.15),
        vy: rr(-0.35, -0.1),
        vz: rr(0.05, 0.25),
        rot: rr(0, 6.28),
        vrot: rr(-0.04, 0.04)
      });
    }

    /* ----------------------------------------------------------------- Lights & Glow -- */
    function glowSprite() {
      const s = 128, cv = canvas(s, s, 2), g = cv.g;
      const grd = g.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
      grd.addColorStop(0, "rgba(255,200,110,0.88)");
      grd.addColorStop(0.35, "rgba(255,170,80,0.48)");
      grd.addColorStop(0.72, "rgba(255,150,60,0.15)");
      grd.addColorStop(1, "rgba(255,140,50,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, s, s);
      return cv.c;
    }

    const glowTex = texture(glowSprite());
    const spills = [];

    function addSpill(x, y, z, w, h, base, phase, flick) {
      const material = new THREE.MeshBasicMaterial({
        map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0
      });
      createdMaterials.push(material);
      const m = new THREE.Mesh(ivyGeo, material);
      m.scale.set(w, h, 1);
      m.position.set(x, y, z);
      scene.add(m);
      spills.push({ mesh: m, base, phase, flick: !!flick });
    }

    // Windows & lanterns glow spills
    addSpill(-36, 56, L1.z1 + 6, 140, 130, 0.55, 0, false); // Level 1 big bay window
    addSpill(porchX, 26, porchZ, 100, 90, 0.45, 1.2, true); // Porch lantern
    addSpill(-28, 148, L2.z1 + 6, 95, 95, 0.45, 2.1, false); // Level 2 left window
    addSpill(34, 148, L2.z1 + 6, 95, 95, 0.45, 0.6, false); // Level 2 right window
    addSpill(DORM_X, DORM_Y + 12, DORM_Z + 14, 75, 75, 0.40, 1.7, false); // Dormer window

    /* ------------------------------------------------------------- Time of Day (TODS) -- */

    const TODS = {
      day: { tint: "#ffffff", spill: 0.20, glow: 0.35 },
      dusk: { tint: "#ffd8c4", spill: 0.75, glow: 0.80 }, // warm golden hour Ghibli sunset
      night: { tint: "#7a88b8", spill: 1.0, glow: 1.0 }  // deep magical starry night blue
    };
    for (const tk in TODS) TODS[tk].tintC = new THREE.Color(TODS[tk].tint);

    let currentTodName = resolvedTheme === "dark" ? "night" : "day";
    const tod = {
      tint: new THREE.Color(TODS[currentTodName].tint),
      spill: TODS[currentTodName].spill,
      glow: TODS[currentTodName].glow
    };

    const tintMats = [
      matL1front, matL1side, matL2front, matL2side, matL3front, matL3side,
      matRoofTiles, matDeckTop, islandTopMat, islandRimMat,
      chimneyMat, tankBody, catMat, tailMat, dormMat
    ];
    clothMeshes.forEach(c => tintMats.push(c.mesh.material));
    ivy.forEach(i => tintMats.push(i.mesh.material));
    birds.forEach(b => tintMats.push(b.mesh.material));
    smoke.forEach(s => tintMats.push(s.mesh.material));

    function setTod(name) {
      if (TODS[name]) currentTodName = name;
    }
    setTodRef.current = setTod;

    // Expose Three.js scene & renderer for threejs-devtools-mcp
    if (typeof window !== "undefined") {
      window.__THREE__ = THREE;
      window.__scene = scene;
      window.__camera = camera;
      window.__renderer = renderer;
      window.__diorama = {
        scene,
        camera,
        renderer,
        setTod,
        TODS,
      };
    }

    const handleKeyDown = (e) => {
      // Hotkey controls: 1 = day, 2 = dusk, 3 = night
      if (e.key === "1") setTod("day");
      else if (e.key === "2") setTod("dusk");
      else if (e.key === "3") setTod("night");
    };
    window.addEventListener("keydown", handleKeyDown);

    /* ------------------------------------------------------------------- Loop -- */

    const start = performance.now();
    function frameTime() {
      const t = (performance.now() - start) / 1000;
      return Math.floor(t * FPS) / FPS;
    }

    function update(t) {
      const gust = 0.65 + 0.35 * Math.sin(t * 0.45) + 0.12 * Math.sin(t * 1.7);

      // Smooth camera parallax easing
      curYaw += (targetYaw - curYaw) * 0.06;
      curPitch += (targetPitch - curPitch) * 0.06;
      updateCameraPos();

      // Sway laundry
      for (let i = 0; i < clothMeshes.length; i++) {
        const c = clothMeshes[i];
        const pos = c.mesh.geometry.attributes.position;
        const base = c.base;
        for (let v = 0; v < pos.count; v++) {
          const bx = base.getX(v), by = base.getY(v);
          const weight = Math.min(1, Math.abs(by) / c.h);
          const wob = Math.sin(t * 2.4 + bx * 0.12 + c.phase) * 0.55 +
                      Math.sin(t * 1.35 + by * 0.07 + c.phase * 1.7) * 0.4;
          pos.setX(v, bx + wob * weight * gust);
          pos.setY(v, by + Math.sin(t * 1.9 + bx * 0.08 + c.phase) * 0.35 * weight);
        }
        pos.needsUpdate = true;
        c.mesh.rotation.z = Math.sin(t * 1.15 + c.phase) * c.sway * gust;
        c.mesh.position.x = c.pos.x + Math.sin(t * 0.8 + c.phase) * 1.1;
        c.mesh.position.y = c.pos.y + Math.sin(t * 1.6 + c.phase * 2) * 0.6;
      }

      // Rustle ivy
      for (let k = 0; k < ivy.length; k++) {
        const it = ivy[k];
        it.mesh.rotation.z = it.rot + Math.sin(t * 1.5 + it.phase) * 0.02 * gust;
        it.mesh.position.x = it.base.x + Math.sin(t * 1.1 + it.phase * 1.6) * 0.8 * gust;
        it.mesh.position.y = it.base.y + Math.cos(t * 1.7 + it.phase) * 0.5 * gust;
      }

      // Drift smoke
      for (let s = 0; s < smoke.length; s++) {
        const p = smoke[s];
        const age = ((t * 0.10 + p.offset) % 1);
        const curl = Math.sin(age * 4.2 + p.seed) * (10 + age * 30);
        p.mesh.position.set(
          CHIMNEY_X - 10 - age * 80 + curl,
          305 + age * 180,
          CHIMNEY_Z - 4
        );
        const sc = 52 + 95 * age;
        p.mesh.scale.set(sc, sc, 1);
        // Soft sine envelope: zero at birth, peak at age 0.45, fading smoothly to zero at dispersal
        p.mesh.material.opacity = 0.82 * Math.sin(age * Math.PI) * (1 - age * 0.25);
        p.mesh.quaternion.copy(camera.quaternion);
        p.mesh.rotateZ(p.seed + age * p.spin);
      }

      // Swing cat tail & rotate weathercock
      tailPivot.rotation.z = 0.06 + Math.sin(t * 1.15) * 0.11 + Math.sin(t * 2.4) * 0.03;
      vaneArrow.rotation.y = Math.sin(t * 0.6) * 0.45 + 0.2;

      // Circle birds
      for (let b = 0; b < birds.length; b++) {
        const bd = birds[b];
        const ang = bd.a + t * bd.sp;
        bd.mesh.position.set(
          TANK_X + Math.cos(ang) * bd.rx,
          bd.cy + Math.sin(ang) * bd.ry,
          TANK_Z + 50
        );
        bd.mesh.material.map = birdTex[Math.floor(t * 8 + b) % 2];
        bd.mesh.quaternion.copy(camera.quaternion);
        bd.mesh.scale.x = (Math.cos(ang) < 0 ? -1 : 1) * Math.abs(bd.mesh.scale.x);
      }

      // Drift anime blossom/pollen petals
      for (let pi = 0; pi < petals.length; pi++) {
        const pt = petals[pi];
        pt.x += pt.vx * gust;
        pt.y += pt.vy;
        pt.z += pt.vz;
        pt.rot += pt.vrot;

        if (pt.y < -5 || pt.x < -200 || pt.z > 160) {
          pt.x = rr(-100, 180);
          pt.y = rr(280, 360);
          pt.z = rr(-140, 20);
        }
        pt.mesh.position.set(pt.x + Math.sin(t * 1.2 + pi) * 6, pt.y, pt.z);
        pt.mesh.quaternion.copy(camera.quaternion);
        pt.mesh.rotateZ(pt.rot);
      }

      // Smooth Time of Day lerp
      const target = TODS[currentTodName], k2 = 0.05;
      tod.spill += (target.spill - tod.spill) * k2;
      tod.glow += (target.glow - tod.glow) * k2;
      tod.tint.lerp(target.tintC, k2);

      for (let tm = 0; tm < tintMats.length; tm++) tintMats[tm].color.copy(tod.tint);

      const flick = 0.8 + 0.13 * Math.sin(t * 11) + 0.07 * Math.sin(t * 27 + 1.3);

      for (let sp = 0; sp < spills.length; sp++) {
        const sv = spills[sp];
        const pl = 0.5 + 0.5 * Math.sin(t * 1.05 + sv.phase);
        const f = sv.flick ? (0.82 + (flick - 0.78) * 0.9) : 1;
        sv.mesh.material.opacity = sv.base * tod.spill * (0.8 + pl * 0.24) * f;
      }
    }

    function tick() {
      update(frameTime());
      renderer.render(scene, camera);
      animId = requestAnimationFrame(tick);
    }

    const resizeObserver = new ResizeObserver(() => fit());
    resizeObserver.observe(container);
    window.addEventListener("resize", fit);

    fit();
    tick();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", fit);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();

      createdTextures.forEach(t => t.dispose());
      createdGeometries.forEach(g => g.dispose());
      createdMaterials.forEach(m => m.dispose());
      renderer.dispose();
      if (canvasElement.parentNode) {
        canvasElement.parentNode.removeChild(canvasElement);
      }

      if (typeof window !== "undefined" && window.__scene === scene) {
        delete window.__scene;
        delete window.__camera;
        delete window.__renderer;
        delete window.__diorama;
      }
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full relative ${className}`} />;
}
