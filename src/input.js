// Input wiring: buttons, keyboard, and the start/restart transition.

import { els } from './dom.js';
import { state } from './state.js';
import { newRound, start, doSmite } from './game.js';
import { setPseudo } from './leaderboard.js';

// Hide the start screen and (re)launch a fresh round.
export function restart(){
  if(els.pseudo.value.trim()) setPseudo(els.pseudo.value);
  els.startScreen.classList.add('hide');
  newRound();
  start();
}

export function wireInput(){
  els.smiteBtn.addEventListener('click', doSmite);
  els.again.addEventListener('click', restart);
  els.startBtn.addEventListener('click', restart);

  window.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

    // Enter (from the pseudo field or the start screen) launches the game
    if(k === 'enter' && !els.startScreen.classList.contains('hide')){ e.preventDefault(); restart(); return; }

    // While typing in a field, never hijack keys (so "jeff", spaces, "r"… work)
    if(typing) return;

    if(k === 'f' || k === ' '){ e.preventDefault(); if(state.running) doSmite(); }
    else if(k === 'r'){ e.preventDefault(); restart(); }
  });
}
