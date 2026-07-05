// Core game: round lifecycle + damage engine + Smite resolution.

import { state } from './state.js';
import { els } from './dom.js';
import { SMITE_DMG, HP, GRACE_MS, DAMAGE, CADENCE } from './config.js';
import { render, setPhase, setScores } from './render.js';
import { teamHit } from './dragon.js';
import { judgeSmite } from './scoring.js';
import { showResult } from './results.js';
import { reportWin } from './leaderboard-view.js';

function scheduleHit(delay){ state.nextHitAt = performance.now() + delay; }

// ---- round lifecycle ----

export function newRound(){
  state.running = true;
  state.maxHp = HP.min + Math.floor(Math.random() * HP.spread);
  state.hp = state.maxHp;
  render();
  els.hpSmite.classList.remove('show');   // clear any leftover Smite chunk
  els.result.classList.remove('show');
  els.smiteBtn.disabled = false;
  state.baron.classList.remove('dead');
  setPhase('En combat');
  scheduleHit(GRACE_MS);
}

// ---- damage engine ----
// One auto-attack. Constant average rate (linear drain) — only the hit size
// varies; the fixed cap keeps a single auto from leaping over the Smite window.
function tick(ts){
  if(ts < state.nextHitAt) return;

  let dmg = DAMAGE.base + Math.random() * DAMAGE.baseSpread;
  if(Math.random() < DAMAGE.critChance) dmg += DAMAGE.critBase + Math.random() * DAMAGE.critSpread;
  dmg = Math.min(dmg, DAMAGE.cap);
  state.hp -= dmg;

  const b = state.baron;
  b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
  teamHit();
  render();

  if(state.hp <= 0){ steal(); return; }
  scheduleHit(CADENCE.min + Math.random() * CADENCE.spread);
}

export function start(){
  const myGen = ++state.loopGen;      // invalidate any older loop chain
  cancelAnimationFrame(state.raf);
  scheduleHit(GRACE_MS);
  const step = (ts) => {
    if(!state.running || myGen !== state.loopGen) return; // stale/stopped -> die quietly
    tick(ts);
    if(state.running && myGen === state.loopGen) state.raf = requestAnimationFrame(step);
  };
  state.raf = requestAnimationFrame(step);
}

// ---- resolution ----

function stopLoop(){
  state.running = false;
  cancelAnimationFrame(state.raf);
  els.smiteBtn.disabled = true;
}

function endRound(outcome, snap){
  setPhase('Terminé');
  if(outcome.type === 'win'){
    state.streak++;
    if(state.best === null || outcome.score > state.best) state.best = outcome.score;
    reportWin(outcome.score); // submit to the global leaderboard + refresh
  }else{
    state.streak = 0;
  }
  showResult(outcome, snap);
  setScores();
}

// Restart a CSS animation by toggling its class (re-triggers on each cast).
function replay(el, cls){
  if(!el) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
}

// Show the slice of HP that Smite is about to remove (up to 1400) in yellow,
// pinned to the right end of the current fill.
function showSmiteChunk(snap){
  const rightPct = Math.min(100, snap / state.maxHp * 100);
  const leftPct = Math.max(0, (snap - SMITE_DMG) / state.maxHp * 100);
  els.hpSmite.style.left = leftPct + '%';
  els.hpSmite.style.width = (rightPct - leftPct) + '%';
  els.hpSmite.classList.add('show');
}
function hideSmiteChunk(){ els.hpSmite.classList.remove('show'); }

const SMITE_DELAY = 480; // ms the yellow chunk stays before it's chunked off

export function doSmite(){
  if(!state.running) return;
  stopLoop();
  replay(els.flash, 'go');                 // light white flash

  const snap = state.hp;
  const outcome = judgeSmite(snap);
  const newHp = outcome.type === 'early' ? snap - SMITE_DMG : 0;
  const gen = state.loopGen;

  // 1) highlight the 1400 PV about to be removed, in yellow (bar stays at snap)
  showSmiteChunk(snap);

  // 2) after a beat, chunk it off: the bar drops and the result is revealed
  setTimeout(() => {
    if(gen !== state.loopGen) return;      // a new round started — abort
    hideSmiteChunk();
    state.hp = newHp;
    render();
    if(outcome.type !== 'early') state.baron.classList.add('dead');
    endRound(outcome, snap);
  }, SMITE_DELAY);
}

// Baron died to the team before the player Smited.
function steal(){
  stopLoop();
  state.hp = 0; render();
  state.baron.classList.add('dead');
  endRound({ type: 'steal' }, 0);
}
