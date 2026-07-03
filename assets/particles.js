document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "particle-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");

    let width, height;
    let particles = [];
    
    // Config
    const PARTICLE_COUNT = Math.floor(window.innerWidth / 15); // Scale count by screen width
    const MAX_DISTANCE = 150;
    const MOUSE_DISTANCE = 200;
    const PARTICLE_SPEED = 0.5;

    // Dracula colors
    const COLOR_CYAN = "139, 233, 253"; // #8be9fd
    const COLOR_PURPLE = "189, 147, 249"; // #bd93f9

    let mouse = { x: -1000, y: -1000 };
    
    // Parallax state
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    
    let targetScrollParallaxY = 0;
    let scrollParallaxY = 0;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // Handle high-DPI displays for sharp lines
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    window.addEventListener("resize", () => {
        resize();
        initParticles(); // Reinitialize to avoid clustering
    });
    
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Calculate target parallax (opposite direction of mouse)
        targetParallaxX = (e.clientX - width / 2) * -0.15;
        targetParallaxY = (e.clientY - height / 2) * -0.15;
    });
    
    window.addEventListener("scroll", () => {
        // As you scroll down, window.scrollY increases.
        // We multiply by a negative factor so particles move UP (anti to scroll)
        targetScrollParallaxY = window.scrollY * -0.5;
    });
    
    window.addEventListener("mouseout", () => {
        mouse.x = -1000;
        mouse.y = -1000;
        targetParallaxX = 0;
        targetParallaxY = 0;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.vy = (Math.random() - 0.5) * PARTICLE_SPEED;
            this.radius = Math.random() * 1.5 + 0.5;
            this.color = Math.random() > 0.5 ? COLOR_CYAN : COLOR_PURPLE;
            
            this.screenX = this.x;
            this.screenY = this.y;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Base coordinates just wrap naturally without bouncing
            if (this.x < 0) this.x += width;
            if (this.x > width) this.x -= width;
            if (this.y < 0) this.y += height;
            if (this.y > height) this.y -= height;
            
            // Calculate screen coordinates with depth-based parallax
            let depth = this.radius;
            this.screenX = (this.x + parallaxX * depth) % width;
            this.screenY = (this.y + parallaxY * depth + scrollParallaxY * depth) % height;
            
            // Handle negative modulo in JS
            if (this.screenX < 0) this.screenX += width;
            if (this.screenY < 0) this.screenY += height;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.screenX, this.screenY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, 0.8)`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            let p1 = particles[i];

            // Connect to mouse
            let dxMouse = p1.screenX - mouse.x;
            let dyMouse = p1.screenY - mouse.y;
            let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            
            if (distMouse < MOUSE_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(p1.screenX, p1.screenY);
                ctx.lineTo(mouse.x, mouse.y);
                let opacity = 1 - (distMouse / MOUSE_DISTANCE);
                // Make mouse connections slightly brighter/thicker
                ctx.strokeStyle = `rgba(${COLOR_CYAN}, ${opacity * 0.5})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }

            // Connect to other particles
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p1.screenX - p2.screenX;
                let dy = p1.screenY - p2.screenY;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MAX_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(p1.screenX, p1.screenY);
                    ctx.lineTo(p2.screenX, p2.screenY);
                    let opacity = 1 - (dist / MAX_DISTANCE);
                    ctx.strokeStyle = `rgba(${p1.color}, ${opacity * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Smoothly interpolate parallax to target for buttery movement
        parallaxX += (targetParallaxX - parallaxX) * 0.05;
        parallaxY += (targetParallaxY - parallaxY) * 0.05;
        scrollParallaxY += (targetScrollParallaxY - scrollParallaxY) * 0.05;
        
        for (let p of particles) {
            p.update();
            p.draw();
        }
        
        drawLines();
        
        requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();
});
