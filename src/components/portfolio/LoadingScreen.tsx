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
  const barRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          filter: 'blur(12px)',
          scale: 1.05,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete,
        });
      },
    });

    // Letters appear
    tl.fromTo(
      lettersRef.current,
      { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.8 },
      { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      0.3
    );

    // Subtitle
    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      1.0
    );

    // Progress bar
    tl.fromTo(
      barFillRef.current,
      { width: '0%' },
      { width: '100%', duration: 2.8, ease: 'power1.inOut' },
      0.2
    );

    return () => { tl.kill(); };
  }, [onComplete]);

  const letters = ['C', 'A', 'O', 'S'];

  return (
    <div
      ref={containerRef}
      className='fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none'
      style={{
        background: '#000000',
      }}
    >
      {/* Ambient glow behind letters */}
      <div className='absolute w-64 h-64 rounded-full blur-[100px] opacity-20'
        style={{ background: 'radial-gradient(circle, #1e90ff 0%, transparent 70%)' }}
      />

      {/* Letters */}
      <div className='flex items-center tracking-[0.3em] relative z-10'>
        {letters.map((letter, i) => (
          <span
            key={i}
            ref={(el) => { if (el) lettersRef.current[i] = el; }}
            className='text-7xl sm:text-8xl md:text-9xl font-bold text-white'
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              textShadow: '0 0 40px rgba(30, 144, 255, 0.3)',
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className='mt-6 text-xs sm:text-sm tracking-[0.5em] uppercase text-white/30 relative z-10'
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        From Chaos to Code.
      </p>

      {/* Progress bar - spatial blue */}
      <div ref={barRef} className='absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03]'>
        <div
          ref={barFillRef}
          className='h-full'
          style={{
            background: 'linear-gradient(90deg, #1e90ff, #00d4ff)',
            boxShadow: '0 0 8px rgba(30, 144, 255, 0.4)',
          }}
        />
      </div>
    </div>
  );
}