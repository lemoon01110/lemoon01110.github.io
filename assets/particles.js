/* ─────────────────────────────────────────────────────────────
   Star-drive background — a 3-D field of stars projected from a
   vanishing point. You gently drift forward at rest and accelerate
   (with warp-streak trails) as you scroll, like flying through space.
   Teal & Amber grade. No cursor-glue glow.
   ───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0",
    width: "100vw", height: "100vh", zIndex: "-1", pointerEvents: "none"
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const TEAL   = "95, 184, 173";   // #5fb8ad
  const CITRUS = "198, 161, 91";   // champagne gold
  const INDIGO = "124, 156, 255";  // soft indigo
  const MAXZ   = 1.0;              // far plane

  let width, height, cx, cy, dpr, stars = [];
  const focal = () => Math.min(width, 1100) * 0.5;

  const BASE_SPEED = 0.0018;      // idle forward drift
  let speed = BASE_SPEED, targetSpeed = BASE_SPEED;
  let mx = 0, my = 0, tmx = 0, tmy = 0;   // eased mouse-look
  const reduced = (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) || window.__STILL__;

  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    cx = width / 2; cy = height / 2;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // A star lives in a normalized [-1,1] plane at depth z. fresh=true spreads it
  // through the whole depth range (startup); otherwise it's born at the far plane.
  function spawn(s, fresh) {
    s.x = Math.random() * 2 - 1;
    s.y = Math.random() * 2 - 1;
    s.z = fresh ? Math.random() * MAXZ + 0.05 : MAXZ;
    s.amber = Math.random() > 0.85;   // ~15% warm citrus sparks
    s.indigo = !s.amber && Math.random() > 0.88;  // ~12% indigo sparks
    s.px = null; s.py = null;
    return s;
  }
  function initStars() {
    const count = Math.max(140, Math.floor(width / 6));
    stars = [];
    for (let i = 0; i < count; i++) stars.push(spawn({}, true));
  }

  // Scrolling (either direction) accelerates the forward flight.
  let lastScroll = window.scrollY;
  window.addEventListener("scroll", () => {
    const dy = window.scrollY - lastScroll; lastScroll = window.scrollY;
    targetSpeed = BASE_SPEED + Math.min(0.024, Math.abs(dy) * 0.00028);
  }, { passive: true });

  // Subtle parallax "look" — the field leans slightly with the cursor.
  window.addEventListener("mousemove", (e) => {
    tmx = e.clientX / width - 0.5;
    tmy = e.clientY / height - 0.5;
  }, { passive: true });
  window.addEventListener("resize", () => { resize(); initStars(); });

  function render() {
    targetSpeed += (BASE_SPEED - targetSpeed) * 0.045;   // decay scroll boost
    speed += (targetSpeed - speed) * 0.1;
    mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;

    ctx.clearRect(0, 0, width, height);
    const f = focal();
    const lookX = mx * 46, lookY = my * 46;

    for (const s of stars) {
      s.z -= speed;
      if (s.z <= 0.05) { spawn(s, false); }

      const inv = 1 / s.z;
      const sx = cx + s.x * inv * f + lookX * (1 - s.z);
      const sy = cy + s.y * inv * f + lookY * (1 - s.z);
      const depth = 1 - s.z / MAXZ;                 // 0 far … ~1 near
      const r = Math.max(0.45, depth * depth * 2.9);
      const a = Math.min(0.95, 0.22 + depth * 0.9);
      const col = s.amber ? CITRUS : s.indigo ? INDIGO : TEAL;

      // reset stars that fly past the edges
      if (sx < -60 || sx > width + 60 || sy < -60 || sy > height + 60) {
        spawn(s, false); continue;
      }

      // warp streak — long when flying fast, a dot at rest
      if (s.px !== null) {
        const len = Math.hypot(sx - s.px, sy - s.py);
        if (len > 1.4) {
          ctx.beginPath();
          ctx.moveTo(s.px, s.py); ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(${col}, ${a * 0.55})`;
          ctx.lineWidth = Math.max(0.5, r * 0.8);
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col}, ${a})`;
      ctx.fill();
      s.px = sx; s.py = sy;
    }

    if (!reduced) requestAnimationFrame(render);
  }

  resize();
  initStars();
  render();   // draws a still, depth-sorted field for reduced-motion / capture
});
