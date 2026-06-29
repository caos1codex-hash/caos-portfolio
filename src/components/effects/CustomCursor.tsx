'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailDot {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

type CursorVariant = 'default' | 'hover' | 'click' | 'text';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const outerPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const trailRef = useRef<TrailDot[]>([]);
  const trailIdRef = useRef(0);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [trailDots, setTrailDots] = useState<TrailDot[]>([]);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const LERP_OUTER = 0.12;
  const LERP_INNER = 0.85;
  const TRAIL_MAX = 12;
  const TRAIL_FADE = 0.06;

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const addTrailDot = useCallback((x: number, y: number) => {
    const id = trailIdRef.current++;
    trailRef.current = [
      { id, x, y, opacity: 0.5 },
      ...trailRef.current.slice(0, TRAIL_MAX - 1),
    ];
  }, []);

  useEffect(() => {
    // Detect mobile/touch device
    const checkMobile = () => {
      const mobile =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };
    const initiallyMobile = checkMobile();
    window.addEventListener('resize', checkMobile);

    if (initiallyMobile) return;

    // Hide default cursor globally
    const style = document.createElement('style');
    style.id = 'custom-cursor-style';
    style.textContent = `
      * { cursor: none !important; }
      a, button, [data-cursor-hover], [role="button"], input, textarea, select, label[for] { cursor: none !important; }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      addTrailDot(e.clientX, e.clientY);
    };

    const handleMouseDown = () => setVariant('click');
    const handleMouseUp = () => setVariant('default');
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Interactive element hover detection
    const handleInteractiveEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover], [role="button"], input, textarea, select')) {
        setVariant('hover');
      }
      if (target.closest('p, h1, h2, h3, h4, h5, h6, span[class*="text"], [data-cursor-text]')) {
        setVariant('text');
      }
    };
    const handleInteractiveLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor-hover], [role="button"], input, textarea, select, p, h1, h2, h3, h4, h5, h6, [data-cursor-text]')) {
        setVariant('default');
      }
    };

    document.addEventListener('mouseover', handleInteractiveEnter);
    document.addEventListener('mouseout', handleInteractiveLeave);

    // Animation loop
    const animate = () => {
      if (innerRef.current) {
        const ix = lerp(
          parseFloat(innerRef.current.style.left || '-100'),
          posRef.current.x,
          LERP_INNER
        );
        const iy = lerp(
          parseFloat(innerRef.current.style.top || '-100'),
          posRef.current.y,
          LERP_INNER
        );
        innerRef.current.style.left = `${ix}px`;
        innerRef.current.style.top = `${iy}px`;
      }

      if (outerRef.current) {
        outerPosRef.current.x = lerp(
          outerPosRef.current.x,
          posRef.current.x,
          LERP_OUTER
        );
        outerPosRef.current.y = lerp(
          outerPosRef.current.y,
          posRef.current.y,
          LERP_OUTER
        );
        outerRef.current.style.left = `${outerPosRef.current.x}px`;
        outerRef.current.style.top = `${outerPosRef.current.y}px`;
      }

      // Fade trail dots
      trailRef.current = trailRef.current
        .map((dot) => ({ ...dot, opacity: dot.opacity - TRAIL_FADE }))
        .filter((dot) => dot.opacity > 0);

      setTrailDots([...trailRef.current]);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleInteractiveEnter);
      document.removeEventListener('mouseout', handleInteractiveLeave);
      window.removeEventListener('resize', checkMobile);
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [addTrailDot]);

  if (isMobile) return null;

  // Outer ring variants
  const outerVariants = {
    default: {
      width: 40,
      height: 40,
      x: -20,
      y: -20,
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.5)',
      borderRadius: '50%',
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
    },
    hover: {
      width: 64,
      height: 64,
      x: -32,
      y: -32,
      borderWidth: 2,
      borderColor: '#0066ff',
      borderRadius: '50%',
      scaleX: 1,
      scaleY: 1,
      opacity: 0.6,
    },
    click: {
      width: 32,
      height: 32,
      x: -16,
      y: -16,
      borderWidth: 2,
      borderColor: '#0066ff',
      borderRadius: '50%',
      scaleX: 0.9,
      scaleY: 0.9,
      opacity: 0.8,
    },
    text: {
      width: 3,
      height: 48,
      x: -1.5,
      y: -24,
      borderWidth: 0,
      borderColor: 'rgba(255,255,255,0.8)',
      borderRadius: '2px',
      scaleX: 1,
      scaleY: 1,
      opacity: 0.9,
    },
  };

  // Inner dot variants
  const innerVariants = {
    default: {
      width: 6,
      height: 6,
      x: -3,
      y: -3,
      scale: 1,
      backgroundColor: '#ffffff',
    },
    hover: {
      width: 6,
      height: 6,
      x: -3,
      y: -3,
      scale: 0.5,
      backgroundColor: '#0066ff',
    },
    click: {
      width: 6,
      height: 6,
      x: -3,
      y: -3,
      scale: 0.3,
      backgroundColor: '#0066ff',
    },
    text: {
      width: 3,
      height: 3,
      x: -1.5,
      y: -1.5,
      scale: 1,
      backgroundColor: '#ffffff',
    },
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Glow trail dots */}
          {trailDots.map((dot) => (
            <div
              key={dot.id}
              style={{
                position: 'fixed',
                top: dot.y,
                left: dot.x,
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: `rgba(0, 102, 255, ${dot.opacity * 0.6})`,
                boxShadow: `0 0 6px rgba(0, 102, 255, ${dot.opacity * 0.4})`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                zIndex: 9998,
              }}
            />
          ))}

          {/* Outer ring */}
          <motion.div
            ref={outerRef}
            variants={outerVariants}
            animate={variant}
            initial="default"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              mass: 0.5,
            }}
            style={{
              position: 'fixed',
              top: -100,
              left: -100,
              borderStyle: 'solid',
              pointerEvents: 'none',
              zIndex: 9999,
              willChange: 'transform, left, top',
              mixBlendMode: 'difference',
            }}
          />

          {/* Inner dot */}
          <motion.div
            ref={innerRef}
            variants={innerVariants}
            animate={variant}
            initial="default"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 28,
              mass: 0.3,
            }}
            style={{
              position: 'fixed',
              top: -100,
              left: -100,
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9999,
              willChange: 'transform, left, top',
              mixBlendMode: 'difference',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
