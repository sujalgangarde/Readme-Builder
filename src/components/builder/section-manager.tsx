'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useBuilderStore } from '@/store/builder-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Section, SectionType } from '@/types';

const SECTION_LABELS: Record<SectionType, string> = {
  header: 'Header / Intro',
  about: 'About Me',
  currentFocus: 'Current Focus',
  skills: 'Tech Stack',
  stats: 'GitHub Stats',
  projects: 'Featured Projects',
  socials: 'Social Links',
  funFact: 'Fun Fact',
};

function SortableRow({ section }: { section: Section }) {
  const toggleSection = useBuilderStore((s) => s.toggleSection);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
    >
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground">
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="flex-1 text-sm">{SECTION_LABELS[section.type]}</span>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={section.enabled}
          onChange={() => toggleSection(section.id)}
        />
        Visible
      </label>
    </div>
  );
}

export function SectionManager() {
  const sections = useBuilderStore((s) => s.sections);
  const reorderSections = useBuilderStore((s) => s.reorderSections);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    reorderSections(arrayMove(sections, oldIndex, newIndex));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Order</CardTitle>
        <CardDescription>Drag to reorder. Toggle visibility per section.</CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {sections.map((section) => (
                <SortableRow key={section.id} section={section} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
