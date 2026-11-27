'use client';

import type { JSX } from 'react';
import { fetchMoreBookmarks } from '@/actions/posts';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/Button';
import type { BookmarkFilter } from '@/data/post';
import { usePaginatedPosts } from '@/hooks/usePaginatedPosts';
import type { Post } from '@/types/post';

interface BookmarksFeedProps {
  emptyMessage: string;
  filter: BookmarkFilter;
  initialHasMore: boolean;
  initialPosts: Post[];
}

export function BookmarksFeed({
  emptyMessage,
  filter,
  initialHasMore,
  initialPosts,
}: BookmarksFeedProps): JSX.Element {
  const { error, hasMore, isPending, loadMore, posts } = usePaginatedPosts({
    fetchMore: (offset) => fetchMoreBookmarks({ filter, offset }),
    initialHasMore,
    initialPosts,
  });

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
