'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SectionReveal from '@/components/effects/SectionReveal';

// ─── Animation Variants ──────────────────────────────────────────────────────

const lineVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(8px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(6px)',
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      delay: 1.4 + i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const scrollIndicatorVariants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 2.2,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function Hero() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* ─── Atmospheric Background (disabled - flat black) ──────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ visibility: 'hidden' }}>
        {/* Central radial glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '900px',
            height: '600px',
            background:
              'radial-gradient(ellipse at center, rgba(0,255,136,0.06) 0%, rgba(139,92,246,0.03) 30%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Top edge light */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: '600px',
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, rgba(0,255,136,0.3) 30%, rgba(139,92,246,0.3) 70%, transparent)',
            boxShadow: '0 0 30px rgba(0,255,136,0.2), 0 0 80px rgba(0,255,136,0.05)',
          }}
        />
      </div>

      {/* ─── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">
        {/* Small intro */}
        <motion.span
          className="text-lg text-muted tracking-[0.3em] uppercase mb-6"
          custom={0}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        >
          Hola.
        </motion.span>

        {/* Name lines */}
        <div className="space-y-1 md:space-y-2">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white"
            custom={1}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            Soy
          </motion.h1>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-caos-blue to-caos-purple bg-clip-text text-transparent"
            custom={2}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            Miguel Antonio
          </motion.h1>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white"
            custom={3}
            variants={lineVariants}
            initial="hidden"
            animate="visible"
          >
            Chávez Villalba
          </motion.h1>
        </div>

        {/* CAOS — massive with shimmer */}
        <SectionReveal delay={0.6}>
          <h2
            className="text-7xl md:text-9xl lg:text-[12rem] font-black tracking-wider text-glow-blue mt-4 md:mt-6"
            style={{
              background:
                'linear-gradient(90deg, #ffffff 0%, #0066ff 25%, #8b5cf6 50%, #0066ff 75%, #ffffff 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 4s ease-in-out infinite',
            }}
          >
            CAOS
          </h2>
        </SectionReveal>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mt-6 md:mt-8"
          custom={4}
          variants={lineVariants}
          initial="hidden"
          animate="visible"
        >
          Desarrollador Web Full Stack
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 md:mt-12">
          <motion.button
            custom={0}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            onClick={scrollToAbout}
            className="group relative px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,102,255,0.4)] cursor-pointer"
          >
            <span className="relative z-10">Explorar</span>
            {/* Glow layer */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-500/20 blur-xl" />
          </motion.button>

          <motion.button
            custom={1}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            onClick={scrollToContact}
            className="group px-8 py-3.5 border border-white/10 hover:border-blue-500/50 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.15)] cursor-pointer"
          >
            Contactar
          </motion.button>
        </div>
      </div>

      {/* ─── Scroll Indicator ────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
