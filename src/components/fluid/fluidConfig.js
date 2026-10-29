export const FLUID_CONFIG = {
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
  camDist: 3.0,
  dispFactor: 0.85,
  normalStrength: 1.5,
  pool: 0.44,
  ambient: 0.35,
  idleTimeoutMs: 0,
  maxSimResolution: 512,
};

export const THEME_PALETTES = {
  day: {
    tint: [0.992, 0.984, 0.969], // #FDFBF7 (sun-cream)
    sky: [0.22, 0.74, 0.97], // #38BDF8 (sun-cerulean)
    terracotta: [0.85, 0.47, 0.02], // #D97706 (terracotta)
    etaR: 1.0 / 1.35,
    etaB: 1.0 / 1.45,
  },
  night: {
    tint: [0.071, 0.063, 0.094], // #121018 (dusk-indigo)
    amber: [0.96, 0.62, 0.04], // #F59E0B (dusk-amber)
    violet: [0.35, 0.25, 0.55], // dusk violet
    etaR: 1.0 / 1.3,
    etaB: 1.0 / 1.7,
  },
};

