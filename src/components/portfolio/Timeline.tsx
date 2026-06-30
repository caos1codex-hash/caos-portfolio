'use client';

import { useRef, useEffect } from 'react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  icon?: string;
};

const EVENTS: TimelineItem[] = [
  { year: '2022', title: 'Primeros Pasos', description: 'Comencé a aprender HTML y CSS, creando mis primeras páginas web estáticas.', icon: '🌐' },
  { year: '2022', title: 'JavaScript', description: 'Domino JavaScript, aprendo sobre el DOM, eventos y manipulación dinámica.', icon: '⚡' },
  { year: '2023', title: 'React & Next.js', description: 'Me adentro en el ecosistema React con Next.js, construyendo aplicaciones full stack.', icon: '⚛️' },
  { year: '2023', title: 'Backend & Bases de Datos', description: 'Aprendo Node.js, PostgreSQL, Prisma y APIs REST para crear aplicaciones completas.', icon: '🗄️' },
  { year: '2024', title: 'Three.js & WebGL', description: 'Exploro el mundo 3D en la web con Three.js, shaders GLSL y experiencias inmersivas.', icon: '🎮' },
  { year: '2024', title: 'Inteligencia Artificial', description: 'Integro IA en mis proyectos con OpenAI, LangChain y prompt engineering.', icon: '🤖' },
  { year: '2025', title: 'CAOS Portfolio', description: 'Creo mi portafolio profesional AAA, mostrando mi evolución y habilidades.', icon: '🚀' },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const itemsRef = useRef<HTMLDivElement>(null);
  const lineGrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!itemsRef.current) return;
    const items = itemsRef.current.querySelectorAll('[data-timeline-item]');

    gsap.set(items, { opacity: 0, y: 25, filter: 'blur(4px)' });

    ScrollTrigger.batch(items, {
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.6, stagger: 0.1, ease: 'power3.out',
        });
      },
      start: 'top 88%',
      once: true,
    });

    // Animate the vertical line growth
    if (lineGrowRef.current) {
      gsap.fromTo(
        lineGrowRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: itemsRef.current,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: 0.5,
          },
        }
      );
    }
  }, []);

  return (
    <section className='py-24 md:py-32 section-padding' ref={sectionRef}>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Evolución
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Mi Camino
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-12' />

      <div ref={itemsRef} className='relative max-w-2xl mx-auto'>
        {/* Animated vertical line */}
        <div className='absolute left-[15px] md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] md:-translate-x-px'>
          <div
            ref={lineGrowRef}
            className='w-full origin-top'
            style={{
              background: 'linear-gradient(180deg, #0a84ff 0%, #00d4ff 50%, #8b5cf6 100%)',
            }}
          />
        </div>

        {EVENTS.map((item, i) => (
          <div
            key={i}
            data-timeline-item
            className={`relative flex items-start gap-5 mb-10 last:mb-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Dot */}
            <div className='absolute left-[11px] md:left-1/2 md:-translate-x-1/2 w-[9px] h-[9px] rounded-full bg-[#0a84ff] z-10 mt-1.5 shadow-lg shadow-[#0a84ff]/30 ring-2 ring-black' />

            {/* Content */}
            <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
              i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
            }`}>
              <div className='flex items-center gap-2 mb-1'>
                {item.icon && <span className='text-sm'>{item.icon}</span>}
                <span className='text-[11px] font-mono text-[#0a84ff] tracking-wider'>{item.year}</span>
              </div>
              <h3 className='text-sm font-semibold text-white/80'>{item.title}</h3>
              <p className='text-xs text-white/30 mt-1.5 leading-relaxed'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
