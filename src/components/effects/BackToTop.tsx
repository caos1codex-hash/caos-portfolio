'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import gsap from 'gsap';

export default function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!btnRef.current) return;
    gsap.to(btnRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : 20,
      scale: visible ? 1 : 0.8,
      duration: 0.4,
      ease: 'power3.out',
      pointerEvents: visible ? 'auto' : 'none',
    });
  }, [visible]);

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full glass flex items-center justify-center opacity-0 scale-80 group'
      aria-label='Volver arriba'
      data-cursor-hover
    >
      <ArrowUp className='w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors duration-300 group-hover:-translate-y-0.5' />
      <div className='absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300' style={{ boxShadow: '0 0 15px rgba(10,132,255,0.2)' }} />
    </button>
  );
}
