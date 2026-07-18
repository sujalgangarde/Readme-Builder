'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Github, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { GithubProfileData, GithubRepo } from '@/types';

export function GithubImport() {
  const githubUsername = useBuilderStore((s) => s.githubUsername);
  const setGithubUsername = useBuilderStore((s) => s.setGithubUsername);
  const githubData = useBuilderStore((s) => s.githubData);
  const applyGithubImport = useBuilderStore((s) => s.applyGithubImport);
  const repos = useBuilderStore((s) => s.repos);
  const toggleRepoSelection = useBuilderStore((s) => s.toggleRepoSelection);

  const [input, setInput] = useState(githubUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    const username = input.trim();
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github/${encodeURIComponent(username)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to import GitHub profile.');
        return;
      }

      setGithubUsername(username);
      applyGithubImport(data.profile as GithubProfileData, data.repos as GithubRepo[]);
    } catch (err) {
      setError('Network error while contacting GitHub.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-4 w-4" /> Import from GitHub
        </CardTitle>
        <CardDescription>
          Pull your public profile info and repositories automatically.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={input}
            placeholder="your-github-username"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImport()}
          />
          <Button onClick={handleImport} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Import'}
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {githubData && (
          <div className="flex items-center gap-3 rounded-md border border-border p-3">
            <Image
              src={githubData.avatar_url}
              alt={githubData.login}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 font-medium">
                {githubData.name ?? githubData.login}
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm text-muted-foreground">
                @{githubData.login} · {githubData.followers} followers · {githubData.public_repos} repos
              </div>
            </div>
          </div>
        )}

        {repos.length > 0 && (
          <div>
            <div className="mb-2 text-sm font-medium">
              Select repositories to feature ({repos.filter((r) => r.selected).length} selected)
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {repos.map((repo) => (
                <label
                  key={repo.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted"
                >
                  <input
                    type="checkbox"
                    checked={repo.selected}
                    onChange={() => toggleRepoSelection(repo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{repo.name}</div>
                    {repo.description && (
                      <div className="text-xs text-muted-foreground">{repo.description}</div>
                    )}
                    <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                      {repo.language && <span>{repo.language}</span>}
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🍴 {repo.forks_count}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
