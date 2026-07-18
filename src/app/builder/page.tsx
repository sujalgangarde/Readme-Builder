'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GithubImport } from '@/components/builder/github-import';
import { ProfileForm } from '@/components/builder/profile-form';
import { SkillsManager } from '@/components/builder/skills-manager';
import { SocialsManager } from '@/components/builder/socials-manager';
import { WidgetsPicker } from '@/components/builder/widgets-picker';
import { SectionManager } from '@/components/builder/section-manager';
import { TemplatePicker } from '@/components/builder/template-picker';
import { LivePreview } from '@/components/builder/live-preview';
import { ExportPanel } from '@/components/builder/export-panel';

export default function BuilderPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">README Builder</h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-2">
        <div className="space-y-6">
          <TemplatePicker />
          <GithubImport />
          <ProfileForm />
          <SkillsManager />
          <SocialsManager />
          <WidgetsPicker />
          <SectionManager />
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <LivePreview />
          <ExportPanel />
        </div>
      </div>
    </main>
  );
}
