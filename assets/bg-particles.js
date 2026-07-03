// Interactive Spheres background using Three.js (InstancedMesh)
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x111111, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    // Add subtle ambient and directional light for the spheres
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 2);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xbd93f9, 1, 300); // Dracula Purple glow
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    // Create instanced mesh for spheres
    const sphereCount = 300;
    const geometry = new THREE.SphereGeometry(2, 16, 16);
    
    // Use standard material for lighting reaction
    const material = new THREE.MeshStandardMaterial({
        color: '#ff79c6', // Dracula Pink base
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.7
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, sphereCount);
    
    const dummy = new THREE.Object3D();
    const sphereData = [];
    const color = new THREE.Color();
    const cyan = new THREE.Color('#8be9fd'); // Dracula Cyan
    const pink = new THREE.Color('#ff79c6'); // Dracula Pink

    for (let i = 0; i < sphereCount; i++) {
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 200;
        
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);

        // Mix colors randomly between pink and cyan
        color.lerpColors(pink, cyan, Math.random());
        instancedMesh.setColorAt(i, color);

        sphereData.push({
            originX: x,
            originY: y,
            originZ: z,
            targetScale: 1.0,
            currentScale: 1.0,
            velocity: {
                x: (Math.random() - 0.5) * 0.1,
                y: (Math.random() - 0.5) * 0.1,
                z: (Math.random() - 0.5) * 0.1
            }
        });
    }

    scene.add(instancedMesh);

    // Mouse interaction variables
    const mouse = new THREE.Vector2(-1000, -1000);
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    
    // Raycaster for interactability
    const raycaster = new THREE.Raycaster();
    const mathPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePoint3D = new THREE.Vector3(-1000, -1000, 0);

    document.addEventListener('mousemove', (event) => {
        // Normalized device coordinates for raycaster
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // Parallax camera movement
        const targetCamX = mouse.x * 20;
        const targetCamY = mouse.y * 20;
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Get 3D mouse position
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(mathPlane, mousePoint3D);

        // Animate instances
        for (let i = 0; i < sphereCount; i++) {
            const data = sphereData[i];
            
            // Slow floating drift
            data.originX += data.velocity.x;
            data.originY += data.velocity.y;
            data.originZ += data.velocity.z;

            // Bounce off arbitrary bounds
            if (Math.abs(data.originX) > 200) data.velocity.x *= -1;
            if (Math.abs(data.originY) > 200) data.velocity.y *= -1;
            if (Math.abs(data.originZ) > 100) data.velocity.z *= -1;

            // Add sine wave bobbing
            const bobbing = Math.sin(time * 2 + i) * 5;
            
            // Check distance to mouse
            const dx = data.originX - mousePoint3D.x;
            const dy = data.originY + bobbing - mousePoint3D.y; // approximate Y distance including bobbing
            // We ignore Z for hover distance to make it easier to hit
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Interaction: if close to mouse, expand greatly and dodge slightly
            if (dist < 60) {
                data.targetScale = 3.5; // Expand significantly (like tilt card)
            } else {
                data.targetScale = 1.0;
            }

            // Smooth scale transition
            data.currentScale += (data.targetScale - data.currentScale) * 0.1;

            // Apply transformations
            dummy.position.set(data.originX, data.originY + bobbing, data.originZ);
            
            // Add a subtle rotation to the individual spheres
            dummy.rotation.x = time * 0.5 + i;
            dummy.rotation.y = time * 0.3 + i;

            dummy.scale.set(data.currentScale, data.currentScale, data.currentScale);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        // Must set this to true to update instances each frame
        instancedMesh.instanceMatrix.needsUpdate = true;

        // Slowly rotate entire field
        instancedMesh.rotation.y = time * 0.05;
        instancedMesh.rotation.x = time * 0.02;

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
