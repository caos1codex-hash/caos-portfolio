'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Circle } from 'lucide-react';
import SectionReveal from '@/components/effects/SectionReveal';

type StepStatus = 'completed' | 'in-progress' | 'upcoming';

interface RoadmapStep {
  number: number;
  title: string;
  description: string;
  status: StepStatus;
}

const roadmapSteps: RoadmapStep[] = [
  {
    number: 1,
    title: 'Dominar HTML, CSS y JavaScript',
    description: 'Completado',
    status: 'completed',
  },
  {
    number: 2,
    title: 'Aprender React y Next.js',
    description: 'Completado',
    status: 'completed',
  },
  {
    number: 3,
    title: 'Full Stack con Node.js y Bases de Datos',
    description: 'Completado',
    status: 'completed',
  },
  {
    number: 4,
    title: 'Arquitectura de Software y DevOps',
    description: 'En Progreso',
    status: 'in-progress',
  },
  {
    number: 5,
    title: 'Inteligencia Artificial y Machine Learning',
    description: 'Próximamente',
    status: 'upcoming',
  },
  {
    number: 6,
    title: 'Contribuciones Open Source',
    description: 'Próximamente',
    status: 'upcoming',
  },
  {
    number: 7,
    title: 'Liderazgo Técnico',
    description: 'Próximamente',
    status: 'upcoming',
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

function StatusIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'completed':
      return (
        <div className="relative">
          <CheckCircle className="w-7 h-7 text-emerald-400" />
          <div className="absolute inset-0 w-7 h-7 rounded-full bg-emerald-400/20 animate-ping" />
        </div>
      );
    case 'in-progress':
      return (
        <div className="relative">
          <Loader2 className="w-7 h-7 text-caos-blue animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-0 w-7 h-7 rounded-full bg-caos-blue/30 animate-pulse" />
        </div>
      );
    case 'upcoming':
      return <Circle className="w-7 h-7 text-white/20" />;
  }
}

function getStatusBorder(status: StepStatus): string {
  switch (status) {
    case 'completed':
      return 'border-emerald-400/30 hover:border-emerald-400/50';
    case 'in-progress':
      return 'border-caos-blue/30 hover:border-caos-blue/50 glow-blue';
    case 'upcoming':
      return 'border-white/[0.06] hover:border-white/10 border-dashed';
  }
}

function getStatusAccent(status: StepStatus): string {
  switch (status) {
    case 'completed':
      return 'from-emerald-400/10 via-transparent to-emerald-400/5';
    case 'in-progress':
      return 'from-caos-blue/10 via-transparent to-caos-purple/10';
    case 'upcoming':
      return 'from-white/[0.02] via-transparent to-white/[0.01]';
  }
}

