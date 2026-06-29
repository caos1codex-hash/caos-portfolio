'use client';

import { Github } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='mt-auto border-t border-white/[0.04]'>
      <div className='section-padding py-10 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-center sm:text-left'>
          <p className='text-sm font-semibold text-gradient-caos'>CAOS</p>
          <p className='text-[11px] text-white/20 mt-0.5'>From Chaos to Code.</p>
        </div>

        <p className='text-[11px] text-white/15'>
          © {year} Miguel Antonio Chávez Villalba. Todos los derechos reservados.
        </p>

        <a
          href='https://github.com/caos1codex-hash'
          target='_blank'
          rel='noopener noreferrer'
          className='text-white/20 hover:text-white/50 transition-colors'
          data-cursor-hover
        >
          <Github className='w-4 h-4' />
        </a>
      </div>
    </footer>
  );
}
