'use client';

import { useRouter } from 'next/navigation';
import type { JSX, KeyboardEvent } from 'react';
import type { FeedTab } from '@/db/queries/posts';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'para ti', value: 'for-you' },
  { label: 'de quien sigo', value: 'following' },
] as const;

export function FeedTabs({ activeTab }: { activeTab: FeedTab }): JSX.Element {
  const router = useRouter();

  function goToTab(tab: FeedTab) {
    router.push(`/home?tab=${tab}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const index = TABS.findIndex((tab) => tab.value === activeTab);
    const next = event.key === 'ArrowRight' ? index + 1 : index - 1;
    goToTab(TABS[(next + TABS.length) % TABS.length].value);
  }

  return (
    <div className="flex gap-6" onKeyDown={handleKeyDown} role="tablist">
      {TABS.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            aria-selected={isActive}
            className={cn(
              '-mb-px cursor-pointer border-b-2 px-1 pb-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#4265b3] focus-visible:outline-offset-2',
              isActive
                ? 'border-[#171b22] font-bold text-[#171b22]'
                : 'border-transparent font-medium text-[#676b72] hover:text-[#171b22]',
            )}
            key={tab.value}
            onClick={() => goToTab(tab.value)}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
