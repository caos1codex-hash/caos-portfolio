'use client';

import { useState } from 'react';
import { useGsapFadeIn, useGsapLineReveal, useGsapStagger } from '@/hooks/useGsap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe, Server, Database, Wrench, Brain, Gamepad2,
  Html, FileCode, Cpu, Terminal, Palette, Layers,
  Framework, Cog, Box, Container, GitBranch, Figma,
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
      { name: 'Next.js', icon: Framework },
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
    <section id='skills' className='py-24 md:py-32 section-padding'>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Habilidades
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        Technologies & Tools
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-8' />

      {/* Tabs */}
      <div ref={tabsRef} className='flex flex-wrap gap-2 mb-10'>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
              active === tab.id
                ? 'bg-[#0a84ff] text-white'
                : 'bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
            }`}
            data-cursor-hover
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div ref={gridRef} className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {visible.map(cat => (
          <div key={cat.id} className='glass rounded-xl p-5 group hover:border-[#0a84ff]/15 transition-all duration-500'>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-[#0a84ff] mb-4'>{cat.label}</h3>
            <div className='grid grid-cols-3 gap-2.5'>
              {cat.skills.map(skill => (
                <div
                  key={skill.name}
                  className='flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg hover:bg-white/[0.03] transition-colors'
                  data-cursor-hover
                >
                  <skill.icon className='w-4 h-4 text-white/30 group-hover:text-[#0a84ff] transition-colors' />
                  <span className='text-[10px] text-white/30 group-hover:text-white/60 text-center leading-tight transition-colors'>
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
