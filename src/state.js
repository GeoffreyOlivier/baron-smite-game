// Mutable game state — a single shared object imported by the modules that
// read and mutate it. Kept deliberately flat and dependency-free.

export const state = {
  // round
  maxHp: 0,
  hp: 0,
  running: false,

  // engine
  raf: 0,
  loopGen: 0,      // bumped each start() so stale rAF loops die (no HP desync)
  nextHitAt: 0,

  // meta
  streak: 0,
  best: null,

  // DOM handles that can change at runtime
  baron: null,     // active Baron element (SVG until the real render loads)
  champs: [],      // team champion <div>s from Data Dragon
};
