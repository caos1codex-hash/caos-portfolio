'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Star Field Particles ─── */
function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  const STAR_COUNT = 2500;

  const { positions, sizes, twinkleSpeeds, twinkleOffsets } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const twinkleSpeeds = new Float32Array(STAR_COUNT);
    const twinkleOffsets = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute stars across the full viewport plane
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // Varied star sizes
      sizes[i] = Math.random() * 2.5 + 0.3;

      // Twinkle params
      twinkleSpeeds[i] = Math.random() * 1.5 + 0.3;
      twinkleOffsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, sizes, twinkleSpeeds, twinkleOffsets };
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aTwinkleSpeed;
        attribute float aTwinkleOffset;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vAlpha;
        varying float vSize;

        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

          // Twinkle
          float twinkle = sin(uTime * aTwinkleSpeed + aTwinkleOffset) * 0.5 + 0.5;
          twinkle = mix(0.2, 1.0, twinkle);
          vAlpha = twinkle;
          vSize = aSize;

          gl_PointSize = aSize * uPixelRatio * (200.0 / -mvPosition.z);
          gl_PointSize = max(gl_PointSize, 0.5);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        varying float vSize;

        void main() {
          // Circular point with soft glow
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Soft glow falloff
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);

          // Color: white core with subtle blue tint on larger stars
          vec3 coreColor = vec3(1.0, 1.0, 1.0);
          vec3 blueTint = vec3(0.7, 0.85, 1.0);
          vec3 color = mix(coreColor, blueTint, smoothstep(1.0, 2.5, vSize) * 0.3);

          gl_FragColor = vec4(color, glow * vAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Mouse tracking for parallax
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    // Subtle parallax with mouse
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.02;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.02;
    pointsRef.current.rotation.x = smoothMouse.current.y * 0.03;
    pointsRef.current.rotation.y = smoothMouse.current.x * 0.03;
  });

  return (
    <points ref={pointsRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[positions, 3]}
          count={STAR_COUNT}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-aSize'
          args={[sizes, 1]}
          count={STAR_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach='attributes-aTwinkleSpeed'
          args={[twinkleSpeeds, 1]}
          count={STAR_COUNT}
          itemSize={1}
        />
        <bufferAttribute
          attach='attributes-aTwinkleOffset'
          args={[twinkleOffsets, 1]}
          count={STAR_COUNT}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

/* ─── Distant Nebula Dust (very subtle) ─── */
function NebulaDust() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uResolution.value.set(
      state.gl.domElement.width,
      state.gl.domElement.height
    );

    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.015;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.015;
    mat.uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y);
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          uniform float uTime;
          uniform vec2 uResolution;
          uniform vec2 uMouse;
          varying vec2 vUv;

          // Simple hash for pseudo-random
          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }

          // Value noise
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }

          void main() {
            vec2 uv = vUv;
            float t = uTime * 0.015;

            vec2 mouse = uMouse * 0.02;

            // Very subtle nebula dust - barely visible
            float n = noise(uv * 3.0 + mouse + t);
            n += noise(uv * 6.0 - mouse * 0.5 + t * 0.7) * 0.5;

            // Only a faint whisper of blue
            float nebula = pow(n / 1.5, 4.0) * 0.04;

            vec3 color = vec3(0.0);
            color += vec3(0.02, 0.06, 0.12) * nebula; // Deep spatial blue

            // Very subtle vignette
            float vignette = 1.0 - smoothstep(0.4, 1.4, length(uv - 0.5));
            color *= vignette;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function WebGLBackground() {
  return (
    <div
      className='fixed inset-0 z-0 pointer-events-none'
      aria-hidden='true'
      style={{ background: '#000000' }}
    >
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1] }}
        style={{ background: '#000000' }}
      >
        <NebulaDust />
        <StarField />
      </Canvas>
    </div>
  );
}