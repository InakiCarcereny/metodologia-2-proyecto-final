'use client';

import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import type { JSX, MouseEvent } from 'react';
import { PostCardFooterButton } from '@/components/PostCardFooterButton';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import type { Post } from '@/types/post';

interface PostCardFooterProps {
  post: Post;
}

export function PostCardFooter({ post }: PostCardFooterProps): JSX.Element {
  const { state, toggleBookmark, toggleLike, toggleRepost } =
    usePostInteractions({
      idPost: post.id,
      initial: {
        bookmarked: post.viewer?.bookmarked ?? false,
        comments: post.commentsCount,
        liked: post.viewer?.liked ?? false,
        likes: post.likesCount,
        reposted: post.viewer?.reposted ?? false,
        reposts: post.sharesCount,
      },
    });

  const handleLike = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    toggleLike();
  };

  const handleRepost = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    toggleRepost();
  };

  const handleBookmark = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    toggleBookmark();
  };

  return (
    <footer className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <PostCardFooterButton
          activeClassName="bg-[#eaf1fd] text-[#3b6fd4]"
          count={state.comments}
          hoverClassName="hover:bg-[#eaf1fd] hover:text-[#3b6fd4]"
          icon={MessageCircle}
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

      {!post.isOwnPost && (
        <PostCardFooterButton
          activeClassName="bg-[#fdf1df] text-[#b9790a]"
          fillIconWhenActive
          hoverClassName="hover:bg-[#fdf1df] hover:text-[#b9790a]"
          icon={Bookmark}
          isActive={state.bookmarked}
          onClick={handleBookmark}
        />
      )}
    </footer>
  );
}
