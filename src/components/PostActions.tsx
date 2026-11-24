'use client';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import type { JSX } from 'react';
import { useState, useTransition } from 'react';
import { repostPost, toggleBookmark, toggleLike } from '@/actions/posts';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  idPost: string;
  stats: { comments: number; likes: number; reposts: number };
  viewer: { bookmarked: boolean; liked: boolean; reposted: boolean };
}

interface ActionState {
  bookmarked: boolean;
  comments: number;
  liked: boolean;
  likes: number;
  reposted: boolean;
  reposts: number;
}

export function PostActions({
  idPost,
  stats,
  viewer,
}: PostActionsProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<ActionState>({
    bookmarked: viewer.bookmarked,
    comments: stats.comments,
    liked: viewer.liked,
    likes: stats.likes,
    reposted: viewer.reposted,
    reposts: stats.reposts,
  });

  function handleLike() {
    if (isPending) return;

    const snapshot = state;
    const liked = !state.liked;
    setState({ ...state, liked, likes: state.likes + (liked ? 1 : -1) });

    startTransition(async () => {
      const result = await toggleLike({ idPost });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  }

  function handleRepost() {
    if (isPending) return;

    const snapshot = state;
    const reposted = !state.reposted;
    setState({
      ...state,
      reposted,
      reposts: state.reposts + (reposted ? 1 : -1),
    });

    startTransition(async () => {
      const result = await repostPost({ idPost });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  }

  function handleBookmark() {
    if (isPending) return;

    const snapshot = state;
    setState({ ...state, bookmarked: !state.bookmarked });

    startTransition(async () => {
      const result = await toggleBookmark({ idPost });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  }

  return (
    <div className="flex items-center justify-between text-[#676b72] text-xs">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5">
          <MessageCircle size={15} />
          <span className="font-mono">{state.comments}</span>
        </span>

        <button
          aria-pressed={state.reposted}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#67bb7c]',
            state.reposted && 'text-[#67bb7c]',
          )}
          onClick={handleRepost}
          type="button"
        >
          <Repeat2 size={15} />
          <span className="font-mono">{state.reposts}</span>
        </button>

        <button
          aria-pressed={state.liked}
          className={cn(
            'flex cursor-pointer items-center gap-1.5 transition-colors hover:text-[#b0413e]',
            state.liked && 'text-[#b0413e]',
          )}
          onClick={handleLike}
          type="button"
        >
          <Heart fill={state.liked ? 'currentColor' : 'none'} size={15} />
          <span className="font-mono">{state.likes}</span>
        </button>
      </div>

      <button
        aria-pressed={state.bookmarked}
        className={cn(
          'cursor-pointer transition-colors hover:text-[#171b22]',
          state.bookmarked ? 'text-[#171b22]' : 'text-[#676b72]',
        )}
        onClick={handleBookmark}
        type="button"
      >
        <Bookmark fill={state.bookmarked ? 'currentColor' : 'none'} size={15} />
      </button>
    </div>
  );
}
