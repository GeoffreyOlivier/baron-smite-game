// Entry point: assemble the modules and boot the game.

import { els } from './dom.js';
import { state } from './state.js';
import { buildParticles } from './particles.js';
import { initDragon } from './dragon.js';
import { loadBaron } from './baron.js';
import { newRound } from './game.js';
import { wireInput } from './input.js';
import { setPhase } from './render.js';

// The SVG Baron is active until the real render loads and swaps itself in.
state.baron = els.baronSvg;

buildParticles();
initDragon();   // Smite icon + team (async, optional)
loadBaron();    // real Baron render (async, optional)
wireInput();

// Show the start screen with a full HP bar, but don't drain until "Commencer".
newRound();
state.running = false;
cancelAnimationFrame(state.raf);
setPhase('Éveil…');
