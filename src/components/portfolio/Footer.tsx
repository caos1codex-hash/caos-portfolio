'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-auto border-t border-white/[0.04]'>
      <div className='section-padding py-15 flex flex-col sm:flex-row items-center justify-between gap-6'>
        <div className='text-center sm:text-left'>
          <p className='text-base font-semibold text-gradient-caos'>CAOS</p>
          <p className='text-xs text-white/15 mt-1'>From Chaos to Code.</p>
        </div>

        <p className='text-xs text-white/10'>
          © {year} Miguel Antonio Chávez Villalba. Todos los derechos reservados.
        </p>

        <a
          href='https://github.com/caos1codex-hash'
          target='_blank'
          rel='noopener noreferrer'
          className='liquid-glass-btn w-14 h-14 rounded-xl flex items-center justify-center text-white/20 hover:text-white/50 transition-colors'
          data-cursor-hover
        >
          <Github className='w-5 h-5' />
        </a>
      </div>
    </footer>
  );
}