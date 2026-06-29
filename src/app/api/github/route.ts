import { NextResponse } from "next/server";

const GITHUB_USERNAME = "caos1codex-hash";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  fork: boolean;
  archived: boolean;
  default_branch: string;
  open_issues_count: number;
  license: { spdx_id: string; name: string } | null;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

// Language color mapping
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
  Lua: "#000080",
  R: "#198CE7",
  Scala: "#c22d40",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  Clojure: "#db5855",
  Perl: "#0298c3",
};

export async function GET() {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };

    // Add auth token if available (for higher rate limits)
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch repos and user data in parallel
    const [reposRes, userRes] = await Promise.all([
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=owner`,
        { headers, next: { revalidate: 300 } }
      ),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers,
        next: { revalidate: 300 },
      }),
    ]);

    if (!reposRes.ok) {
      const errorText = await reposRes.text();
      console.error(`Repos API error (${reposRes.status}):`, errorText);
      throw new Error(`GitHub Repos API error: ${reposRes.status}`);
    }
    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error(`User API error (${userRes.status}):`, errorText);
      throw new Error(`GitHub User API error: ${userRes.status}`);
    }

    const repos: GitHubRepo[] = await reposRes.json();
    const user: GitHubUser = await userRes.json();

    // Filter out forks and archived repos, then transform
    const filteredRepos = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "Sin descripción",
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        languageColor: repo.language
          ? LANGUAGE_COLORS[repo.language] || "#8b8b8b"
          : null,
        forks: repo.forks_count,
        stars: repo.stargazers_count,
        topics: repo.topics || [],
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        size: repo.size,
        hasDemo: !!(repo.homepage && repo.homepage.trim() !== ""),
        license: repo.license?.spdx_id || null,
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

    return NextResponse.json({
      user: userData,
      repos: filteredRepos,
      total: filteredRepos.length,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub data", repos: [], user: null, total: 0 },
      { status: 500 }
    );
  }
}
