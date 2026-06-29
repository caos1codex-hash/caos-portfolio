'use client';

import { Github, Mail, Send, ArrowUpRight } from 'lucide-react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';

export default function Contact() {
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const inputClass =
    'w-full rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 focus:border-[#0a84ff]/30 hover:border-white/10';

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
    <section id='contact' className='py-24 md:py-32 section-padding'>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Contacto
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Hablemos
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-10' />

      <div className='grid md:grid-cols-2 gap-10 max-w-4xl'>
        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input name='name' type='text' placeholder='Nombre' required className={inputClass} />
          <input name='email' type='email' placeholder='Email' required className={inputClass} />
          <textarea name='message' placeholder='Tu mensaje...' rows={5} required className={`${inputClass} resize-none`} />
          <button
            type='submit'
            className='magnetic-btn group flex items-center gap-2 px-6 py-3 bg-[#0a84ff] hover:bg-[#0070e0] text-white text-sm font-medium rounded-lg transition-colors w-full justify-center'
            data-cursor-hover
          >
            Enviar Mensaje
            <Send className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
          </button>
        </form>

        {/* Links */}
        <div className='space-y-4'>
          {LINKS.map(({ icon: Icon, label, href, value }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className='group flex items-center gap-4 p-4 glass rounded-xl hover:border-[#0a84ff]/15 transition-all duration-500'
              data-cursor-hover
            >
              <div className='w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-[#0a84ff]/10 transition-colors'>
                <Icon className='w-4 h-4 text-white/30 group-hover:text-[#0a84ff] transition-colors' />
              </div>
              <div className='flex-1'>
                <p className='text-[10px] uppercase tracking-wider text-white/25'>{label}</p>
                <p className='text-sm text-white/60 group-hover:text-white/80 transition-colors'>{value}</p>
              </div>
              <ArrowUpRight className='w-4 h-4 text-white/15 group-hover:text-[#0a84ff] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
