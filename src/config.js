// Game constants and tuning — the single place to balance the game.

export const SMITE_DMG = 1200;              // Smite's flat true damage

// Smite window: secure between WINDOW.lo and WINDOW.hi (closest to hi = best)
export const WINDOW = { lo: 1000, hi: SMITE_DMG };

// Baron starting HP: random in [min, min + spread] so timing can't be memorised
export const HP = { min: 12500, spread: 4000 };

export const GRACE_MS = 400;                // pause before the fight starts

// Per-auto damage. Constant average rate (linear drain); only the hit SIZE
// varies (the "à-coups"). `cap` is position-independent so the rate stays
// linear AND a single auto can never leap over the Smite window.
export const DAMAGE = {
  base: 90, baseSpread: 100,                // ~90-190 per auto
  critChance: 0.15, critBase: 40, critSpread: 70,
  cap: 200,
};

// Delay between autos (varied attack speeds): ~75-130ms
export const CADENCE = { min: 75, spread: 55 };

// Grade thresholds (HP at Smite) for a secured Baron
export const GRADES = [
  { min: 1180, label: 'JACKPOT !! 🏆', note: 'Pile sur les 1200. Steal de légende.' },
  { min: 1125, label: 'PERFECT ⭐',    note: 'Timing de challenger.' },
  { min: 1050, label: 'GOOD ✅',       note: 'Propre, bien sécurisé.' },
  { min: 0,    label: 'BOF 😬',        note: "Ça passe… mais t'étais à deux doigts du steal." },
];

// ---- Riot assets ----
export const DDRAGON = 'https://ddragon.leagueoflegends.com'; // static CDN, no API key
export const TEAM_SIZE = 5;
// Real Baron Nashor render (official LoL wiki), with a lighter fallback
export const BARON_SOURCES = [
  'https://wiki.leagueoflegends.com/en-us/images/Hunting_Baron_Nashor_Render.png',
  'https://wiki.leagueoflegends.com/en-us/images/Baron_NashorSquare.png',
];
