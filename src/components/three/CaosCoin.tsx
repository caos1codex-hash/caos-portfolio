'use client';

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface CaosCoinProps {
  onCoinClick?: () => void;
}

interface BurstParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

const BURST_COUNT = 60;

export default function CaosCoin({ onCoinClick }: CaosCoinProps) {
  const coinRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [burstActive, setBurstActive] = useState(false);

  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const targetRotation = useRef(0);
  const explosionScale = useRef(1);
  const explosionPhase = useRef(0);
  const burstParticles = useRef<BurstParticle[]>([]);
  const burstPointsRef = useRef<THREE.Points>(null);

  // Handle mouse move for parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [handleMouseMove]);

  // Handle click explosion
  const handleClick = useCallback(() => {
    if (explosionPhase.current !== 0) return;

    setClicked(true);
    explosionPhase.current = 1;

    // Create burst particles
    const newParticles: BurstParticle[] = [];

    for (let i = 0; i < BURST_COUNT; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();

      newParticles.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: dir.multiplyScalar(2 + Math.random() * 3),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.8,
        size: 0.03 + Math.random() * 0.06,
      });
    }
    burstParticles.current = newParticles;
    setBurstActive(true);

    // Emit event to parent
    onCoinClick?.();

    // Reset after animation
    setTimeout(() => {
      setClicked(false);
    }, 1500);
  }, [onCoinClick]);

  // Cursor style
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.cursor = hovered ? 'pointer' : 'default';
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.cursor = 'default';
      }
    };
  }, [hovered]);

  // Animation
  useFrame((state, delta) => {
    if (!coinRef.current || !innerRef.current) return;

    const time = state.clock.elapsedTime;

    // Smooth mouse lerp for coin following
    smoothMouse.current.x +=
      (mouseRef.current.x - smoothMouse.current.x) * 0.03;
    smoothMouse.current.y +=
      (mouseRef.current.y - smoothMouse.current.y) * 0.03;

    // Coin follows mouse with subtle tilt
    coinRef.current.rotation.x = smoothMouse.current.y * 0.3;
    coinRef.current.rotation.z = -smoothMouse.current.x * 0.15;

    // Continuous Y rotation - faster on hover
    const rotationSpeed = hovered ? 1.8 : 0.6;
    targetRotation.current += delta * rotationSpeed;
    innerRef.current.rotation.y = targetRotation.current;

    // Explosion animation phases
    if (explosionPhase.current === 1) {
      explosionScale.current += delta * 8;
      if (explosionScale.current >= 1.5) {
        explosionPhase.current = 2;
        explosionScale.current = 1.5;
      }
    } else if (explosionPhase.current === 2) {
      explosionScale.current -= delta * 3;
      if (explosionScale.current <= 1.0) {
        explosionScale.current = 1.0;
        explosionPhase.current = 3;
      }
    } else if (explosionPhase.current === 3) {
      explosionScale.current +=
        (1.0 - explosionScale.current) * delta * 5;
      if (Math.abs(explosionScale.current - 1.0) < 0.01) {
        explosionScale.current = 1.0;
        explosionPhase.current = 0;
      }
    }

    innerRef.current.scale.setScalar(explosionScale.current);

    // Emissive glow - stronger on hover, pulse on click
    if (materialRef.current) {
      const baseEmissive = hovered ? 0.4 : 0.15;
      const clickBoost = clicked ? Math.sin(time * 15) * 0.3 + 0.3 : 0;
      materialRef.current.emissiveIntensity = baseEmissive + clickBoost;
    }

    // Glow ring scale
    if (glowRef.current) {
      const glowScale = hovered ? 1.25 : 1.1;
      const pulseScale = 1 + Math.sin(time * 2) * 0.03;
      glowRef.current.scale.setScalar(glowScale * pulseScale);
    }

    // Update burst particles
    if (burstActive && burstPointsRef.current) {
      const positions = burstPointsRef.current.geometry.attributes.position;
      let allDead = true;

      for (let i = 0; i < burstParticles.current.length; i++) {
        const p = burstParticles.current[i];
        p.life += delta;

        if (p.life < p.maxLife) {
          allDead = false;
          const t = p.life / p.maxLife;

          // Update position with deceleration
          p.position.addScaledVector(p.velocity, delta * (1 - t * 0.5));

          // Slight gravity
          p.velocity.y -= delta * 2;

          if (positions) {
            positions.setXYZ(
              i,
              p.position.x,
              p.position.y,
              p.position.z
            );
          }
        } else {
          if (positions) {
            positions.setXYZ(i, 0, -100, 0); // hide dead particles
          }
        }
      }

      if (positions) {
        positions.needsUpdate = true;
      }

      if (allDead) {
        burstParticles.current = [];
        setBurstActive(false);
      }
    }
  });

  // Burst particle geometry data - always allocated, visibility controlled by burstActive state
  const burstPositions = useMemo(
    () => new Float32Array(BURST_COUNT * 3),
    []
  );
  const burstSizes = useMemo(
    () => new Float32Array(BURST_COUNT).fill(0.05),
    []
  );

  return (
    <>
      <Float
        speed={2}
        rotationIntensity={0.2}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        <group ref={coinRef}>
          <group ref={innerRef}>
            {/* Main coin body */}
            <mesh
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={handleClick}
            >
              <cylinderGeometry args={[1.2, 1.2, 0.15, 64]} />
              <meshStandardMaterial
                ref={materialRef}
                color="#c0c0c0"
                metalness={1}
                roughness={0.1}
                emissive="#0066ff"
                emissiveIntensity={0.15}
                envMapIntensity={1.5}
              />
            </mesh>

            {/* CAOS text on top face */}
            <Text
              position={[0, 0.076, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.45}
              color="#0066ff"
              anchorX="center"
              anchorY="middle"
              font={undefined}
              letterSpacing={0.15}
              outlineWidth={0.01}
              outlineColor="#003388"
            >
              CAOS
            </Text>

            {/* Outer ring detail on top face */}
            <mesh
              position={[0, 0.076, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.95, 1.0, 64]} />
              <meshStandardMaterial
                color="#0066ff"
                metalness={0.9}
                roughness={0.2}
                emissive="#0044cc"
                emissiveIntensity={0.3}
                transparent
                opacity={0.6}
              />
            </mesh>

            {/* Inner ring detail on top face */}
            <mesh
              position={[0, 0.076, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.5, 0.53, 64]} />
              <meshStandardMaterial
                color="#8b5cf6"
                metalness={0.9}
                roughness={0.2}
                emissive="#6d3fd0"
                emissiveIntensity={0.2}
                transparent
                opacity={0.4}
              />
            </mesh>

            {/* Bottom face text */}
            <Text
              position={[0, -0.076, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              fontSize={0.25}
              color="#8b5cf6"
              anchorX="center"
              anchorY="middle"
              font={undefined}
              letterSpacing={0.1}
            >
              M.A.C.V.
            </Text>

            {/* Glow disc behind coin */}
            <mesh ref={glowRef} rotation={[0, 0, 0]}>
              <circleGeometry args={[1.5, 64]} />
              <meshBasicMaterial
                color="#0066ff"
                transparent
                opacity={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      </Float>

      {/* Burst particles - always mounted, controlled by burstActive state */}
      <points ref={burstPointsRef} visible={burstActive}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={BURST_COUNT}
            array={burstPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-aBurstSize"
            count={BURST_COUNT}
            array={burstSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#0066ff"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Environment for reflections */}
      <Environment preset="night" />
    </>
  );
}
