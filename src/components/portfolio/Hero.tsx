'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ArrowRight, Send } from 'lucide-react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLButtonElement>(null);
  const btn2Ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('[data-hero="label"]',
        { opacity: 0, y: 20, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
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
        { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
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
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('[data-hero="scroll"]',
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.1'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

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
      className='relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full'
    >
      <div className='relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto'>
        {/* Label - liquid glass pill */}
        <div
          data-hero='label'
          className='liquid-glass-text px-5 py-2 rounded-full mb-8'
        >
          <span className='text-xs sm:text-sm tracking-[0.4em] uppercase text-white/40'>
            Hello, I&apos;m
          </span>
        </div>

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

        {/* CAOS - liquid glass container */}
        <div
          data-hero='caos'
          className='relative mt-2 md:mt-4'
        >
          <div className='absolute -inset-8 bg-[#1e90ff]/[0.03] rounded-full blur-3xl' />
          <h2
            className='text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-wider animate-shimmer relative'
            style={{
              background: 'linear-gradient(90deg, #ffffff 0%, #1e90ff 25%, #00d4ff 50%, #1e90ff 75%, #ffffff 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CAOS
          </h2>
        </div>

        {/* Subtitle - liquid glass container */}
        <div
          data-hero='subtitle'
          className='liquid-glass-text px-6 py-2 rounded-full mt-6 md:mt-8'
        >
          <p className='text-sm sm:text-base md:text-lg text-white/50 tracking-wide'>
            Full Stack Developer &bull; Creative Programmer &bull; 17 Years Old
          </p>
        </div>

        {/* Description */}
        <p
          data-hero='desc'
          className='text-sm sm:text-base text-white/30 mt-4 max-w-xl leading-relaxed'
        >
          From Chaos to Code. Transformo ideas en experiencias digitales extraordinarias.
          Especializado en crear aplicaciones web modernas, rápidas y elegantes.
        </p>

        {/* Buttons - liquid glass */}
        <div data-hero='buttons' className='flex flex-col sm:flex-row items-center gap-4 mt-10 md:mt-12'>
          <button
            ref={btn1Ref}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseMove={(e) => handleMouseMove(e, btn1Ref)}
            onMouseLeave={() => handleMouseLeave(btn1Ref)}
            className='magnetic-btn liquid-glass-btn flex items-center gap-2.5 px-7 py-3.5 text-white text-sm font-medium rounded-xl'
            data-cursor-hover
          >
            <span className='relative z-10 flex items-center gap-2.5'>
              Ver Proyectos
              <ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
            </span>
          </button>
          <button
            ref={btn2Ref}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseMove={(e) => handleMouseMove(e, btn2Ref)}
            onMouseLeave={() => handleMouseLeave(btn2Ref)}
            className='magnetic-btn liquid-glass-btn flex items-center gap-2.5 px-7 py-3.5 text-white/70 hover:text-white text-sm font-medium rounded-xl'
            data-cursor-hover
          >
            <span className='relative z-10 flex items-center gap-2.5'>
              Contactar
              <Send className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
            </span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero='scroll'
        className='absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2'
      >
        <span className='text-[10px] tracking-[0.3em] uppercase text-white/15'>Scroll</span>
        <div className='animate-bounce'>
          <ChevronDown className='w-4 h-4 text-white/15' />
        </div>
      </div>
    </section>
  );
}