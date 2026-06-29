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
    <section className='py-24 md:py-32 section-padding'>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Experiencia
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Proyectos Destacados
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-10' />

      <div ref={cardsRef} className='max-w-3xl space-y-5'>
        {EXPERIENCES.map((exp, i) => (
          <div key={i} className='glass rounded-xl p-6 group hover:border-[#0a84ff]/15 transition-all duration-500'>
            <div className='flex items-start justify-between mb-2'>
              <div>
                <h3 className='text-base font-semibold text-white/90'>{exp.title}</h3>
                <p className='text-xs text-[#0a84ff] mt-0.5'>{exp.role}</p>
              </div>
              <div className='flex items-center gap-2'>
                {exp.github && (
                  <a href={exp.github} target='_blank' rel='noopener noreferrer'
                    className='text-white/20 hover:text-white transition-colors' data-cursor-hover>
                    <Github className='w-4 h-4' />
                  </a>
                )}
                {exp.demo && (
                  <a href={exp.demo} target='_blank' rel='noopener noreferrer'
                    className='text-white/20 hover:text-[#0a84ff] transition-colors' data-cursor-hover>
                    <ExternalLink className='w-4 h-4' />
                  </a>
                )}
              </div>
            </div>
            <p className='text-xs text-white/30 leading-relaxed mb-3'>{exp.description}</p>
            <div className='flex flex-wrap gap-1.5'>
              {exp.tech.map(t => (
                <span key={t} className='px-2.5 py-0.5 text-[10px] rounded-full bg-white/[0.04] text-white/30'>
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
