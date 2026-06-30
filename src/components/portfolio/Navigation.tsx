'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu, X, Github } from 'lucide-react';
import gsap from 'gsap';

const NAV_ITEMS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Sobre Mí', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Stats', href: '#statistics' },
  { label: 'Contacto', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const mobileItemsRef = useRef<HTMLButtonElement[]>([]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY;
      setScrolled(s > 50);

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].href.slice(1));
        if (el && el.getBoundingClientRect().top <= 200) {
          setActive(NAV_ITEMS[i].href.slice(1));
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    gsap.fromTo(
      mobileItemsRef.current.filter(Boolean),
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' }
    );
  }, [mobileOpen]);

  const handleClick = useCallback((href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* Desktop nav */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-2xl border-b border-white/[0.04] shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          <button
            onClick={() => handleClick('#hero')}
            className='text-lg font-bold tracking-wider text-gradient-caos hover:opacity-80 transition-opacity'
            data-cursor-hover
          >
            CAOS
          </button>

          <div className='hidden md:flex items-center gap-1'>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-all duration-300 ${
                  active === item.href.slice(1)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
                data-cursor-hover
              >
                {item.label}
              </button>
            ))}
            <div className='w-px h-4 bg-white/[0.06] mx-2' />
            <a
              href='https://github.com/caos1codex-hash'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 text-white/30 hover:text-white/70 transition-colors rounded-md hover:bg-white/[0.03]'
              data-cursor-hover
              aria-label='GitHub'
            >
              <Github className='w-4 h-4' />
            </a>
          </div>

          <button
            className='md:hidden p-2 text-white/60 hover:text-white transition-colors'
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl pt-20 px-6 md:hidden'>
          <div className='flex flex-col gap-1'>
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.href}
                ref={(el) => { if (el) mobileItemsRef.current[i] = el; }}
                onClick={() => handleClick(item.href)}
                className={`text-left py-3.5 px-4 text-lg font-medium rounded-xl transition-all duration-300 ${
                  active === item.href.slice(1)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className='mt-8 pt-6 border-t border-white/[0.06]'>
            <a
              href='https://github.com/caos1codex-hash'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white transition-colors'
              data-cursor-hover
            >
              <Github className='w-5 h-5' />
              <span className='text-sm'>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
