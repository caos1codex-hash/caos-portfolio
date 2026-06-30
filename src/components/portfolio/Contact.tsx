'use client';

import { Github, Mail, Send, ArrowUpRight, Phone, Instagram, Linkedin, Facebook } from 'lucide-react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';

export default function Contact() {
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    window.location.href = `mailto:miguelchavez@caos.dev?subject=Contacto desde Portfolio&body=Nombre: ${name}%0AEmail: ${email}%0A%0A${message}`;
  };

  const LINKS = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/caos1codex-hash', value: '@caos1codex-hash' },
    { icon: Phone, label: 'WhatsApp', href: 'https://wa.me/595981103689', value: '+595 981 103 689' },
    { icon: Mail, label: 'Gmail', href: 'mailto:mchavezvillalba732@gmail.com', value: 'mchavezvillalba732@gmail.com' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/m.chavez.caos', value: '@m.chavez.caos' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguel-antonio-chavez-villalba-b08185407/', value: 'Miguel Antonio Chávez Villalba' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590345677739', value: 'Miguel Chávez' },
  ];

  return (
    <section id='contact' className='py-36 md:py-48 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-6 py-2.5 rounded-full mb-6'>
        <p className='text-sm tracking-[0.4em] uppercase text-white/40'>Contacto</p>
      </div>
      <h2 ref={headingRef} className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6'>
        Hablemos
      </h2>
      <div ref={lineRef} className='line-separator w-24 mb-15' />

      <div className='grid md:grid-cols-2 gap-15 max-w-6xl'>
        {/* Form - liquid glass */}
        <form onSubmit={handleSubmit} className='liquid-glass rounded-3xl p-9 space-y-6'>
          <input name='name' type='text' placeholder='Nombre' required className='w-full liquid-glass-input rounded-xl px-6 py-5 text-base text-white placeholder-white/20 outline-none' />
          <input name='email' type='email' placeholder='Email' required className='w-full liquid-glass-input rounded-xl px-6 py-5 text-base text-white placeholder-white/20 outline-none' />
          <textarea name='message' placeholder='Tu mensaje...' rows={6} required className='w-full liquid-glass-input rounded-xl px-6 py-5 text-base text-white placeholder-white/20 outline-none resize-none' />
          <button
            type='submit'
            className='magnetic-btn liquid-glass-btn w-full flex items-center justify-center gap-3 px-9 py-5 text-white text-base font-medium rounded-xl'
            data-cursor-hover
          >
            <span className='relative z-10 flex items-center gap-3'>
              Enviar Mensaje
              <Send className='w-6 h-6 transition-transform group-hover:translate-x-0.5' />
            </span>
          </button>
        </form>

        {/* Links - liquid glass cards */}
        <div className='space-y-6'>
          {LINKS.map(({ icon: Icon, label, href, value }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className='group flex items-center gap-6 p-6 liquid-glass rounded-xl liquid-glass-lift'
              data-cursor-hover
            >
              <div className='w-16 h-16 rounded-2xl liquid-glass-btn flex items-center justify-center flex-shrink-0'>
                <Icon className='w-6 h-6 text-white/30 group-hover:text-[#1e90ff] transition-colors' />
              </div>
              <div className='flex-1 relative z-10'>
                <p className='text-xs uppercase tracking-wider text-white/30'>{label}</p>
                <p className='text-base text-white/60 group-hover:text-white/80 transition-colors'>{value}</p>
              </div>
              <ArrowUpRight className='w-6 h-6 text-white/15 group-hover:text-[#1e90ff] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
