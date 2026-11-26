import { useState, useTransition } from 'react';
import type { Post } from '@/types/post';

export type FetchMoreResult =
  | { hasMore: boolean; posts: Post[] }
  | { error: string };

interface UsePaginatedPostsArgs {
  fetchMore: (offset: number) => Promise<FetchMoreResult>;
  initialHasMore: boolean;
  initialPosts: Post[];
}

export function usePaginatedPosts({
  fetchMore,
  initialHasMore,
  initialPosts,
}: UsePaginatedPostsArgs) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();

  const loadMore = (): void => {
    if (isPending) return;
    setError(undefined);

    startTransition(async () => {
      const result = await fetchMore(posts.length);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      setPosts((current) => [...current, ...result.posts]);
      setHasMore(result.hasMore);
    });
  };

  return { error, hasMore, isPending, loadMore, posts, setHasMore, setPosts };
}
