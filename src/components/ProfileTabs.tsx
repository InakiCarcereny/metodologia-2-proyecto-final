'use client';

import type { JSX, ReactNode } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ProfileTab = 'posts' | 'reposts';

interface ProfileTabsProps {
  postsSlot: ReactNode;
  repostsSlot: ReactNode;
}

interface ProfileTabConfig {
  label: string;
  value: ProfileTab;
}

const TABS: ProfileTabConfig[] = [
  {
    label: 'posts',
    value: 'posts',
  },
  {
    label: 'reposts',
    value: 'reposts',
  },
];

export function ProfileTabs({
  postsSlot,
  repostsSlot,
}: ProfileTabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-8 border-[#dfe1e5] border-b">
        {TABS.map(({ label, value }) => (
          <button
            className={cn(
              'cursor-pointer border-transparent border-b-2 px-1 pb-2 font-bold text-[#7e8288] text-[13px]',
              activeTab === value && 'border-black text-black',
            )}
            key={value}
            onClick={() => setActiveTab(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'posts' ? postsSlot : repostsSlot}
    </div>
  );
}
