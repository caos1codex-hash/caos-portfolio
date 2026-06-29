'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to create GSAP animations with automatic cleanup.
 * Returns a ref to attach to the animated element.
 */
export function useGsapFadeIn(
  options?: {
    delay?: number;
    duration?: number;
    y?: number;
    blur?: number;
    start?: string;
    once?: boolean;
  }
) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    delay = 0,
    duration = 1,
    y = 40,
    blur = 6,
    start = 'top 85%',
    once = true,
  } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y, filter: `blur(${blur}px)` });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          delay,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [delay, duration, y, blur, start, once]);

  return ref;
}

/**
 * Hook to animate a counter from 0 to a target value.
 */
export function useGsapCounter(
  target: number,
  options?: { duration?: number; start?: string }
) {
  const ref = useRef<HTMLSpanElement>(null);
  const { duration = 2, start = 'top 85%' } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          value: target,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.value).toLocaleString();
          },
        });
      },
    });

    return () => trigger.kill();
  }, [target, duration, start]);

  return ref;
}

/**
 * Hook for staggered children animation.
 */
export function useGsapStagger(
  options?: {
    stagger?: number;
    y?: number;
    duration?: number;
    start?: string;
  }
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    stagger = 0.08,
    y = 30,
    duration = 0.8,
    start = 'top 85%',
  } = options || {};

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    if (!children.length) return;

    gsap.set(children, { opacity: 0, y, filter: `blur(${y / 5}px)` });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      once: true,
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration,
          stagger,
          ease: 'power3.out',
        });
      },
    });

    return () => trigger.kill();
  }, [stagger, y, duration, start]);

  return containerRef;
}

/**
 * Hook for horizontal line reveal animation.
 */
export function useGsapLineReveal(options?: { duration?: number; start?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { duration = 1.2, start = 'top 85%' } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { scaleX: 0, transformOrigin: 'left center' });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => {
        gsap.to(el, {
          scaleX: 1,
          duration,
          ease: 'power3.inOut',
        });
      },
    });

    return () => trigger.kill();
  }, [duration, start]);

  return ref;
}

export { gsap, ScrollTrigger };
