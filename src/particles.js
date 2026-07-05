// Ambient floating "void" particles behind the stage.

import { els } from './dom.js';

export function buildParticles(count = 24){
  for(let i = 0; i < count; i++){
    const s = document.createElement('span');
    s.style.left = (i * 4.3) + '%';
    s.style.animationDuration = (6 + (i % 7)) + 's';
    s.style.animationDelay = (-(i % 9)) + 's';
    s.style.opacity = (0.2 + (i % 5) / 10);
    els.particles.appendChild(s);
  }
}
