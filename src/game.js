// Core game: round lifecycle + damage engine + Smite resolution.

import { state } from './state.js';
import { els } from './dom.js';
import { SMITE_DMG, HP, GRACE_MS, DAMAGE, CADENCE } from './config.js';
import { render, setPhase, setScores } from './render.js';
import { teamHit } from './dragon.js';
import { judgeSmite } from './scoring.js';
import { showResult } from './results.js';
import { reportWin } from './leaderboard-view.js';
import { strike } from './lightning.js';

function scheduleHit(delay){ state.nextHitAt = performance.now() + delay; }

// ---- round lifecycle ----

export function newRound(){
  state.running = true;
  state.maxHp = HP.min + Math.floor(Math.random() * HP.spread);
  state.hp = state.maxHp;
  render();
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

// The Smite cast: a procedural lightning bolt strikes the Baron + a light flash.
function playSmiteFx(){
  strike(els.smiteCanvas);
  replay(els.flash, 'go');
}

export function doSmite(){
  if(!state.running) return;
  stopLoop();
  playSmiteFx();                          // lightning + flash on every Smite cast

  const snap = state.hp;
  const outcome = judgeSmite(snap);

  if(outcome.type === 'early'){
    state.hp = snap - SMITE_DMG;          // Smite chunk, but the Baron survives
    render();
  }else if(outcome.type === 'lowsteal'){
    state.hp = 0; render();
    state.baron.classList.add('dead');
  }else{                                  // win
    state.baron.classList.add('dead');
    state.hp = 0; render();
  }
  endRound(outcome, snap);
}

// Baron died to the team before the player Smited.
function steal(){
  stopLoop();
  state.hp = 0; render();
  state.baron.classList.add('dead');
  endRound({ type: 'steal' }, 0);
}
