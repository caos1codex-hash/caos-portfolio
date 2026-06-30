'use client';

import { Github, Mail, Send, ArrowUpRight, MessageSquare, MapPin } from 'lucide-react';
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
    { icon: Github, label: 'GitHub', href: 'https://github.com/caos1codex-hash', value: '@caos1codex-hash', color: 'text-white' },
    { icon: Mail, label: 'Email', href: 'mailto:miguelchavez@caos.dev', value: 'miguelchavez@caos.dev', color: 'text-[#0a84ff]' },
    { icon: MapPin, label: 'Ubicación', href: '#', value: 'Paraguay', color: 'text-[#00d4ff]' },
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
        <div>
          <p className='text-sm text-white/30 mb-6 leading-relaxed'>
            ¿Tienes un proyecto en mente o simplemente quieres saludar? Me encantaría saber de ti.
          </p>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input name='name' type='text' placeholder='Nombre' required className={inputClass} aria-label='Nombre' />
            <input name='email' type='email' placeholder='Email' required className={inputClass} aria-label='Email' />
            <textarea name='message' placeholder='Tu mensaje...' rows={5} required className={`${inputClass} resize-none`} aria-label='Mensaje' />
            <button
              type='submit'
              className='magnetic-btn group relative flex items-center justify-center gap-2 px-6 py-3 bg-[#0a84ff] hover:bg-[#0070e0] text-white text-sm font-medium rounded-lg transition-colors w-full overflow-hidden'
              data-cursor-hover
            >
              <span className='relative z-10 flex items-center gap-2'>
                <Send className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
                Enviar Mensaje
              </span>
              <div className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700' />
            </button>
          </form>
        </div>

        {/* Links */}
        <div className='space-y-3'>
          <p className='text-xs uppercase tracking-wider text-white/20 mb-4'>Encuéntrame en</p>
          {LINKS.map(({ icon: Icon, label, href, value, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className='group flex items-center gap-4 p-4 glass rounded-xl hover:border-[#0a84ff]/15 transition-all duration-500'
              data-cursor-hover
            >
              <div className='w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-[#0a84ff]/10 transition-colors'>
                <Icon className={`w-4 h-4 text-white/30 group-hover:${color} transition-colors`} style={{ color: undefined }} />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-[10px] uppercase tracking-wider text-white/25'>{label}</p>
                <p className='text-sm text-white/60 group-hover:text-white/80 transition-colors truncate'>{value}</p>
              </div>
              <ArrowUpRight className='w-4 h-4 text-white/15 group-hover:text-[#0a84ff] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0' />
            </a>
          ))}

          {/* CTA card */}
          <div className='glass rounded-xl p-5 mt-4 relative overflow-hidden'>
            <div className='absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#0a84ff]/5 blur-2xl pointer-events-none' />
            <MessageSquare className='w-6 h-6 text-[#0a84ff] mb-3' />
            <h3 className='text-sm font-semibold text-white/80 mb-1'>¿Colaboración?</h3>
            <p className='text-xs text-white/30 leading-relaxed'>
              Siempre estoy abierto a nuevos proyectos, ideas creativas y oportunidades para aprender y crecer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
