// Clockwork Orrery Background
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  
  // Use a perspective camera for depth
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
  camera.position.set(0, -300, 800);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // --- MATERIALS ---
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: 0xaa8844,
    metalness: 0.8,
    roughness: 0.3,
    wireframe: true, // Use wireframe for that ethereal blueprint look
    transparent: true,
    opacity: 0.15
  });

  const cyanGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0x8be9fd,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  const purpleGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xbd93f9,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  // Solid glowing material for planets
  const planetCyanMaterial = new THREE.MeshBasicMaterial({
    color: 0x8be9fd,
    transparent: true,
    opacity: 0.8
  });
  
  const planetPurpleMaterial = new THREE.MeshBasicMaterial({
    color: 0xbd93f9,
    transparent: true,
    opacity: 0.8
  });

  // --- GEOMETRY FACTORY ---
  function createGearShape(innerRadius, outerRadius, teethCount) {
    const shape = new THREE.Shape();
    const step = (Math.PI * 2) / (teethCount * 2);
    
    for (let i = 0; i < teethCount * 2; i++) {
      const radius = (i % 2 === 0) ? outerRadius : innerRadius;
      const angle = i * step;
      if (i === 0) shape.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      else shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    shape.closePath();
    
    // Extrude config to make it 3D
    const extrudeSettings = { depth: 4, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    // Center the geometry on Z axis
    geometry.translate(0, 0, -2);
    return geometry;
  }

  // --- BUILD THE ORRERY HIERARCHY ---
  const orreryGroup = new THREE.Group();
  scene.add(orreryGroup);
  
  // Center Sun (Glowing core)
  const sunGeom = new THREE.IcosahedronGeometry(40, 1);
  const sun = new THREE.Mesh(sunGeom, planetCyanMaterial);
  orreryGroup.add(sun);
  
  // Outer Armillary Rings
  const ringGroup = new THREE.Group();
  orreryGroup.add(ringGroup);
  
  for(let i=0; i<3; i++) {
    const rGeom = new THREE.TorusGeometry(350 + i*40, 2, 8, 100);
    const ring = new THREE.Mesh(rGeom, brassMaterial);
    ring.rotation.x = Math.random() * Math.PI;
    ring.rotation.y = Math.random() * Math.PI;
    
    // Attach an animation property
    ring.userData = {
      axis: new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize(),
      speed: (Math.random() * 0.2 + 0.05) * (i%2===0?1:-1)
    };
    ringGroup.add(ring);
  }

  // Giant background gear
  const giantGearGeom = createGearShape(450, 480, 60);
  const giantGear = new THREE.Mesh(giantGearGeom, brassMaterial);
  giantGear.rotation.x = Math.PI / 2; // Lay flat
  orreryGroup.add(giantGear);

  // Planet 1 System (Inner)
  const planet1Pivot = new THREE.Group();
  orreryGroup.add(planet1Pivot);
  
  const orbit1Geom = new THREE.TorusGeometry(150, 1, 4, 64);
  const orbit1 = new THREE.Mesh(orbit1Geom, cyanGlowMaterial);
  orbit1.rotation.x = Math.PI / 2;
  planet1Pivot.add(orbit1);
  
  const planet1 = new THREE.Mesh(new THREE.SphereGeometry(15, 8, 8), planetPurpleMaterial);
  planet1.position.set(150, 0, 0);
  planet1Pivot.add(planet1);
  
  // Nested moon for Planet 1
  const moonPivot = new THREE.Group();
  planet1.add(moonPivot);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(5, 4, 4), planetCyanMaterial);
  moon.position.set(30, 0, 0);
  moonPivot.add(moon);
  const moonOrbit = new THREE.Mesh(new THREE.TorusGeometry(30, 0.5, 4, 32), brassMaterial);
  moonOrbit.rotation.x = Math.PI / 2;
  moonPivot.add(moonOrbit);

  // Planet 2 System (Outer, different inclination)
  const planet2Pivot = new THREE.Group();
  planet2Pivot.rotation.x = 0.4;
  planet2Pivot.rotation.z = 0.2;
  orreryGroup.add(planet2Pivot);
  
  const orbit2Geom = new THREE.TorusGeometry(280, 1, 4, 64);
  const orbit2 = new THREE.Mesh(orbit2Geom, purpleGlowMaterial);
  orbit2.rotation.x = Math.PI / 2;
  planet2Pivot.add(orbit2);
  
  const gear2Geom = createGearShape(25, 35, 12);
  const planet2Gear = new THREE.Mesh(gear2Geom, cyanGlowMaterial);
  planet2Gear.position.set(280, 0, 0);
  planet2Gear.rotation.x = Math.PI / 2;
  planet2Pivot.add(planet2Gear);


  // --- LIGHTS ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x8be9fd, 1, 1000);
  scene.add(pointLight);


  // --- ANIMATION LOOP ---
  const clock = new THREE.Clock();
  
  // Scroll parallax variables
  let targetScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  // Tilt based on mouse
  let mouseX = 0;
  let targetMouseX = 0;
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Rotate Armillary Rings
    ringGroup.children.forEach(ring => {
      ring.rotateOnAxis(ring.userData.axis, ring.userData.speed * delta);
    });

    // Rotate Giant Gear
    giantGear.rotation.z += 0.05 * delta;
    
    // Sun pulsing rotation
    sun.rotation.y += 0.2 * delta;
    sun.rotation.x += 0.1 * delta;
    const scale = 1.0 + Math.sin(time * 2) * 0.05;
    sun.scale.set(scale, scale, scale);

    // Orbits
    planet1Pivot.rotation.y += 0.3 * delta;
    moonPivot.rotation.y += 1.5 * delta;
    moonPivot.rotation.x = Math.sin(time) * 0.5; // Wobble the moon orbit

    planet2Pivot.rotation.y -= 0.15 * delta;
    planet2Gear.rotation.z += 1.0 * delta; // Gear spinning locally

    // Parallax & Mouse interaction
    currentScrollY += (targetScrollY - currentScrollY) * 0.05;
    mouseX += (targetMouseX - mouseX) * 0.05;

    // Shift the whole system gently
    orreryGroup.position.y = currentScrollY * 0.3; // Moves up as we scroll down
    orreryGroup.rotation.y = time * 0.05 + mouseX * 0.2; // Slowly spins + slight mouse pan
    orreryGroup.rotation.x = Math.sin(time * 0.2) * 0.1; // Slow breathing tilt

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
