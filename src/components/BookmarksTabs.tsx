'use client';

import type { JSX, ReactNode } from 'react';
import { useState } from 'react';
import type { BookmarkFilter } from '@/data/post';
import { cn } from '@/lib/utils';

interface BookmarksTabsProps {
  allSlot: ReactNode;
  articleSlot: ReactNode;
  counts: Record<BookmarkFilter, number>;
  questionSlot: ReactNode;
  snippetSlot: ReactNode;
}

interface BookmarksTabConfig {
  label: string;
  value: BookmarkFilter;
}

const TABS: BookmarksTabConfig[] = [
  { label: 'todos', value: 'all' },
  { label: 'snippets', value: 'snippet' },
  { label: 'artículos', value: 'article' },
  { label: 'preguntas', value: 'question' },
];

export function BookmarksTabs({
  allSlot,
  articleSlot,
  counts,
  questionSlot,
  snippetSlot,
}: BookmarksTabsProps): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<BookmarkFilter>('all');

  const slots: Record<BookmarkFilter, ReactNode> = {
    all: allSlot,
    article: articleSlot,
    question: questionSlot,
    snippet: snippetSlot,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ label, value }) => (
          <button
            className={cn(
              'cursor-pointer rounded-lg border px-3 py-1.5 font-medium text-[13px]',
              activeFilter === value
                ? 'border-[#171b22] bg-[#171b22] text-white'
                : 'border-[#dfe1e5] text-[#676b72] hover:border-[#9b9ea5]',
            )}
            key={value}
            onClick={() => setActiveFilter(value)}
            type="button"
          >
            {label} {counts[value]}
          </button>
        ))}
      </div>

      {slots[activeFilter]}
    </div>
  );
}
