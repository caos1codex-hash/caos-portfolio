'use client';

import { useRef, useMemo, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;

  void main() {
    vColor = aColor;

    vec3 pos = position;

    // Slow drift animation
    float drift = sin(uTime * 0.15 + aPhase) * 0.3;
    pos.x += drift;
    pos.y += cos(uTime * 0.12 + aPhase * 1.3) * 0.25;
    pos.z += sin(uTime * 0.1 + aPhase * 0.7) * 0.2;

    // Mouse parallax - particles closer to camera react more
    float depth = (5.0 + pos.z) / 10.0;
    pos.x += uMouse.x * 0.4 * depth;
    pos.y += uMouse.y * 0.4 * depth;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation
    gl_PointSize = aSize * uPixelRatio * (150.0 / -mvPosition.z);
    gl_PointSize = max(gl_PointSize, 1.0);

    // Depth-based alpha for fog effect
    vAlpha = smoothstep(-8.0, -1.0, mvPosition.z) * 0.85;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Soft circular particle
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    // Glow falloff
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    float core = 1.0 - smoothstep(0.0, 0.15, dist);

    // Combine core brightness with glow
    vec3 color = vColor * glow + vec3(1.0) * core * 0.4;
    float alpha = glow * vAlpha;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  // Generate particle data (once)
  const { positions, sizes, phases, colors } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const ph = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    // Color palette: invisible (flat black background)
    const palette = [
      new THREE.Color('#000000'),
      new THREE.Color('#000000'),
      new THREE.Color('#000000'),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Distribute in a sphere-like volume
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = Math.pow(Math.random(), 0.6) * 6;

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi) - 2;

      // Varying sizes
      sz[i] = Math.random() * 3.0 + 0.5;

      // Random phase for animation offset
      ph[i] = Math.random() * Math.PI * 2;

      // Pick color from palette with slight variation
      const color = palette[Math.floor(Math.random() * palette.length)];
      const variation = 0.15;
      col[i3] = color.r + (Math.random() - 0.5) * variation;
      col[i3 + 1] = color.g + (Math.random() - 0.5) * variation;
      col[i3 + 2] = color.b + (Math.random() - 0.5) * variation;
    }

    return { positions: pos, sizes: sz, phases: ph, colors: col };
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  // Set up / tear down mouse event listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: {
        value:
          typeof window !== 'undefined'
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
    }),
    []
  );

  // Animation loop
  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Smooth mouse lerp
    smoothMouse.current.x +=
      (mouseRef.current.x - smoothMouse.current.x) * 0.05;
    smoothMouse.current.y +=
      (mouseRef.current.y - smoothMouse.current.y) * 0.05;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouse.value.set(
      smoothMouse.current.x,
      smoothMouse.current.y
    );
    materialRef.current.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );

    // Slow overall rotation
    meshRef.current.rotation.y += delta * 0.02;
    meshRef.current.rotation.x += delta * 0.005;
  });

  return (
    <points ref={meshRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={PARTICLE_COUNT}
          array={phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
