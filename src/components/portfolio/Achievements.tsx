'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Cpu, Clock, Zap, GitCommit, BookOpen } from 'lucide-react';
import SectionReveal from '@/components/effects/SectionReveal';

interface Achievement {
  icon: React.ElementType;
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  sublabel?: string;
  glowColor: string;
  iconBg: string;
  iconColor: string;
}

const achievements: Achievement[] = [
  {
    icon: Trophy,
    value: '20+',
    numericValue: 20,
    suffix: '+',
    label: 'Proyectos Completados',
    glowColor: 'rgba(0,102,255,0.3)',
    iconBg: 'bg-caos-blue/10',
    iconColor: 'text-caos-blue',
  },
  {
    icon: Cpu,
    value: '23+',
    numericValue: 23,
    suffix: '+',
    label: 'Tecnologías Dominadas',
    glowColor: 'rgba(139,92,246,0.3)',
    iconBg: 'bg-caos-purple/10',
    iconColor: 'text-caos-purple',
  },
  {
    icon: Clock,
    value: '3+',
    numericValue: 3,
    suffix: '+',
    label: 'Años de Experiencia',
    glowColor: 'rgba(0,255,255,0.3)',
    iconBg: 'bg-caos-cyan/10',
    iconColor: 'text-caos-cyan',
  },
  {
    icon: Zap,
    value: '17',
    numericValue: 17,
    suffix: '',
    label: 'Años',
    sublabel: 'El desarrollador más joven',
    glowColor: 'rgba(0,102,255,0.3)',
    iconBg: 'bg-caos-blue/10',
    iconColor: 'text-caos-blue',
  },
  {
    icon: GitCommit,
    value: '365+',
    numericValue: 365,
    suffix: '+',
    label: 'GitHub Activo',
    sublabel: 'Contribuciones diarias',
    glowColor: 'rgba(139,92,246,0.3)',
    iconBg: 'bg-caos-purple/10',
    iconColor: 'text-caos-purple',
  },
  {
    icon: BookOpen,
    value: '∞',
    numericValue: 0,
    suffix: '',
    label: 'Autodidacta',
    sublabel: 'Aprendizaje continuo',
    glowColor: 'rgba(0,255,255,0.3)',
    iconBg: 'bg-caos-cyan/10',
    iconColor: 'text-caos-cyan',
  },
];

function CountUp({
  target,
  suffix,
  duration = 2,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView || target === 0) return;

    let start = 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * target);
      setCount(start);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  if (target === 0) {
    return <span ref={ref}>∞</span>;
  }

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.85, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

function AchievementCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const Icon = achievement.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      {/* Glow backdrop */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{ background: achievement.glowColor }}
      />

      {/* Card */}
      <div className="relative glass-strong rounded-2xl p-6 overflow-hidden group-hover:border-white/10 transition-all duration-500">
        {/* Icon glow spot */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle, ${achievement.glowColor}, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 w-16 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, ${achievement.glowColor.replace('0.3', '0.8')}, transparent)`,
          }}
        />

        <div className="relative">
          {/* Icon */}
          <div
            className={`
              inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
              ${achievement.iconBg}
            `}
          >
            <Icon className={`w-6 h-6 ${achievement.iconColor}`} />
          </div>

          {/* Value with count-up */}
          <div className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            <CountUp
              target={achievement.numericValue}
              suffix={achievement.suffix}
            />
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-white/80 mb-1">
            {achievement.label}
          </p>

          {/* Sublabel */}
          {achievement.sublabel && (
            <p className="text-xs text-muted-foreground">{achievement.sublabel}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative py-24 md:py-32 section-padding overflow-hidden"
    >
      {/* Background atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px]"
          style={{
            background:
              'radial-gradient(circle, rgba(0,102,255,0.05) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Section title */}
        <SectionReveal className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Logros
          </h2>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-caos-cyan to-caos-blue rounded-full glow-cyan" />
        </SectionReveal>

        {/* Achievement grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.label}
              achievement={achievement}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
