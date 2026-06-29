'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import SectionReveal from '@/components/effects/SectionReveal';

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
}

const timelineData: TimelineEntry[] = [
  {
    year: '2024-Presente',
    title: 'Desarrollador Full Stack Freelance',
    description:
      'Desarrollo de aplicaciones web completas para clientes internacionales, utilizando React, Next.js, Node.js y bases de datos modernas.',
  },
  {
    year: '2023-2024',
    title: 'Desarrollador Frontend',
    description:
      'Creación de interfaces de usuario responsivas e interactivas con React y TypeScript para diversos proyectos.',
  },
  {
    year: '2022-2023',
    title: 'Desarrollador Web Junior',
    description:
      'Primeros proyectos profesionales con HTML, CSS, JavaScript y PHP. Aprendizaje acelerado de frameworks modernos.',
  },
  {
    year: '2021-2022',
    title: 'Inicio en la Programación',
    description:
      'Descubrimiento de la programación y el desarrollo web. Primeros proyectos personales y aprendizaje autodidacta.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      delay: i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

function TimelineCard({
  entry,
  index,
  side,
}: {
  entry: TimelineEntry;
  index: number;
  side: 'left' | 'right';
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`relative w-full md:w-[calc(50%-2rem)] ${
        side === 'left' ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
      }`}
    >
      {/* Connector dot on the timeline */}
      <div
        className={`absolute top-6 ${
          side === 'left'
            ? 'right-[-2.75rem] md:right-[-2.5rem]'
            : 'left-[-2.75rem] md:left-[-2.5rem]'
        } hidden md:block z-10`}
      >
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-caos-blue glow-blue" />
          <div className="absolute inset-0 w-4 h-4 rounded-full bg-caos-blue animate-ping opacity-30" />
        </div>
      </div>

      {/* Mobile connector dot */}
      <div className="absolute top-6 left-[-2.25rem] md:hidden z-10">
        <div className="relative">
          <div className="w-3.5 h-3.5 rounded-full bg-caos-blue glow-blue" />
          <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-caos-blue animate-ping opacity-30" />
        </div>
      </div>

      {/* Glass card */}
      <div className="glass-strong rounded-2xl p-6 relative overflow-hidden group hover:border-caos-blue/30 transition-all duration-500">
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-caos-blue/5 via-transparent to-caos-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Blue glow accent line */}
        <div
          className={`absolute top-0 ${
            side === 'left' ? 'right-0' : 'left-0'
          } w-24 h-[2px] bg-gradient-to-r from-caos-blue/80 to-transparent`}
        />

        {/* Year badge with glow */}
        <div className="relative mb-4">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-caos-blue/10 text-caos-blue border border-caos-blue/20 glow-blue">
            {entry.year}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 relative">
          {entry.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative">
          {entry.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth the scroll progress for the line fill animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 md:py-32 section-padding overflow-hidden"
    >
      {/* Background atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,102,255,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section title */}
        <SectionReveal className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Experiencia
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-caos-blue to-caos-purple rounded-full glow-blue" />
        </SectionReveal>

        {/* Timeline container */}
        <div className="relative">
          {/* Desktop: Center vertical line with fill animation */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 hidden md:block">
            {/* Background track */}
            <div className="w-[2px] h-full bg-white/[0.06]" />
            {/* Animated fill */}
            <motion.div
              className="absolute top-0 left-0 w-[2px]"
              style={{
                height: lineHeight,
                background:
                  'linear-gradient(to bottom, #0066ff, #8b5cf6, #00ffff)',
                boxShadow:
                  '0 0 8px rgba(0,102,255,0.5), 0 0 20px rgba(0,102,255,0.2)',
              }}
            />
          </div>

          {/* Mobile: Left vertical line with fill animation */}
          <div className="absolute left-4 top-0 bottom-0 md:hidden">
            <div className="w-[2px] h-full bg-white/[0.06]" />
            <motion.div
              className="absolute top-0 left-0 w-[2px]"
              style={{
                height: lineHeight,
                background:
                  'linear-gradient(to bottom, #0066ff, #8b5cf6, #00ffff)',
                boxShadow:
                  '0 0 8px rgba(0,102,255,0.5), 0 0 20px rgba(0,102,255,0.2)',
              }}
            />
          </div>

          {/* Timeline entries */}
          <div className="relative space-y-8 md:space-y-12 md:pl-0 pl-12">
            {timelineData.map((entry, index) => (
              <TimelineCard
                key={entry.year}
                entry={entry}
                index={index}
                side={index % 2 === 0 ? 'left' : 'right'}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
