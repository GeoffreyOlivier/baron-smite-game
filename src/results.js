// Renders the end-of-round result overlay from an outcome + the HP snapshot.

import { els } from './dom.js';
import { fr } from './render.js';
import { SMITE_DMG, WINDOW } from './config.js';

const pvBig = (pv) => `<span class="pvbig">${pv} <small>PV</small></span>`;

export function showResult(outcome, snap){
  els.result.classList.add('show');
  els.grade.className = 'grade';
  const pv = fr(snap);

  switch(outcome.type){
    case 'steal':
      els.grade.classList.add('steal');
      els.grade.textContent = 'STOLEN ! 💀';
      els.desc.textContent = "Trop tard — le Baron est mort avant ton Smite. Ton jungler adverse jubile.";
      break;

    case 'lowsteal':
      els.grade.classList.add('steal');
      els.grade.textContent = 'STOLEN ! 💀';
      els.desc.innerHTML = `Smite à ${pvBig(pv)}en dessous de ${WINDOW.lo}, trop bas. L'ennemi te l'a volé.`;
      break;

    case 'early':
      els.grade.classList.add('early');
      els.grade.textContent = 'TROP TÔT ⏱';
      els.desc.innerHTML = `Smite à ${pvBig(pv)}le Smite (${SMITE_DMG}) ne l'a pas tué (il en restait ${fr(snap - SMITE_DMG)}). Volé.`;
      break;

    default: // win
      els.grade.classList.add('win');
      els.grade.textContent = outcome.label;
      els.desc.innerHTML = `${outcome.note}<span class="pvbig">Smite à ${pv} <small>PV</small></span>à ${fr(SMITE_DMG - snap)} des ${SMITE_DMG}.`;
  }
}
