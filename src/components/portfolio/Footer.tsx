'use client';

import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Sobre Mí', href: '#about' },
  { label: 'Tecnologías', href: '#technologies' },
  { label: 'Proyectos', href: '#projects' },
  { label: 'Contacto', href: '#contact' },
];

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-auto relative">
      {/* Gradient separator line */}
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #0066ff 20%, #7c3aed 50%, transparent 100%)',
        }}
      />

      <div className="border-t-0 bg-black/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left — Logo & copyright */}
            <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
              <motion.span
                className="text-2xl font-bold tracking-wider"
                style={{
                  color: '#fff',
                  textShadow: `
                    0 0 8px rgba(0,102,255,0.7),
                    0 0 20px rgba(0,102,255,0.4),
                    0 0 40px rgba(0,102,255,0.2)
                  `,
                }}
                whileHover={{
                  textShadow: `
                    0 0 12px rgba(0,102,255,0.9),
                    0 0 30px rgba(0,102,255,0.6),
                    0 0 60px rgba(0,102,255,0.3)
                  `,
                }}
                transition={{ duration: 0.3 }}
              >
                CAOS
              </motion.span>
              <p className="text-xs text-white/30 leading-relaxed">
                &copy; 2025 Miguel Antonio Chávez Villalba.
                <br className="sm:hidden" />{' '}
                Todos los derechos reservados.
              </p>
            </div>

            {/* Center — Nav links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-white/40 transition-all duration-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(0,102,255,0.4)] relative after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right — GitHub */}
            <a
              href="https://github.com/caos1codex-hash"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/40 backdrop-blur-md transition-all duration-300 hover:border-blue-500/30 hover:text-blue-400 hover:bg-white/[0.06] hover:shadow-[0_0_16px_rgba(0,102,255,0.2)]"
              aria-label="GitHub"
            >
              <Github className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
            </a>
          </div>

          {/* Bottom tagline */}
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-xs text-white/25">
              Hecho con ❤️ y mucho ☕ por CAOS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
