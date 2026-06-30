'use client';

import { useRef, useEffect } from 'react';
import { MapPin, User, Code2, Sparkles, Target } from 'lucide-react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INFO = [
  { icon: User, label: 'Nombre', value: 'Miguel Antonio Chávez Villalba' },
  { icon: Code2, label: 'Alias', value: 'CAOS' },
  { icon: Target, label: 'Rol', value: 'Full Stack Developer' },
  { icon: MapPin, label: 'Ubicación', value: 'Paraguay' },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const labelRef = useGsapFadeIn({ y: 20, blur: 4, duration: 0.8 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1, duration: 0.8 });
  const lineRef = useGsapLineReveal();
  const p1Ref = useGsapFadeIn({ y: 20, delay: 0.15, duration: 0.8 });
  const p2Ref = useGsapFadeIn({ y: 20, delay: 0.25, duration: 0.8 });
  const p3Ref = useGsapFadeIn({ y: 20, delay: 0.35, duration: 0.8 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, x: 30, filter: 'blur(6px)' },
      {
        opacity: 1, x: 0, filter: 'blur(0px)',
        duration: 0.9, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true },
      }
    );
  }, []);

  return (
    <section id='about' className='py-24 md:py-32 section-padding w-full' ref={sectionRef}>
      {/* Label - liquid glass pill */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-4 py-1.5 rounded-full mb-4'>
        <p className='text-xs tracking-[0.4em] uppercase text-white/40'>Sobre Mí</p>
      </div>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        From Chaos to Code.
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-10' />

      <div className='grid md:grid-cols-5 gap-10 md:gap-16'>
        {/* Text - wrapped in liquid glass block */}
        <div className='md:col-span-3 space-y-5'>
          <div ref={p1Ref} className='liquid-glass-text rounded-xl p-5'>
            <p className='text-sm sm:text-base text-white/50 leading-relaxed'>
              Comencé mi viaje en el mundo de la programación siendo muy joven, autodidacta y con una curiosidad
              insaciable por entender cómo funcionan las cosas. Lo que empezó como un hobby se convirtió en una
              pasión que define quién soy hoy.
            </p>
          </div>
          <div ref={p2Ref} className='liquid-glass-text rounded-xl p-5'>
            <p className='text-sm sm:text-base text-white/50 leading-relaxed'>
              Disfruto crear experiencias digitales únicas, interfaces limpias y código elegante. Me especializo
              en el ecosistema de JavaScript, desde el frontend con React y Next.js hasta el backend con Node.js,
              siempre buscando el equilibrio perfecto entre diseño y rendimiento.
            </p>
          </div>
          <div ref={p3Ref} className='liquid-glass-text rounded-xl p-5'>
            <p className='text-sm sm:text-base text-white/50 leading-relaxed'>
              Mi objetivo es convertirte en uno de los mejores desarrolladores de la región, explorando
              constantemente nuevas tecnologías como la inteligencia artificial, los shaders GLSL y las
              experiencias 3D en la web. Cada proyecto es una oportunidad para aprender algo nuevo.
            </p>
          </div>
        </div>

        {/* Info card - liquid glass */}
        <div ref={cardRef} className='md:col-span-2'>
          <div className='liquid-glass rounded-2xl p-6 space-y-4'>
            {INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className='flex items-center gap-3.5 relative z-10'>
                <div className='w-9 h-9 rounded-lg liquid-glass-btn flex items-center justify-center flex-shrink-0'>
                  <Icon className='w-4 h-4 text-[#1e90ff]' />
                </div>
                <div>
                  <p className='text-[11px] uppercase tracking-wider text-white/30'>{label}</p>
                  <p className='text-sm text-white/75 font-medium'>{value}</p>
                </div>
              </div>
            ))}
            <div className='pt-2 flex items-center gap-3.5 relative z-10'>
              <div className='w-9 h-9 rounded-lg liquid-glass-btn flex items-center justify-center flex-shrink-0'>
                <Sparkles className='w-4 h-4 text-[#00d4ff]' />
              </div>
              <div>
                <p className='text-[11px] uppercase tracking-wider text-white/30'>Edad</p>
                <p className='text-sm text-white/75 font-medium'>17 años</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}