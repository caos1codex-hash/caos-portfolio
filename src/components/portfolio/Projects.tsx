'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { ExternalLink, Github, Search, Eye } from 'lucide-react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';
import type { EnrichedRepo } from '@/app/api/github/route';

type SortKey = 'updated' | 'stars' | 'name';

export default function Projects() {
  const [repos, setRepos] = useState<EnrichedRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('updated');
  const [langFilter, setLangFilter] = useState<string>('all');

  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();

  useEffect(() => {
    fetch('/api/github?type=repos')
      .then(r => r.json())
      .then(data => { setRepos(Array.isArray(data) ? data : []); })
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.primaryLanguage).filter(Boolean));
    return ['all', ...Array.from(langs).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    let result = repos.filter(r => !r.isArchived);
    if (langFilter !== 'all') result = result.filter(r => r.primaryLanguage === langFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        r.topics.some(t => t.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return result;
  }, [repos, search, sort, langFilter]);

  return (
    <section id='projects' className='py-36 md:py-48 section-padding w-full'>
      {/* Label */}
      <div ref={labelRef} className='liquid-glass-text inline-block px-6 py-2.5 rounded-full mb-6'>
        <p className='text-sm tracking-[0.4em] uppercase text-white/40'>Proyectos</p>
      </div>
      <h2 ref={headingRef} className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6'>
        Mi Trabajo
      </h2>
      <div ref={lineRef} className='line-separator w-24 mb-12' />

      {/* Controls - liquid glass inputs */}
      <div className='flex flex-col sm:flex-row gap-5 mb-12'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20' />
          <input
            type='text'
            placeholder='Buscar proyectos...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            className='w-full pl-14 pr-6 py-4 text-base liquid-glass-input rounded-xl text-white placeholder-white/20 outline-none'
          />
        </div>
        <select
          value={langFilter}
          onChange={e => setLangFilter(e.target.value)}
          className='px-6 py-4 text-base liquid-glass-input rounded-xl text-white/50 outline-none appearance-none cursor-pointer'
        >
          {languages.map(l => (
            <option key={l} value={l} className='bg-zinc-900'>{l === 'all' ? 'Todos los lenguajes' : l}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className='px-6 py-4 text-base liquid-glass-input rounded-xl text-white/50 outline-none appearance-none cursor-pointer'
        >
          <option value='updated' className='bg-zinc-900'>Más recientes</option>
          <option value='stars' className='bg-zinc-900'>Más stars</option>
          <option value='name' className='bg-zinc-900'>Alfabético</option>
        </select>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='liquid-glass rounded-2xl p-8 animate-pulse'>
              <div className='h-6 bg-white/[0.03] rounded w-3/4 mb-5 relative z-10' />
              <div className='h-5 bg-white/[0.02] rounded w-full mb-3 relative z-10' />
              <div className='h-5 bg-white/[0.02] rounded w-2/3 relative z-10' />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className='liquid-glass-text rounded-2xl py-24 text-center'>
          <p className='text-white/25'>No se encontraron proyectos.</p>
        </div>
      ) : (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {filtered.map(repo => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({ repo }: { repo: EnrichedRepo }) {
  const langColors: Record<string, string> = {
    TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
    HTML: '#e34c26', CSS: '#563d7c', PHP: '#4F5D95',
    Shell: '#89e051', Ruby: '#701516', Go: '#00ADD8',
    Java: '#b07219', 'C++': '#f34b7d', Rust: '#dea584',
    Lua: '#000080', Swift: '#F05138', Kotlin: '#A97BFF',
  };

  const color = langColors[repo.primaryLanguage] || '#7a8599';
  const langBytes = Object.values(repo.languages);
  const totalBytes = langBytes.reduce((a, b) => a + b, 0);

  const timeAgo = useCallback(() => {
    const diff = Date.now() - new Date(repo.updated_at).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Hoy';
    if (days < 30) return `Hace ${days}d`;
    if (days < 365) return `Hace ${Math.floor(days / 30)}m`;
    return `Hace ${Math.floor(days / 365)}a`;
  }, [repo.updated_at]);

  return (
    <div
      className='liquid-glass rounded-2xl p-8 group liquid-glass-lift'
      data-cursor-hover
    >
      {/* Header */}
      <div className='flex items-start justify-between mb-5 relative z-10'>
        <h3 className='text-base font-semibold text-white/90 group-hover:text-white transition-colors truncate flex-1'>
          {repo.name}
        </h3>
        <div className='flex items-center gap-3 ml-2 flex-shrink-0'>
          {repo.hasDemo && (
            <a
              href={repo.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-white/20 hover:text-[#1e90ff] transition-colors'
              data-cursor-hover
            >
              <ExternalLink className='w-5 h-5' />
            </a>
          )}
          <a
            href={repo.html_url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-white/20 hover:text-white transition-colors'
            data-cursor-hover
          >
            <Github className='w-5 h-5' />
          </a>
        </div>
      </div>

      {/* Description */}
      <p className='text-sm text-white/30 leading-relaxed mb-6 line-clamp-2 min-h-[4rem] relative z-10'>
        {repo.description || 'Sin descripción.'}
      </p>

      {/* Language bar */}
      {totalBytes > 0 && (
        <div className='flex gap-1 mb-6 h-1.5 rounded-full overflow-hidden relative z-10'>
          {Object.entries(repo.languages).slice(0, 5).map(([lang, bytes]) => (
            <div
              key={lang}
              className='rounded-full'
              style={{
                width: `${(bytes / totalBytes) * 100}%`,
                backgroundColor: langColors[lang] || '#7a8599',
              }}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className='flex items-center justify-between text-xs text-white/20 relative z-10'>
        <div className='flex items-center gap-5'>
          {repo.primaryLanguage && (
            <span className='flex items-center gap-1.5'>
              <span className='w-3 h-3 rounded-full' style={{ backgroundColor: color }} />
              {repo.primaryLanguage}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span>★ {repo.stargazers_count}</span>
          )}
        </div>
        <span>{timeAgo()}</span>
      </div>

      {/* Ver en vivo button */}
      <a
        href={repo.hasDemo ? repo.demoUrl : repo.pagesUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='mt-5 flex items-center justify-center gap-2 w-full liquid-glass-btn py-2.5 rounded-xl text-sm text-white/50 hover:text-[#1e90ff] transition-colors relative z-10'
        data-cursor-hover
      >
        <Eye className='w-4 h-4' />
        Ver en vivo
      </a>
    </div>
  );
}
