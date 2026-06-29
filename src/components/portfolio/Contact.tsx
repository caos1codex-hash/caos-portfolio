'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Github, MapPin } from 'lucide-react';
import SectionReveal from '@/components/effects/SectionReveal';
import { toast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
  },
};

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@caos.dev',
    href: 'mailto:contacto@caos.dev',
  },
  {
    icon: Github,
    label: 'GitHub',
    value: 'github.com/caos1codex-hash',
    href: 'https://github.com/caos1codex-hash',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Paraguay',
    href: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      toast({
        title: '¡Mensaje enviado!',
        description: 'Gracias por contactarme. Te responderé pronto.',
      });
      setForm({ nombre: '', email: '', mensaje: '' });
      setIsSubmitting(false);
    }, 800);
  };

  const inputClasses =
    'w-full rounded-lg bg-white/[0.04] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 backdrop-blur-sm outline-none transition-all duration-300 focus:border-blue-500 focus:shadow-[0_0_16px_rgba(0,102,255,0.2)] hover:border-white/20';

  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Atmospheric background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,102,255,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <SectionReveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Contacto
            </h2>
            <p className="text-lg text-white/50 max-w-md mx-auto">
              ¿Tienes un proyecto en mente? Hablemos.
            </p>
          </div>
        </SectionReveal>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left column — Form */}
          <SectionReveal delay={0.15}>
            <motion.form
              onSubmit={handleSubmit}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="space-y-5"
            >
              {/* Nombre */}
              <motion.div variants={fieldVariants}>
                <label
                  htmlFor="nombre"
                  className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className={inputClasses}
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={fieldVariants}>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={inputClasses}
                />
              </motion.div>

              {/* Mensaje */}
              <motion.div variants={fieldVariants}>
                <label
                  htmlFor="mensaje"
                  className="block text-xs font-medium text-white/40 uppercase tracking-widest mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  required
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntame sobre tu proyecto..."
                  className={`${inputClasses} resize-none`}
                />
              </motion.div>

              {/* Submit */}
              <motion.div variants={fieldVariants}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center gap-2.5 rounded-lg bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(0,102,255,0.4),0_0_60px_rgba(0,102,255,0.15)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow:
                      '0 0 20px rgba(0,102,255,0.25), 0 0 40px rgba(0,102,255,0.1)',
                  }}
                >
                  {isSubmitting ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                  ) : (
                    <>
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          </SectionReveal>

          {/* Right column — Contact info & social */}
          <SectionReveal delay={0.3}>
            <div className="space-y-5">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_24px_rgba(0,102,255,0.12)]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_12px_rgba(0,102,255,0.3)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/30 uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-sm text-white/80 mt-0.5 truncate">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={item.label}>{content}</div>
                );
              })}

              {/* Social links row */}
              <div className="pt-6">
                <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-4">
                  Social
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/caos1codex-hash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-white/50 backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:text-blue-400 hover:bg-white/[0.05] hover:shadow-[0_0_20px_rgba(0,102,255,0.15)]"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
