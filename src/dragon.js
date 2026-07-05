// Riot Data Dragon integration (static CDN, no API key required).
// Pulls the real Smite icon + a random attacking "team" of champions.
// Fully optional: if offline/blocked, the game keeps the 🔥 emoji and no team.

import { els } from './dom.js';
import { state } from './state.js';
import { DDRAGON, TEAM_SIZE } from './config.js';

async function json(url){ return (await fetch(url)).json(); }

export async function initDragon(){
  try{
    const versions = await json(`${DDRAGON}/api/versions.json`);
    const v = versions[0]; // latest patch

    // real Smite summoner-spell icon on the button
    const icon = new Image();
    icon.onload = () => {
      els.smiteIcon.src = icon.src;
      els.smiteIcon.hidden = false;
      els.smiteEmoji.hidden = true;
    };
    icon.src = `${DDRAGON}/cdn/${v}/img/spell/SummonerSmite.png`;

    // TEAM_SIZE random champions attacking the Baron
    const data = (await json(`${DDRAGON}/cdn/${v}/data/en_US/champion.json`)).data;
    const ids = Object.keys(data);
    const picks = [];
    while(picks.length < TEAM_SIZE && ids.length){
      picks.push(ids.splice(Math.floor(Math.random() * ids.length), 1)[0]);
    }

    els.team.innerHTML = '';
    state.champs = picks.map((id) => {
      const div = document.createElement('div');
      div.className = 'champ';
      div.title = data[id].name;
      const img = new Image();
      img.src = `${DDRAGON}/cdn/${v}/img/champion/${id}.png`;
      img.alt = data[id].name;
      div.appendChild(img);
      els.team.appendChild(div);
      return div;
    });
  }catch(e){
    state.champs = []; // offline / blocked — graceful no-op
  }
}

// Flash a random team member "attacking" when the Baron takes a hit.
export function teamHit(){
  const { champs } = state;
  if(!champs.length) return;
  const c = champs[Math.floor(Math.random() * champs.length)];
  c.classList.remove('attacking'); void c.offsetWidth; c.classList.add('attacking');
  setTimeout(() => c.classList.remove('attacking'), 120);
}
