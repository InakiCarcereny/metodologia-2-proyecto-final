'use client';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import type { JSX, MouseEvent } from 'react';
import { useState, useTransition } from 'react';
import { repostPost, toggleBookmark, toggleLike } from '@/actions/posts';
import { PostCardFooterButton } from '@/components/PostCardFooterButton';
import type { Post } from '@/types/post';

interface PostCardFooterProps {
  post: Post;
}

export function PostCardFooter({ post }: PostCardFooterProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState({
    bookmarked: post.viewer?.bookmarked ?? false,
    comments: post.commentsCount,
    liked: post.viewer?.liked ?? false,
    likes: post.likesCount,
    reposted: post.viewer?.reposted ?? false,
    reposts: post.sharesCount,
  });

  function handleLike(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (isPending) return;

    const snapshot = state;
    const liked = !state.liked;
    setState({ ...state, liked, likes: state.likes + (liked ? 1 : -1) });

    startTransition(async () => {
      const result = await toggleLike({ idPost: post.id });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  }

  function handleRepost(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (isPending) return;

    const snapshot = state;
    const reposted = !state.reposted;
    setState({
      ...state,
      reposted,
      reposts: state.reposts + (reposted ? 1 : -1),
    });

    startTransition(async () => {
      const result = await repostPost({ idPost: post.id });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  }

  function handleBookmark(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (isPending) return;

    const snapshot = state;
    setState({ ...state, bookmarked: !state.bookmarked });

    startTransition(async () => {
      const result = await toggleBookmark({ idPost: post.id });

      if ('error' in result) {
        setState(snapshot);
      }
    });
  }

  return (
    <footer className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <PostCardFooterButton
          activeClassName="bg-[#eaf1fd] text-[#3b6fd4]"
          count={state.comments}
          hoverClassName="hover:bg-[#eaf1fd] hover:text-[#3b6fd4]"
          icon={MessageCircle}
          onClick={(event) => event.stopPropagation()}
        />

        <PostCardFooterButton
          activeClassName="bg-[#e6f4ea] text-[#1e7e34]"
          count={state.reposts}
          hoverClassName="hover:bg-[#e6f4ea] hover:text-[#1e7e34]"
          icon={Repeat2}
          isActive={state.reposted}
          onClick={handleRepost}
        />

        <PostCardFooterButton
          activeClassName="bg-[#fdecea] text-[#c0392b]"
          count={state.likes}
          fillIconWhenActive
          hoverClassName="hover:bg-[#fdecea] hover:text-[#c0392b]"
          icon={Heart}
          isActive={state.liked}
          onClick={handleLike}
        />
      </div>

      <PostCardFooterButton
        activeClassName="bg-[#eaf1fd] text-[#3b6fd4]"
        fillIconWhenActive
        hoverClassName="hover:bg-[#eaf1fd] hover:text-[#3b6fd4]"
        icon={Bookmark}
        isActive={state.bookmarked}
        onClick={handleBookmark}
      />
    </footer>
  );
}
