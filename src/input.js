// Input wiring: buttons, keyboard, and the start/restart transition.

import { els } from './dom.js';
import { state } from './state.js';
import { newRound, start, doSmite } from './game.js';

// Hide the start screen and (re)launch a fresh round.
export function restart(){
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
    if(k === 'f' || k === ' '){ e.preventDefault(); if(state.running) doSmite(); }
    else if(k === 'r'){ e.preventDefault(); restart(); }
    else if(k === 'enter' && !els.startScreen.classList.contains('hide')){ e.preventDefault(); restart(); }
  });
}
