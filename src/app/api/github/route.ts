import { NextResponse } from 'next/server';

// Static export compatibility
export const dynamic = 'force-static';
export const fetchCache = 'force-no-store';

const GITHUB_USERNAME = 'caos1codex-hash';

const headers: HeadersInit = {
  Accept: 'application/vnd.github.v3+json',
};

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  size: number;
  default_branch: string;
}

interface GitHubLanguageMap {
  [key: string]: number;
}

export interface EnrichedRepo extends GitHubRepo {
  languages: GitHubLanguageMap;
  primaryLanguage: string;
  hasDemo: boolean;
  demoUrl: string;
  isArchived: boolean;
}

// GET /api/github?type=repos|user|languages
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'repos';

  try {
    if (type === 'user') {
      const user = await fetchGitHub<{
        public_repos: number;
        followers: number;
        following: number;
        created_at: string;
        avatar_url: string;
        bio: string | null;
        login: string;
      }>(`/users/${GITHUB_USERNAME}`);

      const events = await fetchGitHub<Array<{ type: string; created_at: string }>>(
        `/users/${GITHUB_USERNAME}/events/public?per_page=100`
      );
      const commitCount = events.filter((e) => e.type === 'PushEvent').length;

      const allRepos = await fetchGitHub<GitHubRepo[]>(
        `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
      );
      const totalStars = allRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
      const totalForks = allRepos.reduce((sum, r) => sum + r.forks_count, 0);

      return NextResponse.json({
        ...user,
        totalCommits: commitCount,
        totalStars,
        totalForks,
        yearsCoding: Math.max(1, new Date().getFullYear() - 2022),
      });
    }

    if (type === 'languages') {
      const repos = await fetchGitHub<GitHubRepo[]>(
        `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
      );
      const langMap: Record<string, number> = {};
      for (const repo of repos) {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        }
      }
      return NextResponse.json(langMap);
    }

    // Default: repos
    const repos = await fetchGitHub<GitHubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    );

    const enriched: EnrichedRepo[] = await Promise.all(
      repos
        .filter((r) => !r.fork)
        .map(async (repo) => {
          let languages: GitHubLanguageMap = {};
          try {
            languages = await fetchGitHub<GitHubLanguageMap>(repo.languages_url);
          } catch { /* skip */ }

          const sortedLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]);
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

    return NextResponse.json(enriched);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
