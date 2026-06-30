'use client';

import { Github, Mail, Send, ArrowUpRight } from 'lucide-react';
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
    { icon: Mail, label: 'Email', href: 'mailto:miguelchavez@caos.dev', value: 'miguelchavez@caos.dev' },
  ];

  return (
    <section id='contact' className='py-24 md:py-32 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-4 py-1.5 rounded-full mb-4'>
        <p className='text-xs tracking-[0.4em] uppercase text-white/40'>Contacto</p>
      </div>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Hablemos
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-10' />

      <div className='grid md:grid-cols-2 gap-10 max-w-4xl'>
        {/* Form - liquid glass */}
        <form onSubmit={handleSubmit} className='liquid-glass rounded-2xl p-6 space-y-4'>
          <input name='name' type='text' placeholder='Nombre' required className='w-full liquid-glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none' />
          <input name='email' type='email' placeholder='Email' required className='w-full liquid-glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none' />
          <textarea name='message' placeholder='Tu mensaje...' rows={5} required className='w-full liquid-glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none resize-none' />
          <button
            type='submit'
            className='magnetic-btn liquid-glass-btn w-full flex items-center justify-center gap-2 px-6 py-3 text-white text-sm font-medium rounded-xl'
            data-cursor-hover
          >
            <span className='relative z-10 flex items-center gap-2'>
              Enviar Mensaje
              <Send className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
            </span>
          </button>
        </form>

        {/* Links - liquid glass cards */}
        <div className='space-y-4'>
          {LINKS.map(({ icon: Icon, label, href, value }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className='group flex items-center gap-4 p-4 liquid-glass rounded-xl liquid-glass-lift'
              data-cursor-hover
            >
              <div className='w-10 h-10 rounded-lg liquid-glass-btn flex items-center justify-center flex-shrink-0'>
                <Icon className='w-4 h-4 text-white/30 group-hover:text-[#1e90ff] transition-colors' />
              </div>
              <div className='flex-1 relative z-10'>
                <p className='text-[10px] uppercase tracking-wider text-white/30'>{label}</p>
                <p className='text-sm text-white/60 group-hover:text-white/80 transition-colors'>{value}</p>
              </div>
              <ArrowUpRight className='w-4 h-4 text-white/15 group-hover:text-[#1e90ff] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}