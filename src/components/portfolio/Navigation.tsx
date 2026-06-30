'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
      {/* Desktop nav - liquid glass */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'liquid-glass-nav'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-7xl mx-auto px-9 h-24 flex items-center justify-between'>
          <button
            onClick={() => handleClick('#hero')}
            className='text-2xl font-bold tracking-wider text-gradient-caos hover:opacity-80 transition-opacity'
            data-cursor-hover
          >
            CAOS
          </button>

          <div className='hidden md:flex items-center gap-1.5'>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className={`px-5 py-2.5 text-base font-medium rounded-xl transition-all duration-300 ${
                  active === item.href.slice(1)
                    ? 'liquid-glass-btn text-white'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
                data-cursor-hover
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className='md:hidden p-3 text-white/50 hover:text-white rounded-xl hover:bg-white/[0.04] transition-all'
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={33} /> : <Menu size={33} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu - liquid glass overlay */}
      {mobileOpen && (
        <div className='fixed inset-0 z-40 md:hidden' style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
        }}>
          <div className='flex flex-col gap-1.5 pt-36 px-9'>
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.href}
                ref={(el) => { if (el) mobileItemsRef.current[i] = el; }}
                onClick={() => handleClick(item.href)}
                className={`text-left py-5 px-8 text-2xl font-medium rounded-2xl transition-all duration-300 ${
                  active === item.href.slice(1)
                    ? 'liquid-glass-btn text-white'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
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