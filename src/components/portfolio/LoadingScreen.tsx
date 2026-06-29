'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LETTERS = ['C', 'A', 'O', 'S'];
const PARTICLE_COUNT = 48;

// ─── Easing Curves ───────────────────────────────────────────────────────────
const cinematicEase = [0.22, 1, 0.36, 1] as const;
const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'entering' | 'sweep' | 'scatter' | 'dissolve' | 'gone'>('entering');

  // ─── Pre-generate particle data (stable across renders) ──────────────────
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 1.2;
        const speed = 60 + Math.random() * 280;
        return {
          id: i,
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 3.5,
          duration: 0.5 + Math.random() * 0.9,
          delay: Math.random() * 0.2,
          color: Math.random() > 0.35 ? '#00ff88' : Math.random() > 0.5 ? '#ffffff' : '#4dffaa',
          opacity: 0.6 + Math.random() * 0.4,
        };
      }),
    [],
  );

  // ─── Phase timeline ─────────────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('sweep'), 1600),
      setTimeout(() => setPhase('scatter'), 2100),
      setTimeout(() => setPhase('dissolve'), 2600),
      setTimeout(() => setPhase('gone'), 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (phase === 'gone') {
      handleComplete();
    }
  }, [phase, handleComplete]);

  // ─── Progress ───────────────────────────────────────────────────────────
  const progressDuration = 3.1; // matches total animation length

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black select-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={
            phase === 'dissolve'
              ? { opacity: 0, scale: 1.08, filter: 'blur(12px)' }
              : { opacity: 1, scale: 1, filter: 'blur(0px)' }
          }
          transition={{ duration: 0.5, ease: cinematicEase }}
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {/* ─── Atmospheric background glow ──────────────────────────── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            {/* Central blue glow */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '600px',
                height: '300px',
                background:
                  'radial-gradient(ellipse at center, rgba(0,255,136,0.12) 0%, rgba(0,255,136,0.04) 40%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Subtle top vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
              }}
            />
          </motion.div>

          {/* ─── Text container ───────────────────────────────────────── */}
          <div className="relative">
            {/* Glow bloom behind text — appears after all letters */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: '120%',
                height: '200%',
                background:
                  'radial-gradient(ellipse at center, rgba(0,255,136,0.25) 0%, transparent 60%)',
                filter: 'blur(60px)',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.0, ease: smoothEase }}
            />

            {/* Letter row with overflow-clip for the sweep */}
            <div className="relative overflow-hidden px-4">
              <div className="flex items-center justify-center tracking-[0.3em]">
                {LETTERS.map((letter, i) => (
                  <motion.span
                    key={letter}
                    className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold text-white inline-block"
                    style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      textShadow: `
                        0 0 10px rgba(0,255,136,0.9),
                        0 0 30px rgba(0,255,136,0.6),
                        0 0 60px rgba(0,255,136,0.35),
                        0 0 110px rgba(0,255,136,0.15)
                      `,
                      willChange: 'transform, opacity, filter',
                    }}
                    initial={{
                      opacity: 0,
                      scale: 0.4,
                      y: 50,
                      filter: 'blur(12px)',
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.22 + 0.15,
                      ease: cinematicEase,
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* ─── Light sweep ─────────────────────────────────────── */}
              {phase === 'sweep' && (
                <motion.div
                  className="absolute inset-0 pointer-events-none z-10"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.9, ease: cinematicEase }}
                  style={{
                    background: `linear-gradient(
                      90deg,
                      transparent 0%,
                      rgba(255,255,255,0.05) 20%,
                      rgba(255,255,255,0.3) 40%,
                      rgba(255,255,255,0.95) 48%,
                      rgba(200,220,255,1) 50%,
                      rgba(255,255,255,0.95) 52%,
                      rgba(255,255,255,0.3) 60%,
                      rgba(255,255,255,0.05) 80%,
                      transparent 100%
                    )`,
                    width: '60%',
                    filter: 'blur(1px)',
                  }}
                />
              )}
            </div>

            {/* ─── Subtitle ─────────────────────────────────────────── */}
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2, ease: smoothEase }}
            >
              <span
                className="text-xs sm:text-sm tracking-[0.5em] uppercase"
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                Creative Developer
              </span>
            </motion.div>
          </div>

          {/* ─── Particles ───────────────────────────────────────────── */}
          {(phase === 'scatter' || phase === 'dissolve') &&
            particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}40`,
                  left: '50%',
                  top: '50%',
                  willChange: 'transform, opacity',
                }}
                initial={{ x: 0, y: 0, opacity: p.opacity, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.2 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            ))}

          {/* ─── Progress bar ────────────────────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03]">
            <motion.div
              className="h-full"
              style={{
                background:
                  'linear-gradient(90deg, transparent, #00ff88 20%, #00ff88 80%, transparent)',
                boxShadow:
                  '0 0 8px rgba(0,255,136,0.6), 0 0 20px rgba(0,255,136,0.3), 0 0 40px rgba(0,255,136,0.15)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: progressDuration, ease: 'linear' }}
            />
          </div>

          {/* ─── Edge vignette ───────────────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
