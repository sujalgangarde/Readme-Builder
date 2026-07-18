'use client';

import { useBuilderStore } from '@/store/builder-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TemplateId } from '@/types';

const TEMPLATES: { id: TemplateId; label: string; description: string; accent: string }[] = [
  { id: 'minimal', label: 'Minimal', description: 'Clean, quiet, no animation or banners.', accent: 'bg-slate-500' },
  { id: 'modern', label: 'Modern', description: 'Waving gradient banner, typing intro, snake graph.', accent: 'bg-gradient-to-r from-purple-500 to-blue-500' },
  { id: 'professional', label: 'Professional', description: 'Recruiter-friendly, structured, subtle color.', accent: 'bg-blue-700' },
  { id: 'developer', label: 'Developer', description: 'Dark radical theme, heavy stats, animated snake.', accent: 'bg-gradient-to-r from-slate-900 to-blue-600' },
  { id: 'terminal', label: 'Terminal', description: 'Retro CLI look with monospace code blocks.', accent: 'bg-green-500' },
  { id: 'cyberpunk', label: 'Cyberpunk', description: 'Neon pink/cyan venom banner, radical theme.', accent: 'bg-gradient-to-r from-pink-500 to-cyan-400' },
  { id: 'nature', label: 'Nature', description: 'Calm green gradient, gruvbox-themed stats.', accent: 'bg-gradient-to-r from-teal-700 to-green-500' },
];

export function TemplatePicker() {
  const template = useBuilderStore((s) => s.template);
  const setTemplate = useBuilderStore((s) => s.setTemplate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template</CardTitle>
        <CardDescription>Changes header style and overall tone of the generated README.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={cn(
              'flex flex-col items-start gap-2 rounded-md border p-3 text-left transition-colors',
              template === t.id ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:bg-muted'
            )}
          >
            <span className={cn('h-2 w-8 rounded-full', t.accent)} />
            <span className="text-sm font-medium">{t.label}</span>
            <span className="text-xs text-muted-foreground">{t.description}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
