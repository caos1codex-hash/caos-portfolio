'use client';

import { useGsapFadeIn, useGsapLineReveal, useGsapStagger } from '@/hooks/useGsap';
import { ExternalLink, Github } from 'lucide-react';

type ExpItem = {
  title: string;
  role: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

const EXPERIENCES: ExpItem[] = [
  {
    title: 'CAOS Portfolio',
    role: 'Full Stack Developer & Designer',
    description: 'Portafolio profesional con Three.js, shaders GLSL, GSAP y GitHub API. Diseño AAA con experiencias inmersivas.',
    tech: ['Next.js', 'Three.js', 'GLSL', 'GSAP', 'Tailwind CSS'],
    github: 'https://github.com/caos1codex-hash/caos-portfolio',
  },
  {
    title: 'Proyectos Open Source',
    role: 'Contributor & Maintainer',
    description: 'Mantenimiento y desarrollo de proyectos open source en GitHub, colaborando con la comunidad de desarrolladores.',
    tech: ['TypeScript', 'React', 'Node.js', 'Python'],
    github: 'https://github.com/caos1codex-hash',
  },
];

export default function Experience() {
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const cardsRef = useGsapStagger({ stagger: 0.1, y: 25, duration: 0.7 });

  return (
    <section className='py-36 md:py-48 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-6 py-2.5 rounded-full mb-6'>
        <p className='text-sm tracking-[0.4em] uppercase text-white/40'>Experiencia</p>
      </div>
      <h2 ref={headingRef} className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6'>
        Proyectos Destacados
      </h2>
      <div ref={lineRef} className='line-separator w-24 mb-15' />

      <div ref={cardsRef} className='max-w-5xl space-y-8'>
        {EXPERIENCES.map((exp, i) => (
          <div key={i} className='liquid-glass rounded-2xl p-9 group liquid-glass-lift'>
            <div className='flex items-start justify-between mb-3 relative z-10'>
              <div>
                <h3 className='text-xl font-semibold text-white/90'>{exp.title}</h3>
                <p className='text-sm text-[#1e90ff] mt-1'>{exp.role}</p>
              </div>
              <div className='flex items-center gap-3'>
                {exp.github && (
                  <a href={exp.github} target='_blank' rel='noopener noreferrer'
                    className='text-white/20 hover:text-white transition-colors' data-cursor-hover>
                    <Github className='w-6 h-6' />
                  </a>
                )}
                {exp.demo && (
                  <a href={exp.demo} target='_blank' rel='noopener noreferrer'
                    className='text-white/20 hover:text-[#1e90ff] transition-colors' data-cursor-hover>
                    <ExternalLink className='w-6 h-6' />
                  </a>
                )}
              </div>
            </div>
            <p className='text-sm text-white/30 leading-relaxed mb-5 relative z-10'>{exp.description}</p>
            <div className='flex flex-wrap gap-2.5 relative z-10'>
              {exp.tech.map(t => (
                <span key={t} className='px-4 py-1 text-xs rounded-full liquid-glass-btn text-white/30'>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
