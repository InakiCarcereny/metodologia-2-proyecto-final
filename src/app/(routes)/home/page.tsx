import type { JSX } from 'react';
import { auth } from '@/auth';
import { Composer } from '@/components/Composer';
import { Feed } from '@/components/Feed';
import { FeedTabs } from '@/components/FeedTabs';
import { FEED_PAGE_SIZE, type FeedTab, getFeedPosts } from '@/data/post';

interface HomeProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function Home({
  searchParams,
}: HomeProps): Promise<JSX.Element> {
  const { tab } = await searchParams;
  const activeTab: FeedTab = tab === 'following' ? 'following' : 'for-you';

  const session = await auth();
  const feed = await getFeedPosts({
    tab: activeTab,
    viewerId: session?.user?.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <Composer />

      <div className="flex justify-center">
        <FeedTabs activeTab={activeTab} />
      </div>

      <Feed
        emptyMessage="Todavía no hay posts por acá"
        initialHasMore={feed.length === FEED_PAGE_SIZE}
        initialPosts={feed}
        tab={activeTab}
      />
    </div>
  );
}
