// Client-side GitHub data loading.
// In production (GitHub Pages): loads from pre-built static JSON (no rate limits).
// In dev: falls back to live GitHub API.

const GITHUB_USERNAME = 'caos1codex-hash';

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
  has_pages: boolean;
}

interface GitHubLanguageMap { [key: string]: number }

export interface EnrichedRepo extends GitHubRepo {
  languages: GitHubLanguageMap;
  primaryLanguage: string;
  hasDemo: boolean;
  demoUrl: string;
  hasPages: boolean;
  pagesUrl: string;
  isArchived: boolean;
}

export interface UserStats {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
  bio: string | null;
  login: string;
  totalCommits: number;
  yearsCoding: number;
}

interface PrebuiltData extends UserStats {
  repos: EnrichedRepo[];
}

let prebuiltCache: PrebuiltData | null | undefined = undefined;

async function getPrebuiltData(): Promise<PrebuiltData | null> {
  if (prebuiltCache !== undefined) return prebuiltCache;
  prebuiltCache = null;
  try {
    const res = await fetch('./github-data.json');
    if (res.ok) {
      prebuiltCache = await res.json();
    }
  } catch { /* not available */ }
  return prebuiltCache;
}

// --- Live API fallback ---

async function fetchPublic<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function fetchUserStats(): Promise<UserStats> {
  const prebuilt = await getPrebuiltData();
  if (prebuilt) {
    const { repos, ...userStats } = prebuilt;
    return userStats;
  }

  // Fallback: live API
  const [user, events] = await Promise.all([
    fetchPublic<{
      public_repos: number; followers: number; following: number;
      created_at: string; avatar_url: string; bio: string | null; login: string;
    }>(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetchPublic<Array<{ type: string; created_at: string }>>(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
    ),
  ]);

  return {
    ...user,
    totalCommits: events.filter((e) => e.type === 'PushEvent').length,
    yearsCoding: Math.max(1, new Date().getFullYear() - 2022),
  };
}

export async function fetchRepos(): Promise<EnrichedRepo[]> {
  const prebuilt = await getPrebuiltData();
  if (prebuilt) return prebuilt.repos;

  // Fallback: live API
  const repos = await fetchPublic<GitHubRepo[]>(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
  );

  const batchSize = 5;
  const enriched: EnrichedRepo[] = [];

  for (let i = 0; i < repos.length; i += batchSize) {
    const batch = repos.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (repo) => {
        let languages: GitHubLanguageMap = {};
        try {
          languages = await fetchPublic<GitHubLanguageMap>(repo.languages_url);
        } catch { /* skip */ }

        const sortedLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]);
        const pagesUrl = `https://${GITHUB_USERNAME}.github.io/${repo.name.toLowerCase()}`;
        const hasPages = repo.has_pages || !!repo.homepage;

        return {
          ...repo,
          languages,
          primaryLanguage: sortedLangs[0]?.[0] || 'Unknown',
          hasDemo: hasPages,
          demoUrl: repo.homepage || pagesUrl,
          hasPages,
          pagesUrl,
          isArchived: repo.archived,
        };
      })
    );
    enriched.push(...results);
  }

  return enriched.filter((r) => !r.fork && r.name !== 'caos-portfolio');
}