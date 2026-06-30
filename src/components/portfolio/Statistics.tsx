'use client';

import { useEffect, useState } from 'react';
import { useGsapFadeIn, useGsapLineReveal, useGsapCounter } from '@/hooks/useGsap';
import { GitFork, Star, GitCommit, Calendar, Code2, Eye } from 'lucide-react';

type StatItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
};

export default function Statistics() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();
  const containerRef = useGsapFadeIn({ y: 20, delay: 0.2, duration: 0.8 });

  useEffect(() => {
    fetch('/api/github?type=user')
      .then(r => r.json())
      .then(data => {
        setStats([
          { icon: Code2, label: 'Repositorios', value: data.public_repos || 0 },
          { icon: GitCommit, label: 'Commits', value: data.totalCommits || 0 },
          { icon: Star, label: 'Stars', value: data.totalStars || 0 },
          { icon: GitFork, label: 'Forks', value: data.totalForks || 0 },
          { icon: Calendar, label: 'Años Programando', value: data.yearsCoding || 3 },
          { icon: Eye, label: 'Seguidores', value: data.followers || 0 },
        ]);
      })
      .catch(() => {
        setStats([
          { icon: Code2, label: 'Repositorios', value: 15 },
          { icon: GitCommit, label: 'Commits', value: 200 },
          { icon: Star, label: 'Stars', value: 10 },
          { icon: GitFork, label: 'Forks', value: 5 },
          { icon: Calendar, label: 'Años Programando', value: 3 },
          { icon: Eye, label: 'Seguidores', value: 0 },
        ]);
      });
  }, []);

  return (
    <section id='statistics' className='py-36 md:py-48 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-6 py-2.5 rounded-full mb-6'>
        <p className='text-sm tracking-[0.4em] uppercase text-white/40'>Estadísticas</p>
      </div>
      <h2 ref={headingRef} className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6'>
        En Números
      </h2>
      <div ref={lineRef} className='line-separator w-24 mb-15' />

      <div ref={containerRef} className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'>
        {stats.map(stat => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, label, value, suffix = '' }: StatItem) {
  const countRef = useGsapCounter(value, { duration: 2 });

  return (
    <div className='liquid-glass rounded-2xl p-8 text-center group liquid-glass-lift'>
      <div className='relative z-10'>
        <Icon className='w-8 h-8 text-[#1e90ff] mx-auto mb-5' />
        <span ref={countRef} className='text-4xl md:text-5xl font-bold text-white block'>
          0
        </span>
        <span className='text-xs uppercase tracking-wider text-white/30 mt-1.5 block'>
          {label}{suffix ? ` ${suffix}` : ''}
        </span>
      </div>
    </div>
  );
}