'use client';

import { motion } from 'framer-motion';
import { Globe, Monitor, Server, Layers, Palette, MessageSquare } from 'lucide-react';
import SectionReveal from '@/components/effects/SectionReveal';

interface Service {
  title: string;
  description: string;
  icon: React.ElementType;
}

const services: Service[] = [
  {
    title: 'Desarrollo Web',
    description:
      'Creación de aplicaciones web modernas y responsivas con las últimas tecnologías',
    icon: Globe,
  },
  {
    title: 'Frontend',
    description:
      'Interfaces de usuario interactivas y visualmente impactantes con React, Next.js y animaciones',
    icon: Monitor,
  },
  {
    title: 'Backend',
    description:
      'APIs robustas y escalables con Node.js, Express, PHP y bases de datos',
    icon: Server,
  },
  {
    title: 'Full Stack',
    description:
      'Soluciones completas de principio a fin, desde el diseño hasta el despliegue',
    icon: Layers,
  },
  {
    title: 'UI/UX Design',
    description:
      'Diseños centrados en el usuario con experiencias memorables',
    icon: Palette,
  },
  {
    title: 'Consultoría',
    description:
      'Asesoramiento técnico y arquitectura de software para tu proyecto',
    icon: MessageSquare,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -4 }}
      className="group relative glass rounded-2xl p-6 md:p-8 cursor-default overflow-hidden"
    >
      {/* Hover border glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,102,255,0.12), rgba(139,92,246,0.08), rgba(0,255,255,0.06))',
            border: '1px solid rgba(0,102,255,0.15)',
          }}
        />
      </div>

      {/* Icon glow background */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-700 pointer-events-none bg-[#0066ff]" />

      {/* Icon */}
      <div className="relative z-10 mb-5">
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 group-hover:border-[#0066ff]/30 transition-colors duration-500"
          style={{
            boxShadow: '0 0 0px rgba(0,102,255,0)',
          }}
          whileHover={{
            scale: 1.1,
            rotate: 5,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <Icon
            className="w-5 h-5 text-[#0066ff] group-hover:text-[#0066ff] transition-colors duration-300"
            strokeWidth={1.8}
          />
          {/* Blue glow behind icon */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            style={{
              boxShadow: '0 0 20px rgba(0,102,255,0.4), 0 0 40px rgba(0,102,255,0.15)',
            }}
          />
        </motion.div>
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-lg font-bold text-white mb-2 group-hover:text-glow-blue transition-all duration-300">
        {service.title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
        {service.description}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0066ff]/0 to-transparent group-hover:via-[#0066ff]/50 transition-all duration-700" />
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionReveal>
          <div className="mb-16 text-center">
            <motion.span
              className="inline-block text-xs font-mono tracking-[0.3em] uppercase text-[#8b5cf6] text-glow-purple mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Lo que hago
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Servicios
            </h2>
            <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#0066ff]" />
          </div>
        </SectionReveal>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
