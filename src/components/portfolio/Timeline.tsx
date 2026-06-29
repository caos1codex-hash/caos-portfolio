'use client';

import { useGsapFadeIn, useGsapLineReveal, useGsapStagger } from '@/hooks/useGsap';

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

const EVENTS: TimelineItem[] = [
  { year: '2022', title: 'Primeros Pasos', description: 'Comencé a aprender HTML y CSS, creando mis primeras páginas web estáticas.' },
  { year: '2022', title: 'JavaScript', description: 'Domino JavaScript, aprendo sobre el DOM, eventos y manipulación dinámica.' },
  { year: '2023', title: 'React & Next.js', description: 'Me adentro en el ecosistema React con Next.js, construyendo aplicaciones full stack.' },
  { year: '2023', title: 'Backend & Bases de Datos', description: 'Aprendo Node.js, PostgreSQL, Prisma y APIs REST para crear aplicaciones completas.' },
  { year: '2024', title: 'Three.js & WebGL', description: 'Exploro el mundo 3D en la web con Three.js, shaders GLSL y experiencias inmersivas.' },
  { year: '2024', title: 'Inteligencia Artificial', description: 'Integro IA en mis proyectos con OpenAI, LangChain y prompt engineering.' },
  { year: '2025', title: 'CAOS Portfolio', description: 'Creo mi portafolio profesional AAA, mostrando mi evolución y habilidades.' },
];

export default function Timeline() {
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const itemsRef = useGsapStagger({ stagger: 0.1, y: 25, duration: 0.7 });

  return (
    <section className='py-24 md:py-32 section-padding'>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Evolución
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Mi Camino
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-12' />

      <div ref={itemsRef} className='relative max-w-2xl mx-auto'>
        {/* Vertical line */}
        <div className='absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] md:-translate-x-px' />

        {EVENTS.map((item, i) => (
          <div
            key={i}
            className={`relative flex items-start gap-6 mb-10 last:mb-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Dot */}
            <div className='absolute left-4 md:left-1/2 w-2 h-2 rounded-full bg-[#0a84ff] -translate-x-1/2 mt-1.5 z-10' />

            {/* Content */}
            <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${
              i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
            }`}>
              <span className='text-[11px] font-mono text-[#0a84ff] tracking-wider'>{item.year}</span>
              <h3 className='text-sm font-semibold text-white/80 mt-1'>{item.title}</h3>
              <p className='text-xs text-white/30 mt-1.5 leading-relaxed'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
