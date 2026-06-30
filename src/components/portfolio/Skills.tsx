'use client';

import { useState } from 'react';
import { useGsapFadeIn, useGsapLineReveal, useGsapStagger } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe, Server, Database, Wrench, Brain, Gamepad2,
  FileCode, Cpu, Terminal, Palette, Layers,
  Cog, Box, Container, GitBranch, Figma,
  MonitorSmartphone, Workflow, Bot, Network, Sparkles, Joystick, type LucideIcon
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Category = 'all' | 'frontend' | 'backend' | 'databases' | 'tools' | 'ai' | 'gamedev';

interface SkillItem { name: string; icon: LucideIcon }

interface SkillCategory {
  id: Category;
  label: string;
  skills: SkillItem[]
}

const CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'HTML5', icon: Globe },
      { name: 'CSS3', icon: Palette },
      { name: 'JavaScript', icon: FileCode },
      { name: 'TypeScript', icon: Cpu },
      { name: 'React', icon: Layers },
      { name: 'Next.js', icon: Box },
      { name: 'Tailwind CSS', icon: Terminal },
      { name: 'GSAP', icon: Sparkles },
      { name: 'Three.js', icon: Box },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js', icon: Server },
      { name: 'Bun', icon: Cog },
      { name: 'Python', icon: Terminal },
      { name: 'PHP', icon: FileCode },
      { name: 'REST APIs', icon: Network },
      { name: 'GraphQL', icon: Workflow },
    ],
  },
  {
    id: 'databases',
    label: 'Bases de Datos',
    skills: [
      { name: 'PostgreSQL', icon: Database },
      { name: 'MySQL', icon: Database },
      { name: 'SQLite', icon: Database },
      { name: 'MongoDB', icon: Container },
      { name: 'Prisma', icon: Layers },
      { name: 'Supabase', icon: Server },
    ],
  },
  {
    id: 'tools',
    label: 'Herramientas',
    skills: [
      { name: 'Git', icon: GitBranch },
      { name: 'GitHub', icon: GitBranch },
      { name: 'Docker', icon: Container },
      { name: 'VS Code', icon: Cog },
      { name: 'Figma', icon: Figma },
      { name: 'Vercel', icon: MonitorSmartphone },
      { name: 'Netlify', icon: Globe },
      { name: 'Linux', icon: Terminal },
    ],
  },
  {
    id: 'ai',
    label: 'IA',
    skills: [
      { name: 'OpenAI', icon: Bot },
      { name: 'LangChain', icon: Network },
      { name: 'Machine Learning', icon: Brain },
      { name: 'NLP', icon: Cpu },
      { name: 'Prompt Engineering', icon: Sparkles },
    ],
  },
  {
    id: 'gamedev',
    label: 'Game Dev',
    skills: [
      { name: 'WebGL', icon: Box },
      { name: 'GLSL Shaders', icon: Cpu },
      { name: 'Three.js', icon: Layers },
      { name: 'Canvas API', icon: Palette },
      { name: 'Game Physics', icon: Joystick },
    ],
  },
];

const TABS: { id: Category; label: string }[] = [
  { id: 'all', label: 'Todos' },
  ...CATEGORIES.map(c => ({ id: c.id, label: c.label })),
];

export default function Skills() {
  const [active, setActive] = useState<Category>('all');
  const gridRef = useGsapStagger({ stagger: 0.04, y: 20, duration: 0.6 });
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const tabsRef = useGsapFadeIn({ y: 15, delay: 0.2 });

  const visible = active === 'all' ? CATEGORIES : CATEGORIES.filter(c => c.id === active);

  return (
    <section id='skills' className='py-36 md:py-48 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-6 py-2.5 rounded-full mb-6'>
        <p className='text-sm tracking-[0.4em] uppercase text-white/40'>Habilidades</p>
      </div>
      <h2 ref={headingRef} className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6'>
        Technologies & Tools
      </h2>
      <div ref={lineRef} className='line-separator w-24 mb-12' />

      {/* Tabs - liquid glass */}
      <div ref={tabsRef} className='flex flex-wrap gap-3 mb-15'>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
              active === tab.id
                ? 'liquid-glass-btn text-white border-[#1e90ff]/20'
                : 'liquid-glass-btn text-white/40'
            }`}
            data-cursor-hover
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills grid - liquid glass cards */}
      <div ref={gridRef} className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
        {visible.map(cat => (
          <div key={cat.id} className='liquid-glass rounded-2xl p-8 group liquid-glass-lift'>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-[#1e90ff] mb-6 relative z-10'>{cat.label}</h3>
            <div className='grid grid-cols-3 gap-4 relative z-10'>
              {cat.skills.map(skill => (
                <div
                  key={skill.name}
                  className='flex flex-col items-center gap-2.5 py-4 px-1.5 rounded-xl hover:bg-white/[0.04] transition-colors liquid-glass-btn'
                  data-cursor-hover
                >
                  <skill.icon className='w-6 h-6 text-white/30 group-hover:text-[#1e90ff] transition-colors' />
                  <span className='text-xs text-white/30 group-hover:text-white/60 text-center leading-tight transition-colors'>
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}