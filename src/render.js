// Rendering of the live game state to the DOM (health bar, phase, scores).

import { els } from './dom.js';
import { state } from './state.js';

export const fr = (n) => Math.round(n).toLocaleString('fr-FR');

export function render(){
  const pct = Math.max(0, state.hp / state.maxHp * 100);
  els.hpfill.style.width = pct + '%';
  els.hpnum.textContent = fr(Math.max(0, state.hp));
}

export function setPhase(text){
  els.phase.textContent = text;
}

export function setScores(){
  els.best.textContent = state.best === null ? '—' : state.best;
  els.streak.textContent = state.streak;
}
