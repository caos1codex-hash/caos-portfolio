'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on touch devices
    if (typeof window === 'undefined' || 'ontouchstart' in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.1, ease: 'power2.out' });
    };

    // Smooth ring follow
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.15;
      ringPos.y += (pos.y - ringPos.y) * 0.15;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    });

    // Hover detection - spatial blue
    const onOver = () => gsap.to(ring, { scale: 1.5, borderColor: '#1e90ff', duration: 0.3 });
    const onOut = () => gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.15)', duration: 0.3 });

    window.addEventListener('mousemove', onMove);

    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-cursor-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onOver);
        el.removeEventListener('mouseleave', onOut);
        el.addEventListener('mouseenter', onOver);
        el.addEventListener('mouseleave', onOut);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('[data-cursor-hover]').forEach(el => {
      el.addEventListener('mouseenter', onOver);
      el.addEventListener('mouseleave', onOut);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className='fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9998] hidden md:block'
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className='fixed top-0 left-0 w-8 h-8 rounded-full border border-white/15 pointer-events-none z-[9997] hidden md:block -translate-x-1/2 -translate-y-1/2'
        style={{ willChange: 'transform' }}
      />
    </>
  );
}