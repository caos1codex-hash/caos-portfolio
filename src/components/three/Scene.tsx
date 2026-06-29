'use client';

import { Suspense, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';

// Lazy-load child 3D components to avoid SSR issues with Three.js
const Particles = dynamic(() => import('./Particles'), { ssr: false });
const CaosCoin = dynamic(() => import('./CaosCoin'), { ssr: false });

interface SceneContentProps {
  onCoinClick?: () => void;
}

// Loading fallback for the whole scene
function SceneLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        <span className="text-sm uppercase tracking-widest text-blue-400/60">
          Loading
        </span>
      </div>
    </div>
  );
}

// Inner component that renders the actual Canvas + 3D content
function SceneContent({ onCoinClick }: SceneContentProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#050a18', 3, 12]} />

      {/* Ambient lighting for the coin */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, 2, 4]} intensity={0.4} color="#0066ff" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#8b5cf6" distance={10} />

      <Suspense fallback={null}>
        <Particles />
        <CaosCoin onCoinClick={onCoinClick} />
      </Suspense>
    </Canvas>
  );
}

// Dynamically load the scene content with SSR disabled
// This ensures the Three.js Canvas is never rendered server-side
const DynamicSceneContent = dynamic(
  () => Promise.resolve({ default: SceneContent }),
  {
    ssr: false,
    loading: () => <SceneLoader />,
  }
);

/**
 * Main 3D Scene wrapper component.
 * Renders the particle background and CAOS coin in a fixed full-screen layer.
 * Uses dynamic imports with ssr:false to prevent Three.js SSR issues.
 *
 * @example
 * // In page.tsx, import dynamically:
 * const Scene = dynamic(() => import('@/components/three/Scene'), { ssr: false });
 */
export default function Scene({ onCoinClick }: { onCoinClick?: () => void }) {
  const [hasClicked, setHasClicked] = useState(false);

  const handleCoinClick = useCallback(() => {
    setHasClicked(true);
    onCoinClick?.();

    // Reset flash after animation
    setTimeout(() => setHasClicked(false), 2000);
  }, [onCoinClick]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    >
      {/* The canvas needs pointer events for coin interaction */}
      <div className="pointer-events-auto h-full w-full">
        <DynamicSceneContent onCoinClick={handleCoinClick} />
      </div>

      {/* Screen flash effect on coin click */}
      {hasClicked && (
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-blue-500/10" />
      )}
    </div>
  );
}
