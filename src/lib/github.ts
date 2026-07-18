import type { GithubProfileData, GithubRepo } from '@/types';

const GITHUB_API = 'https://api.github.com';

export class GithubApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'GithubApiError';
  }
}

async function githubFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Optional: set GITHUB_TOKEN in .env.local to raise the rate limit
  // from 60/hr (unauthenticated) to 5000/hr.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(`${GITHUB_API}${path}`, { headers, cache: 'no-store' });

  if (res.status === 404) {
    throw new GithubApiError('GitHub user not found', 404);
  }

  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    if (remaining === '0') {
      throw new GithubApiError(
        'GitHub API rate limit exceeded. Add a GITHUB_TOKEN to .env.local to raise the limit.',
        403
      );
    }
    throw new GithubApiError('GitHub API request forbidden', 403);
  }

  if (!res.ok) {
    throw new GithubApiError(`GitHub API error: ${res.statusText}`, res.status);
  }

  return res;
}

export async function fetchGithubProfile(username: string): Promise<GithubProfileData> {
  const res = await githubFetch(`/users/${encodeURIComponent(username)}`);
  const data = await res.json();

  return {
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    bio: data.bio,
    company: data.company,
    location: data.location,
    blog: data.blog,
    twitter_username: data.twitter_username,
    followers: data.followers,
    following: data.following,
    public_repos: data.public_repos,
    html_url: data.html_url,
    hireable: data.hireable,
    created_at: data.created_at,
  };
}

export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  const res = await githubFetch(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`
  );
  const data = await res.json();

  return (data as any[])
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      topics: repo.topics ?? [],
      updated_at: repo.updated_at,
      selected: false,
    }))
    .sort((a, b) => b.stargazers_count - a.stargazers_count);
}
