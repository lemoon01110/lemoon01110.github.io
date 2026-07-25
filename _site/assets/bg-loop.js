/* ─────────────────────────────────────────────────────────────
   Scroll morph — shooting stars ease into drifting graph nodes.
   Stable anchors + velocity clamp so depth-wraps don't glitch.
   ───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const TEAL = "95, 184, 173";
  const INDIGO = "124, 156, 255";
  const COLORS = [TEAL, INDIGO];
  const COUNT = 64;
  const LINK_DIST = 145;
  const MAX_STEP = 28; // px/frame — kills teleport glitches

  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0",
    width: "100vw", height: "100vh", zIndex: "1", pointerEvents: "none",
    opacity: "1"
  });
  document.body.prepend(canvas);

  const netStub = document.createElement("canvas");
  netStub.id = "network-canvas";
  Object.assign(netStub.style, {
    position: "fixed", inset: "0", zIndex: "1", pointerEvents: "none", opacity: "0"
  });
  document.body.prepend(netStub);

  const ctx = canvas.getContext("2d");

  let width, height, cx, cy, dpr;
  let particles = [];
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  let scrollMix = 0;
  let t0 = performance.now();
  let lastNow = t0;

  const reduced =
    (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) ||
    window.__STILL__;

  function hash(i, salt) {
    const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  function sampleNodeHome(i) {
    for (let t = 0; t < 14; t++) {
      const x = hash(i, 10 + t) * width;
      const y = hash(i, 20 + t) * height;
      if (Math.hypot((x - cx) / (width * 0.5), (y - cy) / (height * 0.5)) > 0.34) {
        return { x, y };
      }
    }
    const ang = hash(i, 30) * Math.PI * 2;
    const rr = 0.42 + hash(i, 31) * 0.5;
    return {
      x: cx + Math.cos(ang) * rr * width * 0.5,
      y: cy + Math.sin(ang) * rr * height * 0.5
    };
  }

  function build() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      const ang = hash(i, 1) * Math.PI * 2;
      const r = 0.16 + hash(i, 2) * 0.72;
      const home = sampleNodeHome(i);
      particles.push({
        ax: Math.cos(ang) * r,
        ay: Math.sin(ang) * r * 0.78,
        z0: hash(i, 3),
        // z cycles per second — one continuous phase (no double-modulo)
        zRate: 0.055 + hash(i, 6) * 0.05,
        homeX: home.x,
        homeY: home.y,
        ampX: 18 + hash(i, 40) * 28,
        ampY: 16 + hash(i, 41) * 26,
        phase: hash(i, 42) * Math.PI * 2,
        phase2: hash(i, 43) * Math.PI * 2,
        omega: 0.22 + hash(i, 46) * 0.35,
        omega2: 0.18 + hash(i, 47) * 0.32,
        radius: 1.15 + hash(i, 44) * 1.5,
        color: COLORS[(hash(i, 45) * COLORS.length) | 0],
        x: home.x,
        y: home.y,
        stableX: home.x,
        stableY: home.y,
        prevZ: hash(i, 3),
        ready: false
      });
    }
  }

  function readScrollMix() {
    const max = Math.max(1, document.documentElement.scrollHeight - height);
    const t = Math.min(1, Math.max(0, window.scrollY / max));
    return Math.min(1, Math.pow(t, 0.7));
  }

  function focal() {
    return Math.min(width, 1200) * 0.55;
  }

  function textMask(sx, sy) {
    const colW = Math.min(520, width * 0.42);
    const dx = Math.abs(sx - cx) / (colW * 0.5);
    const dy = Math.abs(sy - cy) / (height * 0.42);
    const edge = Math.max(dx, dy * 0.85);
    let keep = 0.55 + 0.45 * Math.min(1, Math.pow(Math.max(0, edge - 0.25) / 0.75, 1));
    const cd = Math.hypot((sx - cx) / (width * 0.5), (sy - cy) / (height * 0.5));
    if (cd < 0.1) keep *= Math.pow(Math.max(0.35, cd / 0.1), 1.2);
    return keep;
  }

  function ease(m) {
    return m * m * (3 - 2 * m);
  }

  function starSample(p, now, lookX, lookY) {
    // One continuous phase in [0,1)
    let z = p.z0 - ((now - t0) / 1000) * p.zRate;
    z -= Math.floor(z);
    const wrapped = p.prevZ - z > 0.5; // phase crossed 0
    p.prevZ = z;
    z = 0.1 + z * 0.88;

    const inv = 1 / z;
    const f = focal();
    const x = cx + p.ax * inv * f + lookX * (1 - z);
    const y = cy + p.ay * inv * f + lookY * (1 - z);
    const on =
      x > -40 && x < width + 40 && y > -40 && y < height + 40;

    // Keep a stable morph origin — ignore wrap teleports & offscreen flashes
    if (!wrapped && on) {
      p.stableX = x;
      p.stableY = y;
      p.ready = true;
    }

    return { x, y, z, depth: 1 - z, on, wrapped };
  }

  function nodeSample(p, now, mix) {
    const t = (now - t0) / 1000;
    // Drift grows as we become nodes — quiet while still stars
    const amp = 0.15 + 0.85 * mix;
    return {
      x: p.homeX + Math.sin(t * p.omega + p.phase) * p.ampX * amp + mx * 12,
      y: p.homeY + Math.cos(t * p.omega2 + p.phase2) * p.ampY * amp + my * 12
    };
  }

  function stepToward(fromX, fromY, toX, toY, maxStep) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const d = Math.hypot(dx, dy);
    if (d <= maxStep || d < 1e-6) return { x: toX, y: toY };
    const s = maxStep / d;
    return { x: fromX + dx * s, y: fromY + dy * s };
  }

  function render(now) {
    if (!now) now = performance.now();
    const dt = Math.min(0.05, (now - lastNow) / 1000);
    lastNow = now;
    // Scale step limit a bit with framerate
    const maxStep = MAX_STEP * (dt / (1 / 60));

    const target = readScrollMix();
    scrollMix += (target - scrollMix) * Math.min(1, 0.1 + dt * 2);
    const m = ease(scrollMix);
    window.__BG_SCROLL_MIX = scrollMix;

    mx += (tmx - mx) * 0.05;
    my += (tmy - my) * 0.05;
    const lookX = mx * 24;
    const lookY = my * 24;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      const s = starSample(p, now, lookX, lookY);
      const n = nodeSample(p, now, m);

      // Morph from stable star anchor → node (never from a teleport frame)
      const fromX = p.ready ? p.stableX : n.x;
      const fromY = p.ready ? p.stableY : n.y;
      const destX = fromX + (n.x - fromX) * m;
      const destY = fromY + (n.y - fromY) * m;

      const stepped = stepToward(p.x, p.y, destX, destY, maxStep);
      p.x = stepped.x;
      p.y = stepped.y;
      p.depth = s.depth;
      p.starOn = s.on && !s.wrapped;
    }

    // Edges — soft fade, no hard pop
    const edgeA = Math.max(0, (m - 0.2) / 0.8);
    if (edgeA > 0.02) {
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist >= LINK_DIST) continue;
          const alpha = (1 - dist / LINK_DIST) * 0.26 * edgeA;
          if (alpha < 0.02) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.color}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    const streakA = Math.max(0, 1 - m * 1.15);
    for (const p of particles) {
      if (p.x < -80 || p.x > width + 80 || p.y < -80 || p.y > height + 80) continue;

      const mask = textMask(p.x, p.y);
      const starRad = Math.max(0.9, p.depth * p.depth * 3.2);
      const rad = starRad + (p.radius - starRad) * m;
      const a = Math.min(1, (0.52 + p.depth * 0.8) * mask);
      if (a < 0.04) continue;

      if (streakA > 0.1 && m < 0.85) {
        const vx = p.x - (cx + lookX * 0.35);
        const vy = p.y - (cy + lookY * 0.35);
        const vlen = Math.hypot(vx, vy) || 1;
        const len = (2.2 + p.depth * 9) * streakA;
        const ex = p.x - (vx / vlen) * len;
        const ey = p.y - (vy / vlen) * len;
        const grad = ctx.createLinearGradient(ex, ey, p.x, p.y);
        grad.addColorStop(0, `rgba(${p.color}, 0)`);
        grad.addColorStop(0.55, `rgba(${p.color}, ${a * 0.32 * streakA})`);
        grad.addColorStop(1, `rgba(${p.color}, ${a * 0.7 * streakA})`);
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(0.65, rad * 0.8);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${a * (0.72 + 0.28 * m)})`;
      ctx.fill();
    }

    if (!reduced) requestAnimationFrame(render);
  }

  window.addEventListener("mousemove", (e) => {
    if (!width) return;
    tmx = e.clientX / width - 0.5;
    tmy = e.clientY / height - 0.5;
  }, { passive: true });

  window.addEventListener("resize", resize);

  resize();
  scrollMix = readScrollMix();
  // Seed positions so first frames aren't at (0,0)
  {
    const now = performance.now();
    for (const p of particles) {
      const n = nodeSample(p, now, scrollMix);
      const s = starSample(p, now, 0, 0);
      p.x = s.on ? s.x : n.x;
      p.y = s.on ? s.y : n.y;
      if (s.on) {
        p.stableX = s.x;
        p.stableY = s.y;
        p.ready = true;
      }
    }
  }

  if (!reduced) requestAnimationFrame(render);
  else render(performance.now());
});
