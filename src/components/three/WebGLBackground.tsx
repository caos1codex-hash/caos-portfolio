'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ─── Vertex Shader ─── */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/* ─── Fragment Shader — Enhanced CAOS Nebula ─── */
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x2_ = x_ * ns.x + ns.yyyy;
    vec4 y2_ = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x2_) - abs(y2_);
    vec4 b0 = vec4(x2_.xy, y2_.xy);
    vec4 b1 = vec4(x2_.zw, y2_.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.03;
    vec2 mouse = uMouse * 0.04;

    // Multi-layered noise for rich nebula
    float n1 = snoise(vec3(uv * 1.5 + mouse, t)) * 0.5 + 0.5;
    float n2 = snoise(vec3(uv * 3.0 - mouse * 0.5, t * 0.7)) * 0.5 + 0.5;
    float n3 = snoise(vec3(uv * 6.0, t * 0.4)) * 0.5 + 0.5;
    float n4 = snoise(vec3(uv * 12.0, t * 0.25)) * 0.5 + 0.5;

    // Combine layers with power falloff
    float nebula = n1 * 0.5 + n2 * 0.25 + n3 * 0.15 + n4 * 0.1;
    nebula = pow(nebula, 2.5) * 0.12;

    // CAOS color palette: deep space blues, cyans, purples
    vec3 col1 = vec3(0.02, 0.04, 0.12);  // Deep navy
    vec3 col2 = vec3(0.06, 0.10, 0.18);  // Dark blue
    vec3 col3 = vec3(0.08, 0.03, 0.14);  // Deep purple
    vec3 col4 = vec3(0.00, 0.08, 0.14);  // Dark cyan

    // Smooth color mixing based on noise layers
    vec3 color = mix(col1, col2, n1);
    color = mix(color, col3, nebula * 1.2);
    color = mix(color, col4, n2 * 0.3);

    // Subtle CAOS accent glow (blue/cyan)
    float accentGlow = pow(nebula, 1.5) * 0.08;
    color += vec3(0.04, 0.12, 0.20) * accentGlow;

    // Star field - multiple layers
    float stars1 = pow(n3, 16.0) * 0.5;
    float stars2 = pow(n4, 20.0) * 0.3;
    float twinkle = sin(uTime * 2.0 + n3 * 50.0) * 0.3 + 0.7;
    color += vec3(stars1 * twinkle * 0.7, stars1 * twinkle * 0.8, stars1 * twinkle);
    color += vec3(stars2 * 0.9, stars2, stars2 * 0.95);

    // Subtle nebula color bands
    float band = snoise(vec3(uv.x * 0.5, 0.0, t * 0.1)) * 0.5 + 0.5;
    color += vec3(0.01, 0.02, 0.04) * band * nebula;

    // Vignette - dramatic edge darkening
    float vignette = 1.0 - smoothstep(0.2, 1.4, length(uv - 0.5));
    color *= vignette;

    // Very subtle grain
    float grain = (fract(sin(dot(uv * uTime * 0.01, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.008;
    color += grain;

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
  }
`;

function ShaderPlane() {
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

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

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

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─── Floating particles layer ─── */
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const { positions, sizes, opacities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const op = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
      sz[i] = Math.random() * 2 + 0.5;
      op[i] = Math.random() * 0.4 + 0.1;
    }
    return { positions: pos, sizes: sz, opacities: op };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.2 + i) * 0.0005;
      arr[i * 3] += Math.cos(t * 0.15 + i * 0.5) * 0.0003;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color='#4488cc'
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function WebGLBackground() {
  return (
    <div
      className='fixed inset-0 z-0 pointer-events-none'
      aria-hidden='true'
    >
      <Canvas
        gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1] }}
        style={{ background: '#000' }}
      >
        <ShaderPlane />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
