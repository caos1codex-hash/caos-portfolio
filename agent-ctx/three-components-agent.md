# Task: Create 3D Components for CAOS Portfolio

## Agent: three-components

## Summary
Created three premium 3D components for the CAOS portfolio using React Three Fiber, Three.js, and @react-three/drei.

## Files Created

### 1. `/home/z/my-project/src/components/three/Particles.tsx`
- Custom GLSL vertex + fragment shaders for premium glowing particles
- 2000 particles distributed in a sphere-like volume
- Colors cycle between blue (#0066ff), purple (#8b5cf6), cyan (#00ffff)
- Mouse parallax effect (particles closer to camera react more)
- Slow drift animation with per-particle phase offsets
- Depth-based alpha for fog effect
- Additive blending for glow
- Size attenuation based on camera distance

### 2. `/home/z/my-project/src/components/three/CaosCoin.tsx`
- CylinderGeometry coin (radius 1.2, height 0.15, 64 segments)
- MeshStandardMaterial with metalness=1, roughness=0.1 (chrome look)
- Environment preset="night" for reflections
- "CAOS" text on top face, "M.A.C.V." on bottom
- Decorative ring details (outer blue, inner purple)
- Slow continuous Y-axis rotation (0.6 rad/s, 1.8 on hover)
- Mouse following with smooth lerp (subtle tilt)
- Float from drei for gentle floating animation
- Click: 3-phase explosion effect (expand → burst particles → return)
- Blue glow effect (emissive with intensity boost on hover/click)
- onCoinClick callback for parent communication

### 3. `/home/z/my-project/src/components/three/Scene.tsx`
- Dynamic import wrapper with ssr:false for all Three.js components
- Canvas with camera position [0, 0, 5], fov 60
- Black background with fog (depth 3-12)
- Multi-light setup (ambient + directional + point lights)
- Suspense for loading states
- Fixed full-screen div with pointer-events-none and z-index 0
- pointer-events-auto on canvas for coin interaction
- Screen flash effect on coin click

## Technical Decisions
- Used `dynamic(() => Promise.resolve({ default: Component }))` pattern for SSR protection
- State-driven burst particle visibility (burstActive) to avoid React 19 ref-during-render lint errors
- Additive blending on particles for premium glow effect
- Performance: pre-allocated Float32Arrays, minimal useFrame work
- All components use 'use client' directive

## Verification
- ESLint: 0 errors, 0 warnings
- Dev server: compiles successfully
