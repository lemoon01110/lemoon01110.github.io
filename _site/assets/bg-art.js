// Abstract Fluid Art Background
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.PlaneGeometry(2, 2);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Pseudo-random function
    float random(in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation
        vec2 u = f*f*(3.0-2.0*f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    // Fractional Brownian Motion
    #define OCTAVES 5
    float fbm(in vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        vec2 shift = vec2(100.0);
        // Rotate to reduce axial bias
        mat2 rot = mat2(cos(0.5), sin(0.5),
                        -sin(0.5), cos(0.50));
        for (int i = 0; i < OCTAVES; ++i) {
            value += amplitude * noise(st);
            st = rot * st * 2.0 + shift;
            amplitude *= 0.5;
        }
        return value;
    }

    void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        st.x *= uResolution.x / uResolution.y;

        vec3 color = vec3(0.0);
        
        vec2 q = vec2(0.);
        q.x = fbm( st + 0.00 * uTime);
        q.y = fbm( st + vec2(1.0));

        vec2 r = vec2(0.);
        r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
        r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

        float f = fbm(st+r);

        // Map f to a beautiful dark, abstract color palette
        // Dark background base (#0d1117) with sweeping waves of cyan and purple
        vec3 colorBg = vec3(0.05, 0.067, 0.09); // #0d1117 approx
        vec3 color1 = vec3(0.54, 0.91, 0.99); // #8be9fd cyan
        vec3 color2 = vec3(0.74, 0.57, 0.97); // #bd93f9 purple
        
        // Fluid mixing
        color = mix(colorBg, color2, clamp((f*f)*4.0, 0.0, 1.0));
        color = mix(color, color1, clamp(length(q), 0.0, 1.0));
        color = mix(color, vec3(0.1, 0.05, 0.2), clamp(length(r.x), 0.0, 1.0));
        
        // Darken the overall output slightly for a notebook vibe
        color *= 0.6;
        
        // Final smooth step to blend mostly dark with glowing ridges
        float alpha = f * f * f + 0.2;
        
        // Output with soft vignette
        vec2 pos = vUv - vec2(0.5);
        float vignette = 1.0 - dot(pos, pos) * 1.2;
        
        gl_FragColor = vec4(color * vignette, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value = clock.getElapsedTime() * 0.5; // Slow, elegant time
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });
});
