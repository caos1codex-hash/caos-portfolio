'use client';

import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Monitor, Server, Database, Cloud } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill {
  name: string;
  percentage: number;
}

interface SkillCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glowClass: string;
  skills: Skill[];
}

// ─── Skill Data ───────────────────────────────────────────────────────────────
const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Monitor,
    gradient: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)',
    glowClass: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    skills: [
      { name: 'React', percentage: 95 },
      { name: 'Next.js', percentage: 90 },
      { name: 'TypeScript', percentage: 88 },
      { name: 'Vue', percentage: 75 },
      { name: 'Angular', percentage: 70 },
      { name: 'CSS/Tailwind', percentage: 95 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Server,
    gradient: 'linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd)',
    glowClass: 'shadow-[0_0_12px_rgba(139,92,246,0.4)]',
    skills: [
      { name: 'Node.js', percentage: 90 },
      { name: 'Express', percentage: 88 },
      { name: 'PHP/Laravel', percentage: 80 },
      { name: 'Python', percentage: 75 },
      { name: 'Java', percentage: 70 },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    gradient: 'linear-gradient(90deg, #06b6d4, #22d3ee, #67e8f9)',
    glowClass: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    skills: [
      { name: 'MySQL', percentage: 85 },
      { name: 'MongoDB', percentage: 82 },
      { name: 'Firebase', percentage: 80 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    icon: Cloud,
    gradient: 'linear-gradient(90deg, #22c55e, #4ade80, #86efac)',
    glowClass: 'shadow-[0_0_12px_rgba(34,197,94,0.4)]',
    skills: [
      { name: 'Git', percentage: 92 },
      { name: 'Docker', percentage: 70 },
      { name: 'Linux', percentage: 78 },
    ],
  },
];

// ─── Count-Up Number Component ────────────────────────────────────────────────
function CountUpNumber({ value, inView }: { value: number; inView: boolean }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (latest) => Math.round(latest));

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      spring.set(value);
    } else {
      spring.set(0);
    }
  }, [inView, value, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [display]);

  return <span>{displayValue}%</span>;
}

// ─── Skill Bar Component ──────────────────────────────────────────────────────
function SkillBar({
  skill,
  gradient,
  delay,
  inView,
}: {
  skill: Skill;
  gradient: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground/90">{skill.name}</span>
        <span className="text-sm font-mono text-muted-foreground tabular-nums">
          <CountUpNumber value={skill.percentage} inView={inView} />
        </span>
      </div>

      {/* Bar track */}
      <div className="glass relative h-2.5 rounded-full overflow-hidden">
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: gradient,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.percentage}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: delay + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />

        {/* Shine effect on the bar */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.percentage}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay: delay + 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            }}
            animate={{ x: ['-200%', '200%'] }}
            transition={{
              duration: 2,
              delay: delay + 1.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Category Card Component ──────────────────────────────────────────────────
function CategoryCard({ category, isActive, onClick }: { category: SkillCategory; isActive: boolean; onClick: () => void }) {
  const Icon = category.icon;

  // Extract base color from gradient for active indicator
  const baseColors: Record<string, string> = {
    frontend: '#3b82f6',
    backend: '#8b5cf6',
    database: '#06b6d4',
    devops: '#22c55e',
  };

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm
        transition-all duration-300 cursor-pointer
        ${isActive
          ? 'glass-strong text-white'
          : 'glass text-muted-foreground hover:text-foreground/80'
        }
      `}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        boxShadow: isActive ? `0 0 20px ${baseColors[category.id]}20, inset 0 0 20px ${baseColors[category.id]}08` : 'none',
        borderColor: isActive ? `${baseColors[category.id]}40` : 'rgba(255,255,255,0.08)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <Icon className={`w-4 h-4 ${isActive ? '' : 'opacity-60'}`} style={{ color: isActive ? baseColors[category.id] : undefined }} />
      <span>{category.label}</span>

      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: baseColors[category.id], boxShadow: `0 0 8px ${baseColors[category.id]}60` }}
          layoutId="activeIndicator"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

// ─── Main Skills Section ──────────────────────────────────────────────────────
export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: '-100px' });

  const activeData = skillCategories.find((c) => c.id === activeCategory)!;

  const handleCategoryChange = useCallback((id: string) => {
    setActiveCategory(id);
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, #06b6d4, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="relative section-padding">
        {/* Section title */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="relative inline-block">
              Habilidades
              {/* Decorative gradient underline */}
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #22c55e)',
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </span>
          </h2>
          <motion.p
            className="mt-6 text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Nivel de dominio en cada área de desarrollo
          </motion.p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          {skillCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
              onClick={() => handleCategoryChange(category.id)}
            />
          ))}
        </motion.div>

        {/* Skills content */}
        <div ref={contentRef} className="max-w-3xl mx-auto">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="glass rounded-2xl p-6 md:p-8"
            style={{
              boxShadow: `0 0 40px ${activeCategory === 'frontend' ? 'rgba(59,130,246,0.05)' : activeCategory === 'backend' ? 'rgba(139,92,246,0.05)' : activeCategory === 'database' ? 'rgba(6,182,212,0.05)' : 'rgba(34,197,94,0.05)'}`,
            }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: activeData.gradient,
                  opacity: 0.9,
                }}
              >
                {(() => {
                  const Icon = activeData.icon;
                  return <Icon className="w-5 h-5 text-white" />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{activeData.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeData.skills.length} habilidades
                </p>
              </div>

              {/* Average percentage */}
              <div className="ml-auto text-right">
                <span className="text-2xl font-bold tabular-nums" style={{
                  background: activeData.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {Math.round(activeData.skills.reduce((a, s) => a + s.percentage, 0) / activeData.skills.length)}%
                </span>
                <p className="text-xs text-muted-foreground">promedio</p>
              </div>
            </div>

            {/* Skill bars */}
            <div className="space-y-5">
              {activeData.skills.map((skill, i) => (
                <SkillBar
                  key={`${activeCategory}-${skill.name}`}
                  skill={skill}
                  gradient={activeData.gradient}
                  delay={i * 0.08}
                  inView={isInView}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Overall stats summary */}
        <motion.div
          className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {skillCategories.map((cat) => {
            const avg = Math.round(cat.skills.reduce((a, s) => a + s.percentage, 0) / cat.skills.length);
            const Icon = cat.icon;
            const baseColors: Record<string, string> = {
              frontend: '#3b82f6',
              backend: '#8b5cf6',
              database: '#06b6d4',
              devops: '#22c55e',
            };

            return (
              <motion.div
                key={cat.id}
                className="glass rounded-xl p-4 text-center cursor-pointer"
                whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${baseColors[cat.id]}15` }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  borderColor: activeCategory === cat.id ? `${baseColors[cat.id]}30` : 'rgba(255,255,255,0.08)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              >
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: baseColors[cat.id] }} />
                <div className="text-xl font-bold tabular-nums" style={{
                  background: cat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {avg}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">{cat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
