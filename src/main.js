// Entry point: assemble the modules and boot the game.

import { els } from './dom.js';
import { state } from './state.js';
import { buildParticles } from './particles.js';
import { initDragon } from './dragon.js';
import { loadBaron } from './baron.js';
import { newRound } from './game.js';
import { wireInput } from './input.js';
import { setPhase } from './render.js';
import { getPseudo } from './leaderboard.js';
import { refreshLeaderboard } from './leaderboard-view.js';
import { SMITE_DMG } from './config.js';

// The SVG Baron is active until the real render loads and swaps itself in.
state.baron = els.baronSvg;
els.smiteDmg.textContent = SMITE_DMG; // damage number on the Smite icon

buildParticles();
initDragon();          // Smite icon + team (async, optional)
loadBaron();           // real Baron render (async, optional)
wireInput();

els.pseudo.value = getPseudo(); // restore saved pseudo
refreshLeaderboard();           // load the global board (hidden if not configured)

// Show the start screen with a full HP bar, but don't drain until "Commencer".
newRound();
state.running = false;
cancelAnimationFrame(state.raf);
setPhase('Éveil…');
