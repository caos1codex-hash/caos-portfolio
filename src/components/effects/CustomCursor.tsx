'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || 'ontouchstart' in window) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.to(dot, {
        x: pos.x, y: pos.y,
        duration: 0.15, ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    // Smooth ring follow with lag
    gsap.ticker.add(() => {
      ringPos.x += (pos.x - ringPos.x) * 0.12;
      ringPos.y += (pos.y - ringPos.y) * 0.12;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    });

    // Hover detection with text awareness
    const onOverInteractive = () => {
      gsap.to(ring, {
        scale: 1.8,
        borderColor: 'rgba(10, 132, 255, 0.6)',
        background: 'rgba(10, 132, 255, 0.05)',
        duration: 0.3,
      });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onOverText = () => {
      gsap.to(ring, {
        scale: 2.5,
        height: 36,
        borderColor: 'rgba(10, 132, 255, 0.3)',
        duration: 0.3,
      });
      gsap.to(dot, { scale: 0, duration: 0.2 });
    };

    const onOut = () => {
      gsap.to(ring, {
        scale: 1,
        height: 32,
        borderColor: 'rgba(255,255,255,0.15)',
        background: 'transparent',
        duration: 0.3,
      });
      gsap.to(dot, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMove);

    // Setup observers
    const setupListeners = () => {
      document.querySelectorAll('[data-cursor-hover]').forEach(el => {
        el.removeEventListener('mouseenter', onOverInteractive);
        el.removeEventListener('mouseleave', onOut);
        el.addEventListener('mouseenter', onOverInteractive);
        el.addEventListener('mouseleave', onOut);
      });

      document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, label').forEach(el => {
        if ((el as HTMLElement).dataset.cursorHover) return;
        el.removeEventListener('mouseenter', onOverText);
        el.removeEventListener('mouseleave', onOut);
        el.addEventListener('mouseenter', onOverText);
        el.addEventListener('mouseleave', onOut);
      });
    };

    const observer = new MutationObserver(() => setupListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    // Delay initial setup to let DOM settle
    const timer = setTimeout(setupListeners, 1000);

    return () => {
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className='fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9998] hidden md:block'
        style={{
          willChange: 'transform',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        className='fixed top-0 left-0 w-8 h-8 rounded-full border border-white/15 pointer-events-none z-[9997] hidden md:block -translate-x-1/2 -translate-y-1/2'
        style={{
          willChange: 'transform',
          transition: 'height 0.3s ease',
        }}
      />
    </>
  );
}
