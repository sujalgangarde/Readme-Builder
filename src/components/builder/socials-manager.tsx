'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SocialPlatform } from '@/types';

const PLATFORMS: { value: SocialPlatform; label: string; placeholder: string }[] = [
  { value: 'github', label: 'GitHub', placeholder: 'username' },
  { value: 'linkedin', label: 'LinkedIn', placeholder: 'username' },
  { value: 'twitter', label: 'Twitter / X', placeholder: 'username' },
  { value: 'instagram', label: 'Instagram', placeholder: 'username' },
  { value: 'discord', label: 'Discord', placeholder: 'user id' },
  { value: 'leetcode', label: 'LeetCode', placeholder: 'username' },
  { value: 'codeforces', label: 'Codeforces', placeholder: 'username' },
  { value: 'hackerrank', label: 'HackerRank', placeholder: 'username' },
  { value: 'kaggle', label: 'Kaggle', placeholder: 'username' },
  { value: 'medium', label: 'Medium', placeholder: 'username' },
  { value: 'devto', label: 'Dev.to', placeholder: 'username' },
  { value: 'stackoverflow', label: 'Stack Overflow', placeholder: 'user id' },
  { value: 'youtube', label: 'YouTube', placeholder: 'channel/c/name' },
  { value: 'portfolio', label: 'Portfolio', placeholder: 'https://...' },
  { value: 'email', label: 'Email', placeholder: 'you@example.com' },
];

export function SocialsManager() {
  const socials = useBuilderStore((s) => s.socials);
  const addSocial = useBuilderStore((s) => s.addSocial);
  const removeSocial = useBuilderStore((s) => s.removeSocial);

  const [platform, setPlatform] = useState<SocialPlatform>('github');
  const [value, setValue] = useState('');

  function handleAdd() {
    if (!value.trim()) return;
    addSocial(platform, value.trim());
    setValue('');
  }

  const activePlatform = PLATFORMS.find((p) => p.value === platform)!;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
        <CardDescription>Add badges linking to your profiles across the web.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {socials.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs"
            >
              {PLATFORMS.find((p) => p.value === s.platform)?.label}: {s.value}
              <button onClick={() => removeSocial(s.id)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
            className="h-10 rounded-md border border-border bg-background px-2 text-sm"
          >
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <Input
            value={value}
            placeholder={activePlatform.placeholder}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}
