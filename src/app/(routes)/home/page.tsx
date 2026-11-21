import type { JSX } from 'react';
import { auth } from '@/auth';
import { Composer } from '@/components/Composer';
import { FeedTabs } from '@/components/FeedTabs';
import { PostCard } from '@/components/PostCard';
import { type FeedTab, getFeedPosts } from '@/db/queries/posts';

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
        <FeedTabs />
      </div>

      {feed.length === 0 ? (
        <p className="py-10 text-center font-mono text-[#878992] text-sm">
          Todavía no hay posts por acá
        </p>
      ) : (
        feed.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
