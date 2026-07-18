'use client';

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { generateReadme } from '@/lib/markdown-generator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Viewport = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_WIDTH: Record<Viewport, string> = {
  desktop: 'w-full',
  tablet: 'max-w-2xl mx-auto',
  mobile: 'max-w-sm mx-auto',
};

export function LivePreview() {
  const state = useBuilderStore((s) => s);
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const markdown = useMemo(() => generateReadme(state), [state]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>Rendered exactly as GitHub would display it.</CardDescription>
        </div>
        <div className="flex gap-1 rounded-md border border-border p-1">
          {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((vp) => {
            const Icon = vp === 'desktop' ? Monitor : vp === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                className={cn(
                  'rounded p-1.5',
                  viewport === vp ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className={VIEWPORT_WIDTH[viewport]}>
          <div className="prose prose-sm max-w-none rounded-md border border-border bg-white p-6 dark:prose-invert">
            {markdown.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">
                Fill in your profile details to see the preview here.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
