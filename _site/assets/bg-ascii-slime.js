// ASCII Slime Mold Background (Voronoi/Cellular Tendril Network)
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const fontSize = 14;

  // Grid to store permanent slime density
  let grid = [];
  let cols = 0;
  let rows = 0;
  let tips = [];

  function initSystem() {
      cols = Math.floor(width / fontSize);
      rows = Math.floor(height / fontSize);
      
      grid = [];
      for (let i = 0; i < cols; i++) {
          let col = [];
          for (let j = 0; j < rows; j++) {
              col.push(0);
          }
          grid.push(col);
      }
      
      // Start limbs spread entirely across the top edge!
      tips = [];
      for (let i = 0; i < 20; i++) {
          tips.push({
              x: Math.random() * cols, // Spawn anywhere along the top edge
              y: 0, 
              vx: (Math.random() - 0.5) * 1.5, // Natural horizontal wander
              vy: Math.random() * 0.5 + 0.5,
              energy: 1.0 + Math.random() * 0.8, // Balanced energy for distinct tendrils
              active: true
          });
      }
  }

  // Initialize on load
  initSystem();

  // Re-initialize if screen size changes drastically
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initSystem();
  });

  // ASCII density string (from darkest/empty to brightest/dense)
  const density = "   .:-=+*#%@";
  
  let time = 0;

  function animate() {
    ctx.fillStyle = 'rgba(13, 17, 23, 1.0)'; // Solid dark notebook background
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    time += 1;

    // --- UPDATE GROWING LIMBS ---
    let newTips = [];
    for (let tip of tips) {
        if (!tip.active) continue;

        // Move the limb tip
        tip.x += tip.vx;
        tip.y += tip.vy;

        // Wander organically
        tip.vx += (Math.random() - 0.5) * 0.8;
        tip.vy += (Math.random() - 0.5) * 0.4;
        
        // Favor growing downwards slightly, but allow horizontal and even slight upward growth
        if (tip.vy < -0.1) tip.vy = -0.1; 
        
        // Light dampening so limbs can travel left and right without going crazy
        tip.vx *= 0.95;
        
        // Get grid coordinates
        let ix = Math.floor(tip.x);
        let iy = Math.floor(tip.y);
        
        // Draw the limb into the permanent grid
        if (ix >= 0 && ix < cols && iy >= 0 && iy < rows) {
            // Main limb body
            grid[ix][iy] = Math.min(1.0, grid[ix][iy] + tip.energy * 0.4);
            
            // If the limb has high energy, it is THICK, so it draws into adjacent cells too
            if (tip.energy > 0.6) {
                if (ix > 0) grid[ix-1][iy] = Math.min(1.0, grid[ix-1][iy] + tip.energy * 0.2);
                if (ix < cols-1) grid[ix+1][iy] = Math.min(1.0, grid[ix+1][iy] + tip.energy * 0.2);
            }
            if (tip.energy > 1.2) {
                if (ix > 1) grid[ix-2][iy] = Math.min(1.0, grid[ix-2][iy] + tip.energy * 0.1);
                if (ix < cols-2) grid[ix+2][iy] = Math.min(1.0, grid[ix+2][iy] + tip.energy * 0.1);
            }
        } else {
            // Limb hit the edge of the screen, stop growing
            tip.active = false;
        }

        // Branching: Occasionally split into two limbs!
        if (Math.random() < 0.04 && tip.energy > 0.3) {
            tip.energy *= 0.75; // Parent limb gets slightly thinner after branching
            newTips.push({
                x: tip.x,
                y: tip.y,
                vx: tip.vx + (Math.random() - 0.5) * 2.5, // Branch shoots outwards
                vy: tip.vy + (Math.random() - 0.2) * 1.0,
                energy: tip.energy,
                active: true
            });
        }

        // Limbs slowly lose energy as they explore, eventually dying (stopping)
        tip.energy -= 0.0025; // Balanced energy loss for distinct network look
        if (tip.energy <= 0) tip.active = false;
        
        newTips.push(tip);
    }
    tips = newTips;

    // --- RENDER PERMANENT GRID ---
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        
        let slimeValue = grid[i][j];
        if (slimeValue <= 0.01) continue;

        // Clamp
        slimeValue = Math.max(0, Math.min(1, slimeValue));

        // Map to ASCII character
        const charIndex = Math.floor(slimeValue * (density.length - 1));
        const char = density[charIndex];

        if (char === ' ') continue;
        
        // Biological Pulsation (Shuttle Streaming)
        // Creates a rhythmic wave that pumps outwards from the top center
        let distFromTopCenter = Math.sqrt(Math.pow(i - cols/2, 2) + Math.pow(j, 2));
        let pulse = Math.sin(distFromTopCenter * 0.15 - time * 0.1) * 0.5 + 0.5; // Range 0 to 1
        
        // The pulse is strongest in the thickest "artery" veins
        let arteryFactor = Math.pow(slimeValue, 2.0); 
        let boostedValue = Math.min(1.0, slimeValue + pulse * 0.4 * arteryFactor);

        // Map colors (Neon Yellow/Green)
        const r = Math.floor(20 + boostedValue * (204 - 20));
        const g = Math.floor(40 + boostedValue * (255 - 40));
        const b = Math.floor(10 + boostedValue * (0 - 10));
        
        const alpha = boostedValue * 0.8 + 0.2;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillText(char, i * fontSize + fontSize/2, j * fontSize + fontSize/2);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
