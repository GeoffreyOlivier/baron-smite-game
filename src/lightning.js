// Procedural lightning bolt on a <canvas> — a jagged, branching, flickering
// electric strike (not a static shape). Drawn straight down onto the Baron.

const reduceMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// A jagged line from (x0,y0) to (x1,y1): interpolate along Y, jitter X.
function makeBolt(x0, y0, x1, y1, segments, jitter){
  const pts = [];
  for(let i = 0; i <= segments; i++){
    const t = i / segments;
    const edge = i === 0 || i === segments;
    const x = x0 + (x1 - x0) * t + (edge ? 0 : (Math.random() - 0.5) * jitter);
    const y = y0 + (y1 - y0) * t;
    pts.push([x, y]);
  }
  return pts;
}

// A couple of shorter offshoots branching off the main bolt.
function makeBranches(bolt, W){
  const out = [];
  const n = 1 + Math.floor(Math.random() * 2);
  for(let k = 0; k < n; k++){
    const i = 2 + Math.floor(Math.random() * (bolt.length - 4));
    const [sx, sy] = bolt[i];
    const dir = Math.random() < 0.5 ? -1 : 1;
    const ex = sx + dir * W * (0.14 + Math.random() * 0.14);
    const ey = sy + W * (0.10 + Math.random() * 0.12);
    out.push(makeBolt(sx, sy, ex, ey, 5, W * 0.10));
  }
  return out;
}

function stroke(ctx, pts, width, color, blur){
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for(let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function strike(canvas){
  if(!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const W = rect.width, H = rect.height;
  if(!W || !H) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const targetX = W * 0.5;
  const targetY = H * 0.62;             // roughly the Baron's body
  const topX = W * (0.5 + (Math.random() - 0.5) * 0.12);

  // Reduced motion: one static soft frame, no flicker loop.
  if(reduceMotion()){
    const bolt = makeBolt(topX, 0, targetX, targetY, 12, W * 0.22);
    stroke(ctx, bolt, 6, 'rgba(255,210,40,0.5)', 16);
    stroke(ctx, bolt, 2, '#fffbe6', 6);
    setTimeout(() => ctx.clearRect(0, 0, W, H), 140);
    return;
  }

  let bolt = makeBolt(topX, 0, targetX, targetY, 13, W * 0.26);
  let branches = makeBranches(bolt, W);
  const t0 = performance.now();
  const DUR = 360;

  function frame(now){
    const p = (now - t0) / DUR;
    ctx.clearRect(0, 0, W, H);
    if(p >= 1) return;

    // buzz: occasionally regenerate the jag so the bolt writhes
    if(Math.random() < 0.4){
      bolt = makeBolt(topX, 0, targetX, targetY, 13, W * 0.26);
      branches = makeBranches(bolt, W);
    }
    // flicker: bright bursts early, fade out at the end
    const flick = p < 0.55 ? (0.55 + Math.random() * 0.45) : (1 - p) / 0.45;
    ctx.globalAlpha = Math.max(0, Math.min(1, flick));

    stroke(ctx, bolt, 7, 'rgba(255,205,35,0.55)', 20);            // outer glow
    branches.forEach((b) => stroke(ctx, b, 4, 'rgba(255,205,35,0.4)', 14));
    stroke(ctx, bolt, 2.3, '#fffbe6', 9);                         // bright core
    branches.forEach((b) => stroke(ctx, b, 1.4, '#fffbe6', 6));

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
