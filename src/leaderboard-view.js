// Leaderboard view: renders the board and orchestrates submit-then-refresh.

import { els } from './dom.js';
import { lbConfigured, fetchTop, submitScore, getPseudo } from './leaderboard.js';
import { SMITE_DMG, WINDOW } from './config.js';

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

// The stored score (0-100) maps linearly to the Baron's HP at Smite.
// Show that HP instead — e.g. score 95 -> 1390 PV. Ranking order is unchanged.
const scoreToPv = (score) => WINDOW.lo + Math.round(score * (SMITE_DMG - WINDOW.lo) / 100);

function render(rows){
  if(!lbConfigured()){ els.leaderboard.hidden = true; return; }
  els.leaderboard.hidden = false;

  if(!rows.length){
    els.lbList.innerHTML = '<div class="lb-empty">Sois le premier à marquer un score !</div>';
    return;
  }
  const me = getPseudo();
  els.lbList.innerHTML = rows.map((r) => {
    const mine = r.pseudo === me ? ' class="me"' : '';
    return `<li${mine}><span class="lb-name">${escapeHtml(r.pseudo)}</span>` +
           `<span class="lb-score">${scoreToPv(r.score)} <small>PV</small></span></li>`;
  }).join('');
}

export async function refreshLeaderboard(){
  if(!lbConfigured()){ els.leaderboard.hidden = true; return; }
  render(await fetchTop());
}

// Called when the player secures the Baron: submit the run, then refresh.
export async function reportWin(score){
  const pseudo = getPseudo();
  if(pseudo) await submitScore(pseudo, score);
  await refreshLeaderboard();
}
