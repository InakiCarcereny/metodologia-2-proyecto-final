import type { JSX } from 'react';
import { SuggestedUsers } from '@/components/SuggestedUsers';
import { TrendingTags } from '@/components/TrendingTags';

export function ActivitySideBar(): JSX.Element {
  return (
    <aside className="sticky top-0 flex flex-col gap-4 overflow-y-auto py-6">
      <SuggestedUsers />

      <TrendingTags />
    </aside>
  );
}
