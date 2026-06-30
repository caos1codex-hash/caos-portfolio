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
    <section className='py-36 md:py-48 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-6 py-2.5 rounded-full mb-6'>
        <p className='text-sm tracking-[0.4em] uppercase text-white/40'>Evolución</p>
      </div>
      <h2 ref={headingRef} className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6'>
        Mi Camino
      </h2>
      <div ref={lineRef} className='line-separator w-24 mb-18' />

      <div ref={itemsRef} className='relative max-w-3xl mx-auto'>
        {/* Vertical line - subtle spatial blue */}
        <div className='absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#1e90ff]/15 to-transparent md:-translate-x-px' />

        {EVENTS.map((item, i) => (
          <div
            key={i}
            className={`relative flex items-start gap-9 mb-15 last:mb-0 ${
              i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}
          >
            {/* Dot - glowing blue */}
            <div className='absolute left-6 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 mt-2.5 z-10'
              style={{
                background: 'radial-gradient(circle, #1e90ff 0%, #1e90ff 40%, transparent 70%)',
                boxShadow: '0 0 8px rgba(30, 144, 255, 0.4)',
              }}
            />

            {/* Content - liquid glass card */}
            <div className={`ml-15 md:ml-0 md:w-[calc(50%-2rem)] ${
              i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'
            }`}>
              <span className='inline-block liquid-glass-text px-6 py-1.5 rounded-full text-sm font-mono text-[#1e90ff] tracking-wider mb-4'>{item.year}</span>
              <div className='liquid-glass rounded-2xl p-9'>
                <h3 className='text-xl font-semibold text-white/80 mb-2.5'>{item.title}</h3>
                <p className='text-base text-white/35 leading-relaxed'>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}