function StepCard({ step, index }: { step: RoadmapStep; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={stepVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="relative flex-shrink-0"
    >
      {/* Step card */}
      <div
        className={`
          glass-strong rounded-2xl p-6 relative overflow-hidden group
          transition-all duration-500
          ${getStatusBorder(step.status)}
          w-[280px] md:w-[260px]
        `}
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getStatusAccent(step.status)} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />

        {/* Top accent line */}
        {step.status === 'completed' && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400/60 via-emerald-400/30 to-transparent" />
        )}
        {step.status === 'in-progress' && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-caos-blue/80 via-caos-purple/50 to-transparent" />
        )}

        <div className="relative">
          {/* Step number + status icon row */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`
                inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold
                ${
                  step.status === 'completed'
                    ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                    : step.status === 'in-progress'
                      ? 'bg-caos-blue/10 text-caos-blue border border-caos-blue/20'
                      : 'bg-white/[0.04] text-white/30 border border-white/[0.06]'
                }
              `}
            >
              {step.number}
            </span>
            <StatusIcon status={step.status} />
          </div>

          {/* Title */}
          <h3
            className={`
              text-base md:text-lg font-semibold mb-2 leading-snug
              ${
                step.status === 'upcoming'
                  ? 'text-white/40'
                  : 'text-white'
              }
            `}
          >
            {step.title}
          </h3>

          {/* Status label */}
          <span
            className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${
                step.status === 'completed'
                  ? 'bg-emerald-400/10 text-emerald-400'
                  : step.status === 'in-progress'
                    ? 'bg-caos-blue/10 text-caos-blue'
                    : 'bg-white/[0.04] text-white/30'
              }
            `}
          >
            {step.description}
          </span>
        </div>
      </div>

      {/* Connector line to next step (horizontal for desktop, not shown for last) */}
      {index < roadmapSteps.length - 1 && (
        <div className="hidden md:flex absolute top-1/2 -right-6 -translate-y-1/2 items-center z-10">
          <div
            className={`w-6 h-[2px] ${
              step.status === 'completed'
                ? 'bg-emerald-400/40'
                : step.status === 'in-progress'
                  ? 'bg-caos-blue/30'
                  : 'bg-white/[0.06] border-t border-dashed border-white/10'
            }`}
          />
        </div>
      )}
    </motion.div>
  );
}

/* Vertical connector line for mobile */
function VerticalConnector({ status }: { status: StepStatus }) {
  return (
    <div className="flex flex-col items-center py-2 md:hidden">
      <div
        className={`w-[2px] h-8 ${
          status === 'completed'
            ? 'bg-emerald-400/30'
            : status === 'in-progress'
              ? 'bg-caos-blue/20'
              : 'bg-white/[0.04]'
        }`}
      />
    </div>
  );
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-24 md:py-32 section-padding overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px]"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section title */}
        <SectionReveal className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Roadmap
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-caos-purple to-caos-blue rounded-full glow-purple" />
        </SectionReveal>

        {/* Desktop: Horizontal scrollable timeline */}
        <div className="hidden md:block">
          <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
            <div className="flex gap-6 items-start min-w-max">
              {roadmapSteps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>
          </div>

          {/* Progress track below cards */}
          <div className="mt-8 mx-6 relative">
            <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, #34d399 0%, #34d399 42%, #0066ff 42%, #0066ff 57%, rgba(255,255,255,0.06) 57%)',
                }}
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
              />
            </div>

            {/* Step dots on the track */}
            <div className="flex justify-between mt-[-7px]">
              {roadmapSteps.map((step) => (
                <div
                  key={step.number}
                  className={`
                    w-3.5 h-3.5 rounded-full border-2
                    ${
                      step.status === 'completed'
                        ? 'bg-emerald-400 border-emerald-400'
                        : step.status === 'in-progress'
                          ? 'bg-caos-blue border-caos-blue animate-pulse'
                          : 'bg-transparent border-white/10'
                    }
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical steps */}
        <div className="md:hidden flex flex-col items-center">
          {roadmapSteps.map((step, index) => (
            <div key={step.number} className="w-full max-w-sm">
              <motion.div
                custom={index}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                <div
                  className={`
                    glass-strong rounded-2xl p-5 relative overflow-hidden
                    transition-all duration-500
                    ${getStatusBorder(step.status)}
                  `}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getStatusAccent(step.status)} opacity-50`}
                  />

                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`
                          inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                          ${
                            step.status === 'completed'
                              ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                              : step.status === 'in-progress'
                                ? 'bg-caos-blue/10 text-caos-blue border border-caos-blue/20'
                                : 'bg-white/[0.04] text-white/30 border border-white/[0.06]'
                          }
                        `}
                      >
                        {step.number}
                      </span>
                      <StatusIcon status={step.status} />
                    </div>

                    <h3
                      className={`
                        text-base font-semibold mb-2
                        ${step.status === 'upcoming' ? 'text-white/40' : 'text-white'}
                      `}
                    >
                      {step.title}
                    </h3>

                    <span
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${
                          step.status === 'completed'
                            ? 'bg-emerald-400/10 text-emerald-400'
                            : step.status === 'in-progress'
                              ? 'bg-caos-blue/10 text-caos-blue'
                              : 'bg-white/[0.04] text-white/30'
                        }
                      `}
                    >
                      {step.description}
                    </span>
                  </div>
                </div>
              </motion.div>

              {index < roadmapSteps.length - 1 && (
                <VerticalConnector status={step.status} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
