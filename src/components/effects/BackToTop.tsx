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
      duration: 0.4,
      ease: 'power3.out',
      pointerEvents: visible ? 'auto' : 'none',
    });
  }, [visible]);

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='fixed bottom-9 right-9 z-50 w-15 h-15 rounded-2xl liquid-glass-btn flex items-center justify-center opacity-0 translate-y-5'
      aria-label='Volver arriba'
      data-cursor-hover
    >
      <ArrowUp className='w-6 h-6 text-white/40' />
    </button>
  );
}