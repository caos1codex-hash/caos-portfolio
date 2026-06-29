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
      className='fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 translate-y-5'
      aria-label='Volver arriba'
      data-cursor-hover
    >
      <ArrowUp className='w-4 h-4 text-white/40' />
    </button>
  );
}
