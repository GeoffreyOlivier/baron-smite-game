// Pure Smite judgement — given the Baron's HP at the moment of Smite, returns
// the outcome. No DOM, no state: easy to reason about and test.

import { SMITE_DMG, WINDOW, GRADES } from './config.js';

// -> { type: 'early' }
//    { type: 'lowsteal' }
//    { type: 'win', score, label, note }
export function judgeSmite(snap){
  if(snap > SMITE_DMG) return { type: 'early' };
  if(snap < WINDOW.lo)  return { type: 'lowsteal' };

  const span = SMITE_DMG - WINDOW.lo;                 // 200
  const score = Math.round((snap - WINDOW.lo) / span * 100); // 1200 -> 100, 1000 -> 0
  const grade = GRADES.find((g) => snap >= g.min);
  return { type: 'win', score, label: grade.label, note: grade.note };
}
