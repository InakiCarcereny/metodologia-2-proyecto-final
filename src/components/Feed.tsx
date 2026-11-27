'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { fetchMoreFeedPosts } from '@/actions/posts';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/Button';
import type { FeedTab } from '@/data/post';
import { usePaginatedPosts } from '@/hooks/usePaginatedPosts';
import type { Post } from '@/types/post';

interface FeedProps {
  emptyMessage: string;
  initialHasMore: boolean;
  initialPosts: Post[];
  tab: FeedTab;
}

export function Feed({
  emptyMessage,
  initialHasMore,
  initialPosts,
  tab,
}: FeedProps): JSX.Element {
  const { error, hasMore, isPending, loadMore, posts, setHasMore, setPosts } =
    usePaginatedPosts({
      fetchMore: (offset) => fetchMoreFeedPosts({ offset, tab }),
      initialHasMore,
      initialPosts,
    });
  const previousTab = useRef(tab);

  useEffect(() => {
    if (previousTab.current !== tab) {
      previousTab.current = tab;
      setPosts(initialPosts);
      setHasMore(initialHasMore);
      return;
    }

    setPosts((current) => {
      const knownIds = new Set(current.map((post) => post.id));
      const newPosts = initialPosts.filter((post) => !knownIds.has(post.id));

      return newPosts.length > 0 ? [...newPosts, ...current] : current;
    });
  }, [tab, initialPosts, initialHasMore, setPosts, setHasMore]);

  if (posts.length === 0) {
    return (
      <p className="py-10 text-center font-mono text-[#878992] text-sm">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {error && (
        <span className="text-center font-medium text-red-400 text-sm">
          {error}
        </span>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button
            className="bg-none text-[#676b72] hover:text-black"
            disabled={isPending}
            onClick={loadMore}
            type="button"
            variant={null}
          >
            {isPending ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </div>
  );
}
