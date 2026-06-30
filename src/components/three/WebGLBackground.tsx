'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Star Field — tiny pinpoint stars on pure black ─── */
function StarField() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  const STAR_COUNT = 1800;

  const { positions, sizes, twinkleSpeeds, twinkleOffsets } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const twinkleSpeeds = new Float32Array(STAR_COUNT);
    const twinkleOffsets = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Spread across full viewport
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = -Math.random() * 3 - 0.5; // behind camera plane

      // Most stars tiny, a few medium
      const r = Math.random();
      if (r < 0.85) {
        sizes[i] = Math.random() * 0.8 + 0.2; // tiny
      } else if (r < 0.97) {
        sizes[i] = Math.random() * 1.5 + 0.8; // medium
      } else {
        sizes[i] = Math.random() * 1.0 + 1.8; // bright few
      }

      twinkleSpeeds[i] = Math.random() * 1.2 + 0.2;
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

          // Gentle twinkle
          float twinkle = sin(uTime * aTwinkleSpeed + aTwinkleOffset) * 0.5 + 0.5;
          twinkle = mix(0.15, 0.85, twinkle);
          vAlpha = twinkle;
          vSize = aSize;

          // Keep stars small — divide by larger factor
          gl_PointSize = aSize * uPixelRatio * (60.0 / -mvPosition.z);
          gl_PointSize = max(gl_PointSize, 0.5);
          gl_PointSize = min(gl_PointSize, 4.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying float vAlpha;
        varying float vSize;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Sharp point falloff
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 2.0);

          // Pure white stars, no color tint
          vec3 color = vec3(0.9, 0.92, 1.0);

          gl_FragColor = vec4(color, glow * vAlpha * 0.7);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * 0.02;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * 0.02;
    pointsRef.current.rotation.x = smoothMouse.current.y * 0.015;
    pointsRef.current.rotation.y = smoothMouse.current.x * 0.015;
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

export default function WebGLBackground() {
  return (
    <div
      className='fixed inset-0 z-0 pointer-events-none'
      aria-hidden='true'
      style={{ background: '#000000' }}
    >
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        dpr={[1, 1]}
        camera={{ position: [0, 0, 1] }}
        style={{ background: '#000000' }}
      >
        <color attach='background' args={['#000000']} />
        <StarField />
      </Canvas>
    </div>
  );
}