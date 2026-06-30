'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ArrowRight, Send } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLButtonElement>(null);
  const btn2Ref = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Background glow
      tl.fromTo('[data-hero="glow"]',
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        0
      );

      tl.fromTo('[data-hero="label"]',
        { opacity: 0, y: 20, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
        0.4
      )
      .fromTo('[data-hero="name1"]',
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('[data-hero="name2"]',
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo('[data-hero="caos"]',
        { opacity: 0, scale: 0.85, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('[data-hero="subtitle"]',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('[data-hero="desc"]',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('[data-hero="buttons"] > *',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('[data-hero="scroll"]',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.1'
      );

      // Continuous glow pulse
      gsap.to(glowRef.current, {
        scale: 1.1,
        opacity: 0.7,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Magnetic button effect
  const handleMouseMove = useCallback((e: React.MouseEvent, ref: React.RefObject<HTMLButtonElement | null>) => {
    const btn = ref.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
  }, []);

  const handleMouseLeave = useCallback((ref: React.RefObject<HTMLButtonElement | null>) => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  }, []);

  return (
    <section
      id='hero'
      ref={containerRef}
      className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden'
    >
      {/* Ambient glow behind CAOS */}
      <div
        data-hero='glow'
        ref={glowRef}
        className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-0 pointer-events-none'
        style={{
          background: 'radial-gradient(circle, rgba(10,132,255,0.12) 0%, rgba(0,212,255,0.04) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className='relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto'>
        {/* Label */}
        <span
          data-hero='label'
          className='text-xs sm:text-sm tracking-[0.4em] uppercase text-white/30 mb-8'
        >
          Hello, I&apos;m
        </span>

        {/* Name */}
        <h1
          data-hero='name1'
          className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-gradient-caos leading-tight'
        >
          Miguel Antonio
        </h1>
        <h1
          data-hero='name2'
          className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight'
        >
          Chávez Villalba
        </h1>

        {/* CAOS */}
        <h2
          data-hero='caos'
          className='text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-wider mt-2 md:mt-4 animate-shimmer'
          style={{
            background: 'linear-gradient(90deg, #ffffff 0%, #0a84ff 25%, #00d4ff 50%, #8b5cf6 75%, #ffffff 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          CAOS
        </h2>

        {/* Subtitle */}
        <p
          data-hero='subtitle'
          className='text-sm sm:text-base md:text-lg text-white/40 mt-6 md:mt-8 tracking-wide'
        >
          Full Stack Developer • Creative Programmer • 17 Years Old
        </p>

        {/* Description */}
        <p
          data-hero='desc'
          className='text-sm sm:text-base text-white/25 mt-4 max-w-xl leading-relaxed'
        >
          From Chaos to Code. Transformo ideas en experiencias digitales extraordinarias.
          Especializado en crear aplicaciones web modernas, rápidas y elegantes.
        </p>

        {/* Buttons */}
        <div data-hero='buttons' className='flex flex-col sm:flex-row items-center gap-4 mt-10 md:mt-12'>
          <button
            ref={btn1Ref}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseMove={(e) => handleMouseMove(e, btn1Ref)}
            onMouseLeave={() => handleMouseLeave(btn1Ref)}
            className='magnetic-btn group relative flex items-center gap-2.5 px-7 py-3.5 bg-[#0a84ff] hover:bg-[#0070e0] text-white text-sm font-medium rounded-lg transition-colors overflow-hidden'
            data-cursor-hover
          >
            <span className='relative z-10 flex items-center gap-2.5'>
              Ver Proyectos
              <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
            </span>
            <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
          </button>
          <button
            ref={btn2Ref}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseMove={(e) => handleMouseMove(e, btn2Ref)}
            onMouseLeave={() => handleMouseLeave(btn2Ref)}
            className='magnetic-btn group flex items-center gap-2.5 px-7 py-3.5 border border-white/10 hover:border-white/20 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:bg-white/[0.03]'
            data-cursor-hover
          >
            Contactar
            <Send className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero='scroll'
        className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'
      >
        <span className='text-[10px] tracking-[0.3em] uppercase text-white/20'>Scroll</span>
        <div className='animate-bounce-slow'>
          <ChevronDown className='w-4 h-4 text-white/20' />
        </div>
      </div>
    </section>
  );
}
