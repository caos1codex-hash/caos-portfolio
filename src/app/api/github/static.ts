// This file provides GitHub data for static export builds
// When building for GitHub Pages, we pre-fetch data at build time

const GITHUB_USERNAME = "caos1codex-hash";

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

export async function fetchGitHubData() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    const [reposRes, userRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`,
        { headers }
      ),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers }),
    ]);

    if (!reposRes.ok || !userRes.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await reposRes.json();
    const user = await userRes.json();

    const filteredRepos = repos
      .filter((repo: Record<string, unknown>) => !repo.fork && !repo.archived)
      .map((repo: Record<string, unknown>) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "Sin descripción",
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        languageColor: repo.language
          ? LANGUAGE_COLORS[repo.language as string] || "#8b8b8b"
          : null,
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        size: repo.size,
        hasDemo: !!(repo.homepage && String(repo.homepage).trim() !== ""),
        license: (repo.license as Record<string, string>)?.spdx_id || null,
      }));

    const userData = {
      login: user.login,
      avatarUrl: user.avatar_url,
      url: user.html_url,
      name: user.name,
      bio: user.bio,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      since: user.created_at,
    };

    return { user: userData, repos: filteredRepos, total: filteredRepos.length };
  } catch {
    return { user: null, repos: [], total: 0 };
  }
}
