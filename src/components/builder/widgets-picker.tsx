'use client';

import { useBuilderStore } from '@/store/builder-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { WidgetType } from '@/types';

const WIDGET_LABELS: Record<WidgetType, string> = {
  stats: 'GitHub Stats Card',
  streak: 'GitHub Streak',
  'top-languages': 'Top Languages',
  trophy: 'GitHub Trophy',
  'profile-views': 'Profile Views Counter',
  'activity-graph': 'Activity Graph',
};

export function WidgetsPicker() {
  const widgets = useBuilderStore((s) => s.widgets);
  const toggleWidget = useBuilderStore((s) => s.toggleWidget);
  const githubUsername = useBuilderStore((s) => s.githubUsername);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Widgets</CardTitle>
        <CardDescription>
          {githubUsername
            ? `Rendered live via github-readme-stats using @${githubUsername}.`
            : 'Import your GitHub profile above to render these with your real stats.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {widgets.map((widget) => (
          <label
            key={widget.id}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 text-sm hover:bg-muted"
          >
            <input
              type="checkbox"
              checked={widget.enabled}
              onChange={() => toggleWidget(widget.id)}
            />
            {WIDGET_LABELS[widget.type]}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
