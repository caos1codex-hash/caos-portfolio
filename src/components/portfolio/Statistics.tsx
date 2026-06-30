'use client';

import { useEffect, useState } from 'react';
import { useGsapFadeIn, useGsapLineReveal, useGsapCounter } from '@/hooks/useGsap';
import { GitFork, Star, GitCommit, Calendar, Code2, Eye } from 'lucide-react';

type StatItem = {
  icon: React.ElementType;
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
    <section id='statistics' className='py-24 md:py-32 section-padding'>
      <p ref={labelRef} className='text-xs tracking-[0.4em] uppercase text-white/25 mb-4'>
        Estadísticas
      </p>
      <h2 ref={headingRef} className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4'>
        En Números
      </h2>
      <div ref={lineRef} className='line-separator w-16 mb-10' />

      <div ref={containerRef} className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
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
    <div className='glass rounded-xl p-5 text-center group hover:border-[#0a84ff]/15 transition-all duration-500 card-lift'>
      <Icon className='w-5 h-5 text-[#0a84ff] mx-auto mb-3 group-hover:scale-110 transition-transform duration-300' />
      <span ref={countRef} className='text-2xl md:text-3xl font-bold text-white block'>
        0
      </span>
      <span className='text-[10px] uppercase tracking-wider text-white/25 mt-1 block'>
        {label}{suffix ? ` ${suffix}` : ''}
      </span>
    </div>
  );
}
