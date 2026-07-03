document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('ascii-hero-container');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    const hoverRadius = 30; // Very localized hover radius
    const hoverColor = { r: 139, g: 233, b: 253 }; // Dracula Cyan

    // The characters to use (all printable ASCII except space)
    const chars = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";

    function init() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Offscreen canvas to draw text and read pixels
        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        const octx = offscreen.getContext('2d');
        const text1 = "Hi, I'm";
        const text2 = "Lemon";

        // Dynamic font sizing
        let baseFontSize = 100;
        octx.font = `900 ${baseFontSize}px "Arial Black", Impact, sans-serif`;
        let m1 = octx.measureText(text1).width;
        let m2 = octx.measureText(text2).width;
        let spaceWidth = octx.measureText(" ").width;
        
        const targetWidth = width * 0.85;
        let fontSize;
        let isWrapped = false;
        
        // Try single line first
        let totalWidth = m1 + spaceWidth + m2;
        let scaleRatio = targetWidth / totalWidth;
        fontSize = baseFontSize * scaleRatio;
        
        // If it gets too small on narrow screens, wrap it!
        if (width < 768 || fontSize < 100) {
            isWrapped = true;
            // Scale based on the widest single line to maximize size
            const maxLineWidth = Math.max(m1, m2);
            scaleRatio = targetWidth / maxLineWidth;
            fontSize = Math.min(baseFontSize * scaleRatio, 400); 
        } else {
            fontSize = Math.min(fontSize, 400);
        }

        // Apply final font
        octx.font = `900 ${fontSize}px "Arial Black", Impact, sans-serif`;
        octx.textBaseline = "middle";

        // Re-measure for final placement
        m1 = octx.measureText(text1).width;
        m2 = octx.measureText(text2).width;
        spaceWidth = octx.measureText(" ").width;

        if (isWrapped) {
            octx.textAlign = "center";
            const textY1 = height / 2 - fontSize * 0.55;
            const textY2 = height / 2 + fontSize * 0.55;
            
            // Draw "Hi, I'm"
            octx.fillStyle = "#f8f8f2"; 
            octx.fillText(text1, width / 2, textY1);
            
            // Draw "Lemon"
            const startX = width / 2 - m2 / 2;
            const gradient = octx.createLinearGradient(startX, 0, startX + m2, 0);
            gradient.addColorStop(0, "#bd93f9"); 
            gradient.addColorStop(1, "#ff79c6"); 
            octx.fillStyle = gradient;
            octx.fillText(text2, width / 2, textY2);
        } else {
            octx.textAlign = "left";
            const textY = height / 2;
            totalWidth = m1 + spaceWidth + m2;
            let currentX = width / 2 - totalWidth / 2;
            
            // Draw "Hi, I'm"
            octx.fillStyle = "#f8f8f2";
            octx.fillText(text1, currentX, textY);
            
            currentX += m1 + spaceWidth;
            
            // Draw "Lemon"
            const gradient = octx.createLinearGradient(currentX, 0, currentX + m2, 0);
            gradient.addColorStop(0, "#bd93f9"); 
            gradient.addColorStop(1, "#ff79c6"); 
            octx.fillStyle = gradient;
            octx.fillText(text2, currentX, textY);
        }

        // Read pixels
        const imageData = octx.getImageData(0, 0, width, height);
        const data = imageData.data;

        particles = [];
        const step = 8; // Larger step for larger ASCII characters
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const index = (y * width + x) * 4;
                const alpha = data[index + 3];
                if (alpha > 128) {
                    // Extract color from the offscreen canvas
                    const r = data[index];
                    const g = data[index + 1];
                    const b = data[index + 2];

                    particles.push({
                        x: x,
                        y: y,
                        char: chars[Math.floor(Math.random() * chars.length)],
                        baseColor: { r, g, b }, // Revert to original white/gradient colors
                        trail: 0,
                        rainAlpha: 0
                    });
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const time = Date.now() * 0.001;

        // Animate particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Calculate distance to mouse
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Character changing logic and trail
            if (dist < hoverRadius) {
                // Boost trail based on distance from mouse, so the tail is a radial gradient that physically shrinks as it decays
                const intensity = Math.max(0, 1 - (dist / hoverRadius));
                p.trail = Math.max(p.trail, intensity);
                
                // Beserk mode when mouse is close! High chance to change character
                if (Math.random() < 0.8) {
                    p.char = chars[Math.floor(Math.random() * chars.length)];
                }
            } else {
                // Fade out trail and rain mask smoothly with linear decay
                p.trail = Math.max(0, p.trail - 0.01);
                p.rainAlpha = Math.max(0, p.rainAlpha - 0.01);
                
                if (p.trail > 0.1) {
                    // Still mutating while trail is active
                    if (Math.random() < p.trail * 0.4) {
                        p.char = chars[Math.floor(Math.random() * chars.length)];
                    }
                } else {
                    // Rain opacity mask effect (vertical cascades)
                    const colSpeed = 1 + (Math.sin(p.x * 345.67) * 0.8); // Random speed per column
                    const colOffset = Math.sin(p.x * 891.23) * 10000; // Random starting phase
                    
                    // Use a continuous sine wave to generate infinite falling drops!
                    // 0.06 frequency = ~1 drop every 100 pixels.
                    // Negative time multiplier makes the wave travel downwards.
                    const wave = Math.sin(p.y * 0.06 - time * 8 * colSpeed + colOffset);

                    // We only want the peak of the wave to act as the raindrop
                    if (wave > 0.7) {
                        // Normalize the peak (0.7 to 1.0) into a 0.0 to 1.0 intensity
                        const intensity = (wave - 0.7) / 0.3;
                        p.rainAlpha = Math.max(p.rainAlpha, intensity);
                    } else if (Math.random() < 0.001) {
                        // Very slow background mutation
                        p.char = chars[Math.floor(Math.random() * chars.length)];
                    }
                }
            }

            // Interpolate color based on trail intensity (mouse hover turns it Cyan)
            const r = p.baseColor.r + (hoverColor.r - p.baseColor.r) * p.trail;
            const g = p.baseColor.g + (hoverColor.g - p.baseColor.g) * p.trail;
            const b = p.baseColor.b + (hoverColor.b - p.baseColor.b) * p.trail;

            // Calculate final alpha (mask) - faint baseline 0.25 for better visibility
            const alpha = Math.min(1.0, 0.25 + p.trail + p.rainAlpha);

            ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha.toFixed(3)})`;
            ctx.fillText(p.char, p.x, p.y);
        }
    }

    // Handle mouse
    container.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    container.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            init();
        }, 200);
    });

    init();
    animate();
});
