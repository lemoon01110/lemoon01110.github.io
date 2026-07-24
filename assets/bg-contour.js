// --- THREE.JS 3D CANYON BACKGROUND ---
// Shared across the landing page and subject pages for a consistent backdrop.
(function () {
  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  
  // Fade out into the background color of the site to simulate an infinite horizon
  // Fog color is slightly lighter than pure #0d1117 to help the terrain stand out from the background
  scene.fog = new THREE.FogExp2('#151b23', 0.0012);

  // Perspective camera for true 3D depth
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1500);
  
  // Position camera higher and looking down the canyon for better visibility
  // Z is up, Y is forward into the screen
  camera.position.set(0, -200, 100);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const canvas = renderer.domElement;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  // Hide the placeholder canvas if it exists
  const oldCanvas = document.getElementById('bg-canvas');
  if (oldCanvas) oldCanvas.style.display = 'none';

  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    
    varying vec2 vPos;
    varying float vElevation;

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec2 pos = modelPosition.xy;

        // Black Hole Mouse Warp (Gravitational Lensing)
        float dx = pos.x - uMouse.x;
        float dy = pos.y - uMouse.y;
        float dist = length(vec2(dx, dy));
        
        // Lensing distortion
        float warpFactor = 80.0 / (dist + 5.0); 
        vec2 dir = normalize(vec2(dx, dy) + 0.0001);
        
        vec2 warpedPos = pos + dir * warpFactor;

        // Canyon Topography Math
        float nX = warpedPos.x * 0.015;
        float nY = warpedPos.y * 0.015;

        // Meandering domain distortion
        float meander1 = sin(nY * 1.8 + uTime * 0.1) * 1.5;
        float meander2 = cos(nX * 1.6 - uTime * 0.12) * 1.5;

        // Sharp V-shaped valleys using abs(sin)
        float canyon1 = abs(sin(nX + meander1)) * 15.0;
        float canyon2 = abs(sin(nY + meander2)) * 15.0;
        
        // Rigid, bumpy details (higher frequency absolute sines for crags and bumps)
        float bump1 = abs(sin(warpedPos.x * 0.05 + uTime * 0.1)) * 5.0;
        float bump2 = abs(sin(warpedPos.y * 0.06 - uTime * 0.15)) * 5.0;
        float crags = abs(sin(warpedPos.x * 0.1 + warpedPos.y * 0.1)) * 2.5;

        float elevation = canyon1 + canyon2 + bump1 + bump2 + crags;
        
        // Macro-valley shape: steep mountainsides on the far left and right to enclose the valley
        float valleyShape = pow(abs(warpedPos.x) * 0.002, 2.5) * 80.0;
        elevation += valleyShape;
        
        // Displace the vertex vertically (Z axis)
        modelPosition.z += elevation;

        // Pass variables to fragment shader for drawing lines
        vPos = warpedPos;
        vElevation = elevation;

        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColorBase;
    uniform vec3 uColorPeak;
    
    varying vec2 vPos;
    varying float vElevation;

    void main() {
        // Create contour lines based on true 3D elevation
        float contourInterval = 1.5;

        float val = vElevation / contourInterval;
        float fw = fwidth(val);
        // Slightly thicker lines since it's 3D and perspective will make them thin out far away
        float lineThickness = clamp(fw * 1.8, 0.04, 0.8); 

        float f = fract(val);
        float line = smoothstep(lineThickness, lineThickness * 0.5, f) + smoothstep(1.0 - lineThickness, 1.0 - lineThickness * 0.5, f);

        // Grid lines to enhance the 3D perspective
        float gridX = fract(vPos.x / 12.0);
        float gridY = fract(vPos.y / 12.0);
        float grid = step(0.96, gridX) + step(0.96, gridY);
        grid = clamp(grid, 0.0, 1.0) * 0.2; // faint glowing grid

        if (line < 0.05 && grid < 0.01) discard;

        // Dynamic Coloring based on height
        float colorMix = clamp((vElevation + 2.0) / 15.0, 0.0, 1.0);
        colorMix = pow(colorMix, 1.5);
        vec3 finalColor = mix(uColorBase, uColorPeak, colorMix);

        // Add natural low-lying mist in the valleys
        vec3 mistColor = vec3(0.05, 0.067, 0.09); // #0d1117 in RGB
        float valleyMist = smoothstep(15.0, -5.0, vElevation);
        finalColor = mix(finalColor, mistColor, valleyMist * 0.85); // 85% mist at the lowest points

        float alpha = max(0.6 * line, grid);

        gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  // Extremely wide mesh (4000) so resizing the window doesn't reveal empty edges
  // 4000 wide, 3000 long
  const geometry = new THREE.PlaneGeometry(4000, 3000, 250, 300);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(-1000, -1000) },
      uColorBase: { value: new THREE.Color('#bd93f9') }, // Dracula Purple
      uColorPeak: { value: new THREE.Color('#8be9fd') }  // Dracula Cyan
    },
    transparent: true,
    blending: THREE.NormalBlending,
    extensions: {
      derivatives: true // Required for fwidth anti-aliasing
    },
    fog: true // allow scene fog to affect the material
  });

  const terrainMesh = new THREE.Mesh(geometry, material);
  // Shift terrain so camera starts near the bottom edge and looks across the length
  terrainMesh.position.y = 800; 
  scene.add(terrainMesh);

  // --- Mouse Raycasting ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-1000, -1000);
  const targetPoint = new THREE.Vector3(0, 0, 0);
  // An average mathematical plane for mouse intersection
  const mathPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 10); 

  let targetCameraX = 0;
  let targetCameraY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Slight camera pan based on mouse
    targetCameraX = mouse.x * 25.0;
  });

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let currentScrollY = window.scrollY;
  let currentCameraX = 0;

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime() * 0.15;

    // Smooth Vertical Parallax (Scroll moves you forward into the canyon)
    const targetScroll = window.scrollY * 0.2;
    currentScrollY += (targetScroll - currentScrollY) * 0.1;

    // Smooth Mouse Parallax
    currentCameraX += (targetCameraX - currentCameraX) * 0.05;

    // Update camera position
    camera.position.x = currentCameraX;
    camera.position.y = -200 + currentScrollY;
    
    // Always look ahead into the distance and slightly down
    camera.lookAt(currentCameraX * 0.5, currentScrollY + 600, 0);

    // Raycast to find intersection on the XY plane
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.ray.intersectPlane(mathPlane, targetPoint);

    material.uniforms.uTime.value = time;
    if (intersect) {
       material.uniforms.uMouse.value.set(targetPoint.x, targetPoint.y);
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
