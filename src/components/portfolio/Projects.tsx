'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { ExternalLink, Github, Search, Star, GitFork } from 'lucide-react';
import { useGsapFadeIn, useGsapLineReveal } from '@/hooks/useGsap';

type SortKey = 'updated' | 'stars' | 'name';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  languages_url: string;
  languages: Record<string, number>;
  primaryLanguage: string;
  hasDemo: boolean;
  demoUrl: string;
  isArchived: boolean;
}

const GITHUB_USERNAME = 'caos1codex-hash';

export default function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('updated');
  const [langFilter, setLangFilter] = useState<string>('all');

  const labelRef = useGsapFadeIn({ y: 20, blur: 4 });
  const headingRef = useGsapFadeIn({ y: 20, delay: 0.1 });
  const lineRef = useGsapLineReveal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/github?type=repos');
        if (res.ok) {
          const data = await res.json();
          setRepos(Array.isArray(data) ? data : []);
          setLoading(false);
          return;
        }
      } catch { /* fallback */ }

      try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
        const data = await res.json();
        const enriched: Repo[] = await Promise.all(
          data
            .filter((r: any) => !r.fork)
            .map(async (repo: any) => {
              let languages: Record<string, number> = {};
              try {
                const langRes = await fetch(repo.languages_url);
                languages = await langRes.json();
              } catch { /* skip */ }
              const sortedLangs = Object.entries(languages).sort((a: any, b: any) => b[1] - a[1]);
              return {
                ...repo,
                languages,
                primaryLanguage: sortedLangs[0]?.[0] || 'Unknown',
                hasDemo: !!repo.homepage && repo.homepage !== '',
                demoUrl: repo.homepage || '',
                isArchived: repo.archived,
              };
            })
        );
        setRepos(enriched);
      } catch {
        setRepos([]);
      }
      setLoading(false);
    };
    fetchData();
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
    <section id="projects" className="py-24 md:py-32 section-padding">
      <p ref={labelRef} className="text-xs tracking-[0.4em] uppercase text-white/25 mb-4">
        Proyectos
      </p>
      <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
        Mi Trabajo
      </h2>
      <div ref={lineRef} className="line-separator w-16 mb-8" />

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.03] border border-white/[0.06] rounded-lg text-white placeholder-white/20 outline-none focus:border-[#0a84ff]/30 transition-colors"
          />
        </div>
        <select
          value={langFilter}
          onChange={e => setLangFilter(e.target.value)}
          className="px-4 py-2.5 text-sm bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/60 outline-none focus:border-[#0a84ff]/30 transition-colors appearance-none cursor-pointer"
        >
          {languages.map(l => (
            <option key={l} value={l} className="bg-zinc-900">{l === 'all' ? 'Todos los lenguajes' : l}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="px-4 py-2.5 text-sm bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/60 outline-none focus:border-[#0a84ff]/30 transition-colors appearance-none cursor-pointer"
        >
          <option value="updated" className="bg-zinc-900">Mas recientes</option>
          <option value="stars" className="bg-zinc-900">Mas stars</option>
          <option value="name" className="bg-zinc-900">Alfabetico</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-white/[0.04] rounded w-3/4 mb-3" />
              <div className="h-3 bg-white/[0.03] rounded w-full mb-2" />
              <div className="h-3 bg-white/[0.03] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-white/25 py-16">No se encontraron proyectos.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(repo => (
            <ProjectCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Go: '#00ADD8',
  Java: '#b07219',
};

function ProjectCard({ repo }: { repo: Repo }) {
  const langColor = LANG_COLORS[repo.primaryLanguage] || '#86868b';
  const langBytes = Object.values(repo.languages);
  const totalBytes = langBytes.reduce((a: number, b: number) => a + b, 0);

  const timeAgo = useCallback(() => {
    const diff = Date.now() - new Date(repo.updated_at).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return 'Hoy';
    if (days < 30) return `Hace ${days}d`;
    if (days < 365) return `Hace ${Math.floor(days / 30)}m`;
    return `Hace ${Math.floor(days / 365)}a`;
  }, [repo.updated_at]);

  const langBarStyle = useMemo(() => {
    const entries = Object.entries(repo.languages).slice(0, 5);
    return entries.map(([lang, bytes]) => ({
      width: `${(bytes / totalBytes) * 100}%`,
      backgroundColor: LANG_COLORS[lang] || '#86868b',
    }));
  }, [repo.languages, totalBytes]);

  const dotStyle = useMemo(() => ({ backgroundColor: langColor }), [langColor]);

  return (
    <div
      className="glass rounded-xl p-5 group hover:border-[#0a84ff]/15 transition-all duration-500 card-lift"
      data-cursor-hover
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors truncate flex-1">
          {repo.name}
        </h3>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {repo.hasDemo && (
            <a href={repo.demoUrl} target="_blank" rel="noopener noreferrer"
              className="text-white/25 hover:text-[#0a84ff] transition-colors" data-cursor-hover aria-label="Ver demo">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
            className="text-white/25 hover:text-white transition-colors" data-cursor-hover aria-label="Ver en GitHub">
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <p className="text-xs text-white/30 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
        {repo.description || 'Sin descripcion.'}
      </p>

      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {repo.topics.slice(0, 3).map(topic => (
            <span key={topic} className="px-2 py-0.5 text-[9px] rounded-full bg-[#0a84ff]/8 text-[#0a84ff]/70">
              {topic}
            </span>
          ))}
        </div>
      )}

      {totalBytes > 0 && (
        <div className="flex gap-0.5 mb-4 h-1 rounded-full overflow-hidden">
          {langBarStyle.map((s, i) => (
            <div key={i} className="rounded-full" style={s} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-white/20">
        <div className="flex items-center gap-3">
          {repo.primaryLanguage && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={dotStyle} />
              {repo.primaryLanguage}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="flex items-center gap-0.5"><Star className="w-3 h-3" /> {repo.stargazers_count}</span>
          )}
          {repo.forks_count > 0 && (
            <span className="flex items-center gap-0.5"><GitFork className="w-3 h-3" /> {repo.forks_count}</span>
          )}
        </div>
        <span>{timeAgo()}</span>
      </div>
    </div>
  );
}
