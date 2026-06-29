'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

const NAV_ITEMS = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Sobre Mí', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Contacto', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const mobileItemsRef = useRef<HTMLButtonElement[]>([]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/[0.04]'
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
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  active === item.href.slice(1)
                    ? 'text-white bg-white/[0.05]'
                    : 'text-white/50 hover:text-white'
                }`}
                data-cursor-hover
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className='md:hidden p-2 text-white/60 hover:text-white'
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20 px-6 md:hidden'>
          <div className='flex flex-col gap-1'>
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.href}
                ref={(el) => { if (el) mobileItemsRef.current[i] = el; }}
                onClick={() => handleClick(item.href)}
                className={`text-left py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                  active === item.href.slice(1)
                    ? 'text-white bg-white/[0.05]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
