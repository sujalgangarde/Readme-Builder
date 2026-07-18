'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SkillCategory } from '@/types';

// A curated set of common skills mapped to simple-icons slugs used by shields.io badges.
const SKILL_SUGGESTIONS: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'openjdk',
  react: 'react',
  nextdotjs: 'nextdotjs',
  nodejs: 'nodedotjs',
  express: 'express',
  postgresql: 'postgresql',
  mongodb: 'mongodb',
  mysql: 'mysql',
  redis: 'redis',
  docker: 'docker',
  kubernetes: 'kubernetes',
  aws: 'amazonaws',
  gcp: 'googlecloud',
  azure: 'microsoftazure',
  git: 'git',
  linux: 'linux',
  tailwindcss: 'tailwindcss',
  graphql: 'graphql',
};

export function SkillsManager() {
  const skills = useBuilderStore((s) => s.skills);
  const addSkill = useBuilderStore((s) => s.addSkill);
  const removeSkill = useBuilderStore((s) => s.removeSkill);
  const [inputs, setInputs] = useState<Record<string, string>>({});

  function handleAdd(category: SkillCategory) {
    const raw = (inputs[category] ?? '').trim();
    if (!raw) return;
    const slug = SKILL_SUGGESTIONS[raw.toLowerCase().replace(/[.\s]/g, '')] ?? raw.toLowerCase();
    addSkill(category, raw, slug);
    setInputs((prev) => ({ ...prev, [category]: '' }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Tech Stack</CardTitle>
        <CardDescription>
          Add skills per category. Common names (React, Docker, PostgreSQL...) auto-map to icons.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {skills.map((group) => (
          <div key={group.category}>
            <div className="mb-2 text-sm font-medium">{group.label}</div>
            <div className="mb-2 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.id}
                  className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs"
                >
                  {item.name}
                  <button
                    onClick={() => removeSkill(group.category, item.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={inputs[group.category] ?? ''}
                placeholder={`Add a ${group.label.toLowerCase()} skill...`}
                onChange={(e) => setInputs((prev) => ({ ...prev, [group.category]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd(group.category)}
              />
              <Button size="sm" variant="outline" onClick={() => handleAdd(group.category)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
