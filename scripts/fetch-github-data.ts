// scripts/fetch-github-data.ts
// Fetches GitHub data at build time and saves to public/github-data.json
// Run with: GITHUB_TOKEN=xxx bun run scripts/fetch-github-data.ts

const GITHUB_USERNAME = 'caos1codex-hash';
const TOKEN = process.env.GITHUB_TOKEN || '';

const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function fetchGH<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
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
  has_pages: boolean;
}

interface LangMap { [key: string]: number }

interface EnrichedRepo extends GitHubRepo {
  languages: LangMap;
  primaryLanguage: string;
  hasDemo: boolean;
  demoUrl: string;
  hasPages: boolean;
  pagesUrl: string;
  isArchived: boolean;
}

async function main() {
  console.log('Fetching GitHub data for', GITHUB_USERNAME, '...');

  const [user, events, repos] = await Promise.all([
    fetchGH<{
      public_repos: number; followers: number; following: number;
      created_at: string; avatar_url: string; bio: string | null; login: string;
    }>(`https://api.github.com/users/${GITHUB_USERNAME}`),
    fetchGH<Array<{ type: string; created_at: string }>>(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
    ),
    fetchGH<GitHubRepo[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    ),
  ]);

  const commitCount = events.filter((e) => e.type === 'PushEvent').length;

  // Enrich repos
  const batchSize = 5;
  const enriched: EnrichedRepo[] = [];
  const nonForkRepos = repos.filter(r => !r.fork && r.name !== 'caos-portfolio');

  for (let i = 0; i < nonForkRepos.length; i += batchSize) {
    const batch = nonForkRepos.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (repo) => {
        let languages: LangMap = {};
        try {
          languages = await fetchGH<LangMap>(repo.languages_url);
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

  const data = {
    ...user,
    totalCommits: commitCount,
    yearsCoding: Math.max(1, new Date().getFullYear() - 2022),
    repos: enriched,
  };

  const fs = await import('fs');
  const path = await import('path');
  const outPath = path.join(process.cwd(), 'public', 'github-data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
  console.log(`✓ Saved ${enriched.length} repos + user stats to ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });