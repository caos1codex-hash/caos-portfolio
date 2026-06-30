'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          filter: 'blur(16px)',
          scale: 1.05,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete,
        });
      },
    });

    // Glow pulse
    tl.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
      0
    );

    // Letters appear with stagger
    tl.fromTo(
      lettersRef.current,
      { opacity: 0, y: 50, filter: 'blur(12px)', scale: 0.7 },
      { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.9, stagger: 0.15, ease: 'power3.out' },
      0.3
    );

    // Subtitle
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 15, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
      1.2
    );

    // Particles
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      tl.fromTo(
        particles,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.02, ease: 'power2.out' },
        0.5
      );
    }

    // Progress bar
    tl.fromTo(
      barFillRef.current,
      { width: '0%' },
      { width: '100%', duration: 3.0, ease: 'power1.inOut' },
      0.2
    );

    // Glow pulse continuously
    gsap.to(glowRef.current, {
      scale: 1.15,
      opacity: 0.6,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  const letters = ['C', 'A', 'O', 'S'];

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none overflow-hidden'
    >
      {/* Background glow */}
      <div
        ref={glowRef}
        className='absolute w-64 h-64 rounded-full opacity-0'
        style={{
          background: 'radial-gradient(circle, rgba(10,132,255,0.15) 0%, rgba(0,212,255,0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Floating particles */}
      <div ref={particlesRef} className='absolute inset-0 pointer-events-none'>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className='absolute rounded-full bg-white'
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Letters */}
      <div className='relative flex items-center tracking-[0.3em]'>
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { if (el) lettersRef.current[i] = el; }}
            className='text-7xl sm:text-8xl md:text-9xl font-bold'
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 40px rgba(10,132,255,0.2))',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className='relative mt-6 text-xs sm:text-sm tracking-[0.5em] uppercase text-white/25'
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        From Chaos to Code.
      </p>

      {/* Progress bar */}
      <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03]'>
        <div
          ref={barFillRef}
          className='h-full'
          style={{
            background: 'linear-gradient(90deg, #0a84ff, #00d4ff, #8b5cf6)',
            boxShadow: '0 0 12px rgba(10,132,255,0.5), 0 0 30px rgba(0,212,255,0.2)',
          }}
        />
      </div>
    </div>
  );
}
