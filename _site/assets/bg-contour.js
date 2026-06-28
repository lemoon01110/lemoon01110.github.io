// --- THREE.JS SHADER-BASED CONTOUR PLOT BACKGROUND ---
// Shared across the landing page and subject pages for a consistent backdrop.
(function () {
  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();

  // Orthographic camera looking straight down for a 2D topographic map effect
  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = 120;
  const camera = new THREE.OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);

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
    varying vec2 vPos;

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vPos = modelPosition.xy;
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec3 uColorBase;
    uniform vec3 uColorPeak;

    varying vec2 vPos;

    void main() {
        // Fluid topography (organic angled waves)
        float wave1 = sin(vPos.x * 0.03 + vPos.y * 0.04 + uTime * 0.8) * 6.0;
        float wave2 = sin(vPos.x * -0.05 + vPos.y * 0.03 - uTime * 0.6) * 5.0;
        float wave3 = sin(vPos.x * 0.02 - vPos.y * 0.06 + uTime * 0.5) * 4.0;

        float elevation = wave1 + wave2 + wave3;

        // Gaussian Mouse Warp
        float dx = vPos.x - uMouse.x;
        float dy = vPos.y - uMouse.y;
        float distSq = dx * dx + dy * dy;

        float amplitude = 12.0;
        float variance = 350.0;
        float gaussian = amplitude * exp(-distSq / (2.0 * variance));

        elevation += gaussian;

        // Create contour lines
        float contourInterval = 3.5;

        // Anti-aliased contour lines using fwidth for perfect thickness
        float val = elevation / contourInterval;
        float fw = fwidth(val);
        float lineThickness = clamp(fw * 1.5, 0.015, 0.5);

        float f = fract(val);
        float line = smoothstep(lineThickness, lineThickness * 0.5, f) + smoothstep(1.0 - lineThickness, 1.0 - lineThickness * 0.5, f);

        if (line < 0.05) discard;

        // Dynamic Coloring
        float colorMix = clamp((elevation + 2.0) / 15.0, 0.0, 1.0);
        colorMix = pow(colorMix, 1.5);
        vec3 finalColor = mix(uColorBase, uColorPeak, colorMix);

        gl_FragColor = vec4(finalColor, 0.25 * line);
    }
  `;

  // Flat plane; topography is computed mathematically per-pixel in the fragment shader
  const geometry = new THREE.PlaneGeometry(800, 800, 1, 1);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(-1000, -1000) },
      uColorBase: { value: new THREE.Color('#8a2be2') }, // Deep Purple
      uColorPeak: { value: new THREE.Color('#00ff88') }  // Neon Green
    },
    transparent: true,
    blending: THREE.NormalBlending,
    extensions: {
      derivatives: true // Required for fwidth anti-aliasing
    }
  });

  const terrainMesh = new THREE.Mesh(geometry, material);
  scene.add(terrainMesh);

  // --- Mouse Raycasting ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-1000, -1000);
  const targetPoint = new THREE.Vector3(0, 0, 0);
  const mathPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let currentScrollY = window.scrollY;

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime() * 0.15;

    // Smooth Vertical Parallax
    const targetY = -(window.scrollY * 0.05);
    currentScrollY += (targetY - currentScrollY) * 0.1;
    camera.position.y = currentScrollY;

    // Raycast to find true 3D intersection on the XY plane
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mathPlane, targetPoint);

    material.uniforms.uTime.value = time;
    material.uniforms.uMouse.value.set(targetPoint.x, targetPoint.y);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -frustumSize * aspect / 2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = -frustumSize / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
