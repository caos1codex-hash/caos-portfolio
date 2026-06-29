'use client';

import { motion } from 'framer-motion';
import { User, Calendar, Zap, Code2 } from 'lucide-react';
import SectionReveal from '@/components/effects/SectionReveal';

// ─── Data ────────────────────────────────────────────────────────────────────

interface InfoCard {
  label: string;
  value: string;
  icon: React.ElementType;
}

const infoCards: InfoCard[] = [
  { label: 'Nombre', value: 'Miguel Antonio Chávez Villalba', icon: User },
  { label: 'Edad', value: '17 años', icon: Calendar },
  { label: 'Alias', value: 'CAOS', icon: Zap },
  { label: 'Profesión', value: 'Desarrollador Web Full Stack', icon: Code2 },
];

interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '20+', label: 'Proyectos' },
  { value: '15+', label: 'Tecnologías' },
  { value: '3+', label: 'Años de experiencia' },
];

// ─── Animation Variants ──────────────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, x: -20, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4 + i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function About() {
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 section-padding"
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle at center, rgba(0,102,255,0.04) 0%, transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ─── Section Title ──────────────────────────────────────────────── */}
        <SectionReveal>
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-caos-blue to-transparent" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Sobre Mí
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-caos-blue/30 to-transparent" />
          </div>
        </SectionReveal>

        {/* ─── Two-Column Layout ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column — Info Cards */}
          <div className="space-y-4">
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="group glass rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-blue-500/20 hover:shadow-[0_0_30px_rgba(0,102,255,0.08)] cursor-default"
                >
                  {/* Icon container */}
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-blue-600/10 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600/20 group-hover:shadow-[0_0_15px_rgba(0,102,255,0.2)]">
                    <Icon className="w-5 h-5 text-caos-blue" />
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      {card.label}
                    </p>
                    <p className="text-sm md:text-base text-white font-medium truncate">
                      {card.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column — Description & Stats */}
          <div className="flex flex-col justify-center">
            <SectionReveal delay={0.2}>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10">
                Soy un desarrollador web full stack de 17 años, conocido como{' '}
                <span className="text-white font-semibold">CAOS</span>.
                Apasionado por crear experiencias digitales extraordinarias que
                combinan diseño impecable con tecnología de vanguardia. Cada
                proyecto es una oportunidad para empujar los límites de lo
                posible en la web.
              </p>
            </SectionReveal>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="glass rounded-xl p-5 text-center transition-all duration-300 hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(0,102,255,0.06)]"
                >
                  <p
                    className="text-2xl md:text-3xl font-bold text-glow-blue"
                    style={{
                      background:
                        'linear-gradient(135deg, #0066ff, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
