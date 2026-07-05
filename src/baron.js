// Loads the real Baron Nashor render (official LoL wiki) and swaps it in for
// the SVG drawing. Tries each source in order; if all fail (offline), the SVG
// stays. Note: SVG elements have no `.hidden` IDL property, so the SVG is
// hidden via style.display.

import { els } from './dom.js';
import { state } from './state.js';
import { BARON_SOURCES } from './config.js';

export function loadBaron(sources = BARON_SOURCES){
  if(!sources.length) return;
  const [src, ...rest] = sources;
  const im = new Image();
  im.onload = () => {
    els.baronImg.src = src;
    els.baronImg.hidden = false;
    els.baronSvg.style.display = 'none';
    state.baron = els.baronImg; // hit/dead animations now target the real render
  };
  im.onerror = () => loadBaron(rest);
  im.src = src;
}
