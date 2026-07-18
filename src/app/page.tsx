import Link from 'next/link';
import { Github, Sparkles, LayoutTemplate, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FEATURES = [
  {
    icon: Github,
    title: 'GitHub Import',
    description: 'Pull your real profile data and repositories straight from the GitHub API.',
  },
  {
    icon: LayoutTemplate,
    title: 'Templates',
    description: 'Choose from Minimal, Modern, Professional, Developer, and Terminal styles.',
  },
  {
    icon: Wand2,
    title: 'Drag & Drop',
    description: 'Reorder every section of your README exactly how you want it.',
  },
  {
    icon: Sparkles,
    title: 'Live Preview',
    description: 'See exactly how your README renders on GitHub, in real time.',
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center px-6 py-20">
      <div className="mb-4 rounded-full border border-border px-4 py-1 text-xs text-muted-foreground">
        Free & open source
      </div>
      <h1 className="max-w-2xl text-center text-4xl font-bold tracking-tight sm:text-5xl">
        Build a GitHub Profile README that actually stands out
      </h1>
      <p className="mt-4 max-w-xl text-center text-muted-foreground">
        Import your GitHub data, pick a template, customize every section, and export a
        polished README.md — all visually, with a live preview.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/builder">
          <Button size="lg">Start Building</Button>
        </Link>
        <a href="https://github.com" target="_blank" rel="noreferrer">
          <Button size="lg" variant="outline">
            <Github className="h-4 w-4" /> View on GitHub
          </Button>
        </a>
      </div>

      <div className="mt-20 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <f.icon className="h-6 w-6 text-primary" />
              <CardTitle className="mt-2">{f.title}</CardTitle>
              <CardDescription>{f.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
