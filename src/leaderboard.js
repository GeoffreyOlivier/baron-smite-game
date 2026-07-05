// Global leaderboard data layer — talks to Supabase (PostgREST) directly from
// the browser with the public anon key. No dependency, no build. Every call is
// a graceful no-op when Supabase isn't configured or the network is down.

import { SUPABASE, LEADERBOARD } from './config.js';

const PSEUDO_KEY = 'baron-smite:pseudo';

export const lbConfigured = () => Boolean(SUPABASE.url && SUPABASE.anonKey);

const endpoint = () => `${SUPABASE.url}/rest/v1/scores`;
const headers = () => ({
  apikey: SUPABASE.anonKey,
  Authorization: `Bearer ${SUPABASE.anonKey}`,
  'Content-Type': 'application/json',
});

// ---- pseudo (localStorage, no account) ----
export function getPseudo(){
  try{ return (localStorage.getItem(PSEUDO_KEY) || '').slice(0, 20); }
  catch{ return ''; }
}
export function setPseudo(p){
  const clean = (p || '').trim().slice(0, 20);
  try{ localStorage.setItem(PSEUDO_KEY, clean); }catch{ /* ignore */ }
  return clean;
}

// ---- scores ----
export async function submitScore(pseudo, score){
  if(!lbConfigured() || !pseudo) return;
  try{
    await fetch(endpoint(), {
      method: 'POST',
      headers: { ...headers(), Prefer: 'return=minimal' },
      body: JSON.stringify({ pseudo: pseudo.slice(0, 20), score }),
    });
  }catch{ /* offline / blocked — ignore */ }
}

// Returns the best score per pseudo, highest first (top N).
export async function fetchTop(){
  if(!lbConfigured()) return [];
  try{
    const url = `${endpoint()}?select=pseudo,score&order=score.desc&limit=${LEADERBOARD.fetchLimit}`;
    const rows = await (await fetch(url, { headers: headers() })).json();
    if(!Array.isArray(rows)) return [];
    const best = new Map();
    for(const r of rows){
      const cur = best.get(r.pseudo);
      if(cur === undefined || r.score > cur) best.set(r.pseudo, r.score);
    }
    return [...best.entries()]
      .map(([pseudo, score]) => ({ pseudo, score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, LEADERBOARD.top);
  }catch{ return []; }
}
