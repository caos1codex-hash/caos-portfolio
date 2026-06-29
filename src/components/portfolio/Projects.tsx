'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, ExternalLink, Globe, Calendar, RefreshCw, FolderGit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import SectionReveal from '@/components/effects/SectionReveal';

// Language color mapping
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Lua: '#000080',
  R: '#198CE7',
};

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  languageColor: string | null;
  forks: number;
  stars: number;
  topics: string[];
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  size: number;
  hasDemo: boolean;
  license: string | null;
}

function ProjectSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-3/4 rounded-lg bg-white/5" />
        <div className="h-3 w-3 rounded-full bg-white/5" />
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full rounded bg-white/5" />
        <div className="h-4 w-2/3 rounded bg-white/5" />
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-4 w-20 rounded bg-white/5" />
        <div className="h-4 w-16 rounded bg-white/5" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-9 w-28 rounded-lg bg-white/5" />
        <div className="h-9 w-20 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

function ProjectCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const relativeDate = formatDistanceToNow(new Date(repo.pushedAt || repo.updatedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovering ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative glass rounded-2xl p-6 h-full flex flex-col group cursor-default overflow-hidden"
      >
        {/* Border glow on hover */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(0,102,255,0.15), rgba(139,92,246,0.1), rgba(0,255,255,0.08))',
            border: '1px solid rgba(0,102,255,0.2)',
          }}
        />

        {/* Top-right language color glow */}
        {repo.languageColor && (
          <div
            className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-700 pointer-events-none"
            style={{ backgroundColor: repo.languageColor }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-bold text-white leading-tight break-words pr-4">
              {repo.name}
            </h3>
            {repo.languageColor && (
              <div
                className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ring-2 ring-offset-1 ring-offset-transparent"
                style={{
                  backgroundColor: repo.languageColor,
                  boxShadow: `0 0 8px ${repo.languageColor}80`,
                }}
              />
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2 flex-grow-0">
            {repo.description || 'Sin descripción'}
          </p>

          {/* Language + Stats */}
          <div className="flex items-center gap-4 mb-4 flex-wrap text-xs text-gray-500">
            {repo.language && (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: repo.languageColor || '#8b8b8b' }}
                />
                {repo.language}
              </span>
            )}
            {repo.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {repo.stars}
              </span>
            )}
            {repo.forks > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {repo.forks}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {relativeDate}
            </span>
          </div>

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {repo.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-400 border border-white/5"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 text-gray-500">
                  +{repo.topics.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-auto pt-2">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300"
            >
              <ExternalLink className="w-3 h-3" />
              Ver en GitHub
            </a>
            {repo.hasDemo && repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-[#0066ff] text-white hover:bg-[#0055dd] transition-all duration-300"
                style={{
                  boxShadow: '0 0 15px rgba(0,102,255,0.3)',
                }}
              >
                <Globe className="w-3 h-3" />
                Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch directly from GitHub API (works in both dev and static export)
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };

      const res = await fetch(
        'https://api.github.com/users/caos1codex-hash/repos?sort=updated&per_page=100&type=owner',
        { headers }
      );

      if (!res.ok) throw new Error('Error al cargar los proyectos');

      const reposData = await res.json();

      // Filter and transform
      const filtered = reposData
        .filter((repo: Record<string, unknown>) => !repo.fork && !repo.archived)
        .map((repo: Record<string, unknown>) => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || 'Sin descripción',
          url: repo.html_url,
          homepage: repo.homepage,
          language: repo.language,
          languageColor: LANGUAGE_COLORS[(repo.language as string)] || '#8b8b8b',
          forks: repo.forks_count,
          stars: repo.stargazers_count,
          topics: repo.topics || [],
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
          size: repo.size,
          hasDemo: !!(repo.homepage && String(repo.homepage).trim() !== ''),
          license: (repo.license as Record<string, string>)?.spdx_id || null,
        }));

      setRepos(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <section id="projects" className="py-24 md:py-32 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <SectionReveal>
          <div className="mb-16 text-center">
            <motion.span
              className="inline-block text-xs font-mono tracking-[0.3em] uppercase text-[#0066ff] mb-4 text-glow-blue"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Desde GitHub
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Proyectos
            </h2>
            <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-[#0066ff] to-[#8b5cf6]" />
          </div>
        </SectionReveal>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <SectionReveal>
            <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <FolderGit2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Error al cargar proyectos
              </h3>
              <p className="text-sm text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchProjects}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg bg-[#0066ff] text-white hover:bg-[#0055dd] transition-all duration-300"
                style={{ boxShadow: '0 0 15px rgba(0,102,255,0.3)' }}
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </button>
            </div>
          </SectionReveal>
        )}

        {/* Empty State */}
        {!loading && !error && repos.length === 0 && (
          <SectionReveal>
            <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FolderGit2 className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sin proyectos aún
              </h3>
              <p className="text-sm text-gray-400">
                Los repositorios de GitHub aparecerán aquí.
              </p>
            </div>
          </SectionReveal>
        )}

        {/* Projects Grid */}
        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <ProjectCard key={repo.id} repo={repo} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
