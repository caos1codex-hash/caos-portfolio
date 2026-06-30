'use client';

import { useRef, useEffect } from 'react';
import { ExternalLink, Github, ChevronRight } from 'lucide-react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ExpItem = {
  title: string;
  role: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  year?: string;
};

const EXPERIENCES: ExpItem[] = [
  {
    title: 'CAOS Portfolio',
    role: 'Full Stack Developer & Designer',
    description: 'Portafolio profesional con Three.js, shaders GLSL, GSAP y GitHub API. Diseño AAA con experiencias inmersivas y animaciones premium.',
    tech: ['Next.js', 'Three.js', 'GLSL', 'GSAP', 'Tailwind CSS', 'TypeScript'],
    github: 'https://github.com/caos1codex-hash/caos-portfolio',
    year: '2025',
  },
  {
    title: 'Proyectos Open Source',
    role: 'Contributor & Maintainer',
    description: 'Mantenimiento y desarrollo de proyectos open source en GitHub, colaborando con la comunidad de desarrolladores.',
    tech: ['TypeScript', 'React', 'Node.js', 'Python', 'Docker'],
    github: 'https://github.com/caos1codex-hash',
    year: '2023-2025',
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;
    const cards = cardsRef.current.children;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, filter: 'blur(6px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.7, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', once: true },
      }
    );
  }, []);

  return (
    <section className='py-24 md:py-32 section-padding' ref={sectionRef}>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Experiencia
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Proyectos Destacados
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-10' />

      <div ref={cardsRef} className='max-w-3xl space-y-5'>
        {EXPERIENCES.map((exp, i) => (
          <div
            key={i}
            className='glass rounded-xl p-6 group hover:border-[#0a84ff]/15 transition-all duration-500 card-lift relative overflow-hidden'
            data-cursor-hover
          >
            {/* Accent line */}
            <div className='absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#0a84ff] to-[#00d4ff] opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

            <div className='flex items-start justify-between mb-2'>
              <div>
                <div className='flex items-center gap-3 mb-1'>
                  <h3 className='text-base font-semibold text-white/90'>{exp.title}</h3>
                  {exp.year && (
                    <span className='text-[10px] font-mono text-[#0a84ff]/60 px-2 py-0.5 rounded-full bg-[#0a84ff]/5'>
                      {exp.year}
                    </span>
                  )}
                </div>
                <p className='text-xs text-[#0a84ff]'>{exp.role}</p>
              </div>
              <div className='flex items-center gap-2'>
                {exp.github && (
                  <a href={exp.github} target='_blank' rel='noopener noreferrer'
                    className='text-white/20 hover:text-white transition-colors p-1 rounded-md hover:bg-white/[0.04]'
                    data-cursor-hover aria-label='GitHub'>
                    <Github className='w-4 h-4' />
                  </a>
                )}
                {exp.demo && (
                  <a href={exp.demo} target='_blank' rel='noopener noreferrer'
                    className='text-white/20 hover:text-[#0a84ff] transition-colors p-1 rounded-md hover:bg-[#0a84ff]/5'
                    data-cursor-hover aria-label='Demo'>
                    <ExternalLink className='w-4 h-4' />
                  </a>
                )}
              </div>
            </div>
            <p className='text-xs text-white/30 leading-relaxed mb-4'>{exp.description}</p>
            <div className='flex flex-wrap gap-1.5'>
              {exp.tech.map(t => (
                <span key={t} className='px-2.5 py-0.5 text-[10px] rounded-full bg-white/[0.04] text-white/30 hover:text-white/50 hover:bg-white/[0.06] transition-colors'>
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
