'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div className='fixed top-0 left-0 right-0 h-[2px] z-[60]'>
      <div
        ref={barRef}
        className='h-full origin-left'
        style={{
          background: 'linear-gradient(90deg, #0a84ff, #00d4ff)',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
}
