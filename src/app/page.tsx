'use client';

import { useEffect, useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Dynamic imports (no SSR for Three.js)
const WebGLBackground = dynamic(() => import('@/components/three/WebGLBackground'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/portfolio/LoadingScreen'), { ssr: false });

// Sections
import Navigation from '@/components/portfolio/Navigation';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Statistics from '@/components/portfolio/Statistics';
import Timeline from '@/components/portfolio/Timeline';
import Projects from '@/components/portfolio/Projects';
import Experience from '@/components/portfolio/Experience';
import Contact from '@/components/portfolio/Contact';
import Footer from '@/components/portfolio/Footer';

// Effects
import CustomCursor from '@/components/effects/CustomCursor';
import ScrollProgress from '@/components/effects/ScrollProgress';
import BackToTop from '@/components/effects/BackToTop';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  }, []);

  // Lenis smooth scroll
  useEffect(() => {
    if (!showContent) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;

    const init = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical' as const,
        gestureOrientation: 'vertical' as const,
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };

    init();
    return () => { lenis?.destroy(); };
  }, [showContent]);

  // Refresh ScrollTrigger on scroll
  useEffect(() => {
    if (!showContent) return;
    const onScroll = () => ScrollTrigger.refresh();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showContent]);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <WebGLBackground />

      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {showContent && (
        <div className='relative z-10 min-h-screen flex flex-col w-full'>
          <Navigation />
          <main className='w-full'>
            <Hero />
            <div className='line-separator' />
            <About />
            <div className='line-separator' />
            <Skills />
            <div className='line-separator' />
            <Statistics />
            <div className='line-separator' />
            <Timeline />
            <div className='line-separator' />
            <Projects />
            <div className='line-separator' />
            <Experience />
            <div className='line-separator' />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
        </div>
      )}
    </>
  );
}