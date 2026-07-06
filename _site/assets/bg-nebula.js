// Cosmic Dust Nebula Background
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(0, 0, 1000);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // --- PARTICLE SYSTEM ---
  const particleCount = 5000;
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colorMixes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Spread points randomly in a massive 3D volume
    positions[i * 3 + 0] = (Math.random() - 0.5) * 4000; // X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3000; // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4000; // Z (Depth)

    // Random base size for each particle (varying dust sizes)
    sizes[i] = Math.random() * 10.0 + 3.0;

    // Random blend factor for Cyan vs Purple
    colorMixes[i] = Math.random();
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aColorMix', new THREE.BufferAttribute(colorMixes, 1));

  const vertexShader = `
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;
    uniform float uPixelRatio;

    attribute float aSize;
    attribute float aColorMix;

    varying float vColorMix;

    void main() {
        vColorMix = aColorMix;
        
        vec3 pos = position;

        // Subtle, organic drifting motion based on time and spatial coordinates
        pos.x += sin(pos.y * 0.002 + uTime * 0.1) * 30.0;
        pos.y += cos(pos.x * 0.002 + uTime * 0.08) * 30.0;
        
        // Scroll interaction: Fly through the dust cloud by moving particles towards the camera (Z axis)
        pos.z += uScroll * 0.5;

        // Wrap particles around if they fly past the camera so it loops infinitely
        if (pos.z > 1500.0) {
            pos.z -= 4000.0;
        } else if (pos.z < -2500.0) {
            pos.z += 4000.0; // In case of scrolling up
        }

        // Mouse Repulsion Effect
        // Project mouse screen coords to a world-space plane roughly where the particles are
        vec2 worldMouse = vec2((uMouse.x - 0.5) * 4000.0, -(uMouse.y - 0.5) * 3000.0);
        
        // Calculate distance from this particle's XY to the mouse XY
        float distToMouse = distance(pos.xy, worldMouse);
        
        // Repulsion force falls off with distance
        float repulsion = clamp(1.0 - distToMouse / 600.0, 0.0, 1.0);
        
        // Push particles away radially
        if (repulsion > 0.0) {
            vec2 dir = normalize(pos.xy - worldMouse);
            // Push strongly
            pos.xy += dir * (pow(repulsion, 2.0) * 200.0);
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Scale size by perspective distance and device pixel ratio
        gl_PointSize = aSize * uPixelRatio * (800.0 / -mvPosition.z);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;

    varying float vColorMix;

    void main() {
        // Draw a soft, feathered circle instead of a harsh square
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        
        // Smoothstep makes the edges soft (0.5 is outer edge, 0.1 is inner core)
        float alpha = smoothstep(0.5, 0.1, dist);
        
        if (alpha < 0.01) discard; // Optimization: don't render empty pixels

        // Blend between Dracula Cyan and Purple
        vec3 color = mix(uColor1, uColor2, vColorMix);
        
        // Soft glowing opacity
        gl_FragColor = vec4(color, alpha * 0.25);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) }, // Center by default
      uColor1: { value: new THREE.Color('#8be9fd') }, // Cyan
      uColor2: { value: new THREE.Color('#bd93f9') }, // Purple
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    transparent: true,
    depthWrite: false, // Ensures glowing particles blend over each other properly
    blending: THREE.AdditiveBlending // Makes overlapping particles glow brighter
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // --- INTERACTIONS ---
  let targetScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  let targetMouse = { x: 0.5, y: 0.5 };
  let currentMouse = { x: 0.5, y: 0.5 };
  
  // Track mouse globally across the window
  window.addEventListener('mousemove', (e) => {
    targetMouse.x = e.clientX / window.innerWidth;
    targetMouse.y = e.clientY / window.innerHeight;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    // Smooth scroll interpolation (Lerp)
    currentScrollY += (targetScrollY - currentScrollY) * 0.05;
    material.uniforms.uScroll.value = currentScrollY;

    // Smooth mouse interpolation (Lerp)
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
    material.uniforms.uMouse.value.set(currentMouse.x, currentMouse.y);

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
  });
});
