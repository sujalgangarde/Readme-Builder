'use client';

import { useMemo, useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { generateReadme } from '@/lib/markdown-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ExportPanel() {
  const state = useBuilderStore((s) => s);
  const markdown = useMemo(() => generateReadme(state), [state]);
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export</CardTitle>
        <CardDescription>Download or copy your finished README.md.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4" /> Download README.md
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </Button>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">View raw markdown</summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-md border border-border bg-muted p-3 text-xs">
            {markdown || '(nothing to show yet)'}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}
