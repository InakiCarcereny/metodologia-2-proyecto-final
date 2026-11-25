import { useEffect, useState, useTransition } from 'react';
import {
  repostPost,
  toggleBookmark as toggleBookmarkAction,
  toggleLike as toggleLikeAction,
} from '@/actions/posts';

export interface PostInteractionsState {
  bookmarked: boolean;
  comments: number;
  liked: boolean;
  likes: number;
  reposted: boolean;
  reposts: number;
}

interface UsePostInteractionsArgs {
  idPost: string;
  initial: PostInteractionsState;
}

type ToggleResult = { error?: unknown } & Record<string, unknown>;
type ToggleActionFn = (input: { idPost: string }) => Promise<ToggleResult>;
type StartTransition = (callback: () => Promise<void> | void) => void;

export function usePostInteractions({
  idPost,
  initial,
}: UsePostInteractionsArgs) {
  const [state, setState] = useState<PostInteractionsState>(initial);
  const [isLikePending, startLikeTransition] = useTransition();
  const [isRepostPending, startRepostTransition] = useTransition();
  const [isBookmarkPending, startBookmarkTransition] = useTransition();

  useEffect(() => {
    setState({
      bookmarked: initial.bookmarked,
      comments: initial.comments,
      liked: initial.liked,
      likes: initial.likes,
      reposted: initial.reposted,
      reposts: initial.reposts,
    });
  }, [
    initial.bookmarked,
    initial.comments,
    initial.liked,
    initial.likes,
    initial.reposted,
    initial.reposts,
  ]);

  const runToggle = (
    isPending: boolean,
    startTransition: StartTransition,
    action: ToggleActionFn,
    buildOptimisticState: (
      current: PostInteractionsState,
    ) => PostInteractionsState,
  ): void => {
    if (isPending) return;

    const snapshot = state;
    setState(buildOptimisticState(state));

    startTransition(async () => {
      const result = await action({ idPost });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  };

  const toggleLike = (): void => {
    runToggle(
      isLikePending,
      startLikeTransition,
      toggleLikeAction,
      (current) => ({
        ...current,
        liked: !current.liked,
        likes: current.likes + (current.liked ? -1 : 1),
      }),
    );
  };

  const toggleRepost = (): void => {
    runToggle(
      isRepostPending,
      startRepostTransition,
      repostPost,
      (current) => ({
        ...current,
        reposted: !current.reposted,
        reposts: current.reposts + (current.reposted ? -1 : 1),
      }),
    );
  };

  const toggleBookmark = (): void => {
    runToggle(
      isBookmarkPending,
      startBookmarkTransition,
      toggleBookmarkAction,
      (current) => ({ ...current, bookmarked: !current.bookmarked }),
    );
  };

  return {
    isBookmarkPending,
    isLikePending,
    isRepostPending,
    state,
    toggleBookmark,
    toggleLike,
    toggleRepost,
  };
}
