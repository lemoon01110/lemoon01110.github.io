/* ─────────────────────────────────────────────────────────────
   Network / constellation background — drifting nodes with
   proximity edges. Calm graph field for reading-heavy sections.
   Cross-fades with #particle-canvas via body[data-bg-mode].
   ───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "network-canvas";
  Object.assign(canvas.style, {
    position: "fixed", top: "0", left: "0",
    width: "100vw", height: "100vh", zIndex: "-1", pointerEvents: "none",
    opacity: "0", transition: "opacity 1.1s ease"
  });
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const TEAL   = "95, 184, 173";
  const CITRUS = "198, 161, 91";
  const INDIGO = "124, 156, 255";
  const COLORS = [TEAL, CITRUS, INDIGO];

  let width, height, dpr;
  let particles = [];
  const MAX_DISTANCE = 150;
  const MOUSE_DISTANCE = 200;
  const PARTICLE_SPEED = 0.45;

  let mouse = { x: -1000, y: -1000 };
  let targetParallaxX = 0, targetParallaxY = 0;
  let parallaxX = 0, parallaxY = 0;
  let targetScrollParallaxY = 0, scrollParallaxY = 0;

  const reduced =
    (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) ||
    window.__STILL__;

  function active() {
    return document.body.getAttribute("data-bg-mode") === "network";
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
      this.radius = Math.random() * 1.5 + 0.5;
      this.color = COLORS[(Math.random() * COLORS.length) | 0];
      this.screenX = this.x;
      this.screenY = this.y;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x += width;
      if (this.x > width) this.x -= width;
      if (this.y < 0) this.y += height;
      if (this.y > height) this.y -= height;

      const depth = this.radius;
      this.screenX = (this.x + parallaxX * depth) % width;
      this.screenY = (this.y + parallaxY * depth + scrollParallaxY * depth) % height;
      if (this.screenX < 0) this.screenX += width;
      if (this.screenY < 0) this.screenY += height;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.screenX, this.screenY, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, 0.78)`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.max(48, Math.floor(width / 15));
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];

      const dxMouse = p1.screenX - mouse.x;
      const dyMouse = p1.screenY - mouse.y;
      const distMouse = Math.hypot(dxMouse, dyMouse);
      if (distMouse < MOUSE_DISTANCE) {
        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(mouse.x, mouse.y);
        const opacity = 1 - distMouse / MOUSE_DISTANCE;
        ctx.strokeStyle = `rgba(${TEAL}, ${opacity * 0.45})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p1.screenX - p2.screenX, p1.screenY - p2.screenY);
        if (dist < MAX_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(p1.screenX, p1.screenY);
          ctx.lineTo(p2.screenX, p2.screenY);
          const opacity = 1 - dist / MAX_DISTANCE;
          ctx.strokeStyle = `rgba(${p1.color}, ${opacity * 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  window.addEventListener("resize", () => {
    resize();
    initParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    targetParallaxX = (e.clientX - width / 2) * -0.12;
    targetParallaxY = (e.clientY - height / 2) * -0.12;
  }, { passive: true });

  window.addEventListener("scroll", () => {
    targetScrollParallaxY = window.scrollY * -0.35;
  }, { passive: true });

  window.addEventListener("mouseout", () => {
    mouse.x = -1000;
    mouse.y = -1000;
    targetParallaxX = 0;
    targetParallaxY = 0;
  });

  function render() {
    canvas.style.opacity = active() ? "1" : "0";

    parallaxX += (targetParallaxX - parallaxX) * 0.05;
    parallaxY += (targetParallaxY - parallaxY) * 0.05;
    scrollParallaxY += (targetScrollParallaxY - scrollParallaxY) * 0.05;

    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    drawLines();

    if (!reduced) requestAnimationFrame(render);
  }

  resize();
  initParticles();
  if (!document.body.getAttribute("data-bg-mode")) {
    document.body.setAttribute("data-bg-mode", "stars");
  }
  render();
});
