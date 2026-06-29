'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useCallback, useState } from 'react';

// ─── Technology Data ──────────────────────────────────────────────────────────
const technologies = [
  { name: 'HTML', color: '#e34c26' },
  { name: 'CSS', color: '#563d7c' },
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'React', color: '#61dafb' },
  { name: 'Next.js', color: '#ffffff' },
  { name: 'Vue', color: '#41b883' },
  { name: 'Angular', color: '#dd0031' },
  { name: 'Node.js', color: '#339933' },
  { name: 'Express', color: '#ffffff' },
  { name: 'PHP', color: '#777BB4' },
  { name: 'Laravel', color: '#FF2D20' },
  { name: 'Python', color: '#3572A5' },
  { name: 'Java', color: '#b07219' },
  { name: 'C#', color: '#178600' },
  { name: 'C++', color: '#f34b7d' },
  { name: 'MySQL', color: '#4479A1' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Firebase', color: '#FFCA28' },
  { name: 'Git', color: '#F05032' },
  { name: 'GitHub', color: '#ffffff' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Linux', color: '#FCC624' },
] as const;

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── 3D Tilt Card Component ───────────────────────────────────────────────────
function TechCard({ tech, index }: { tech: (typeof technologies)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Motion values for smooth tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }, [mouseX, mouseY]);

  // Determine text color for readability on dark backgrounds
  const isLightColor = (color: string): boolean => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  };

  const dotGlowShadow = hovered
    ? `0 0 12px ${tech.color}80, 0 0 30px ${tech.color}40, 0 0 50px ${tech.color}20`
    : `0 0 6px ${tech.color}40`;

  const cardGlow = hovered
    ? `0 0 20px ${tech.color}20, 0 0 40px ${tech.color}10, inset 0 0 20px ${tech.color}05`
    : 'none';

  const borderColor = hovered ? `${tech.color}40` : 'rgba(255,255,255,0.08)';

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="relative group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="glass relative rounded-xl p-5 cursor-pointer overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: cardGlow,
          borderColor,
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Animated glowing border overlay */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${tech.color}15, transparent 50%, ${tech.color}08)`,
            opacity: hovered ? 1 : 0,
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${tech.color}10 45%, ${tech.color}20 50%, ${tech.color}10 55%, transparent 60%)`,
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-3" style={{ transform: 'translateZ(20px)' }}>
          {/* Colored dot icon */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              boxShadow: dotGlowShadow,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${tech.color}dd, ${tech.color}88)`,
                boxShadow: dotGlowShadow,
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: `radial-gradient(circle at 40% 40%, white, ${tech.color})`,
                  opacity: 0.9,
                }}
              />
            </div>
          </motion.div>

          {/* Technology name */}
          <span
            className="text-sm font-medium text-center leading-tight"
            style={{
              color: isLightColor(tech.color) ? 'rgba(255,255,255,0.9)' : tech.color,
            }}
          >
            {tech.name}
          </span>
        </div>

        {/* Tooltip */}
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none z-50"
          style={{
            background: tech.color,
            color: isLightColor(tech.color) ? '#000000' : '#ffffff',
            boxShadow: `0 4px 12px ${tech.color}40`,
          }}
          initial={{ opacity: 0, y: 8, scale: 0.9 }}
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? 0 : 8,
            scale: hovered ? 1 : 0.9,
          }}
          transition={{ duration: 0.2 }}
        >
          {tech.name}
          {/* Tooltip arrow */}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
            style={{ background: tech.color }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Technologies Section ────────────────────────────────────────────────
export default function Technologies() {
  return (
    <section id="technologies" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #0066ff, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, #8b5cf6, transparent 70%)',
            filter: 'blur(80px)',
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
              Tecnologías
              {/* Decorative gradient underline */}
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #0066ff, #8b5cf6, #00ffff)',
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
            Herramientas y lenguajes que domino para crear experiencias digitales excepcionales
          </motion.p>
        </motion.div>

        {/* Technologies grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {technologies.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
