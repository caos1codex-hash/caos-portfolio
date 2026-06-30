'use client';

import { Github, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-auto border-t border-white/[0.04]'>
      <div className='section-padding py-12'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
          {/* Left */}
          <div className='text-center md:text-left'>
            <p className='text-sm font-bold text-gradient-caos'>CAOS</p>
            <p className='text-[11px] text-white/20 mt-1'>From Chaos to Code.</p>
            <p className='text-[10px] text-white/10 mt-1 flex items-center justify-center md:justify-start gap-1'>
              Hecho con <Heart className='w-3 h-3 text-red-500/50 fill-red-500/50' /> por Miguel Antonio Chávez Villalba
            </p>
          </div>

          {/* Center links */}
          <div className='flex items-center gap-6'>
            {[
              { label: 'Inicio', href: '#hero' },
              { label: 'Sobre Mí', href: '#about' },
              { label: 'Proyectos', href: '#projects' },
              { label: 'Contacto', href: '#contact' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className='text-[11px] text-white/20 hover:text-white/60 transition-colors'
                data-cursor-hover
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <a
            href='https://github.com/caos1codex-hash'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 text-white/20 hover:text-white/50 transition-colors group'
            data-cursor-hover
          >
            <Github className='w-4 h-4' />
            <span className='text-[11px]'>GitHub</span>
            <ArrowUpRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
          </a>
        </div>

        <div className='mt-8 pt-6 border-t border-white/[0.03] text-center'>
          <p className='text-[10px] text-white/10'>
            © {year} Miguel Antonio Chávez Villalba. Todos los derechos reservados. Asunción, Paraguay.
          </p>
        </div>
      </div>
    </footer>
  );
}
