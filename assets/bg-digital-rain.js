const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

initCanvas();

// Characters: just 0s and 1s as requested
const chars = '01';

const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);
let drops = [];

// Initialize drops randomly
for (let x = 0; x < columns; x++) {
  drops[x] = Math.random() * -100; // Start off screen
}

function draw() {
  // Translucent black background to create trail effect
  ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0F0'; // Green text
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    
    // Draw character
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Reset drop to top if it's off screen or randomly
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = -1; // Start off-screen
    }
    
    // Move drop down
    drops[i]++;
  }
}

// 30 fps is good for this
setInterval(draw, 33);

window.addEventListener('resize', () => {
  initCanvas();
  // Adjust columns on resize
  const newColumns = Math.floor(canvas.width / fontSize);
  if (newColumns > columns) {
    for (let x = columns; x < newColumns; x++) {
      drops[x] = Math.random() * -100;
    }
  }
  columns = newColumns;
});
