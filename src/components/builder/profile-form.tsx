'use client';

import { useBuilderStore } from '@/store/builder-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ProfileFields } from '@/types';

const TEXT_FIELDS: { key: keyof ProfileFields; label: string; placeholder: string }[] = [
  { key: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
  { key: 'headline', label: 'Headline', placeholder: 'Full-Stack Developer | Open Source Enthusiast' },
  { key: 'pronouns', label: 'Pronouns', placeholder: 'she/her' },
  { key: 'currentWork', label: 'Currently Working On', placeholder: 'A SaaS product for developers' },
  { key: 'learning', label: 'Currently Learning', placeholder: 'Rust, distributed systems' },
  { key: 'collaboration', label: 'Looking to Collaborate On', placeholder: 'Open source dev tools' },
  { key: 'askMeAbout', label: 'Ask Me About', placeholder: 'React, TypeScript, System Design' },
  { key: 'email', label: 'Email', placeholder: 'jane@example.com' },
  { key: 'location', label: 'Location', placeholder: 'San Francisco, CA' },
  { key: 'company', label: 'Company', placeholder: '@your-company' },
  { key: 'website', label: 'Website', placeholder: 'https://janedoe.dev' },
];

export function ProfileForm() {
  const profile = useBuilderStore((s) => s.profile);
  const setField = useBuilderStore((s) => s.setField);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>These fields populate your header and about sections.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-sm font-medium">{field.label}</label>
              <Input
                value={profile[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => setField(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Bio / About</label>
          <Textarea
            value={profile.bio}
            placeholder="A short paragraph about who you are and what you do."
            rows={4}
            onChange={(e) => setField('bio', e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Fun Fact</label>
          <Input
            value={profile.funFact}
            placeholder="I can solve a Rubik's cube in under a minute."
            onChange={(e) => setField('funFact', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
