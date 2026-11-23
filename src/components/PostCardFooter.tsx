'use client';

import { Heart, MessageCircle, Repeat2 } from 'lucide-react';
import type { JSX, MouseEvent } from 'react';
import { useState } from 'react';
import { PostCardFooterButton } from '@/components/PostCardFooterButton';
import type { Post } from '@/types/post';

interface PostCardFooterProps {
  post: Post;
}

export function PostCardFooter({ post }: PostCardFooterProps): JSX.Element {
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);

  const stopCardNavigation = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleLikeClick = (event: MouseEvent<HTMLButtonElement>): void => {
    stopCardNavigation(event);
    setIsLiked((previous) => !previous);
  };

  const handleRepostClick = (event: MouseEvent<HTMLButtonElement>): void => {
    stopCardNavigation(event);
    setIsReposted((previous) => !previous);
  };

  return (
    <footer className="flex items-center gap-3 text-xs">
      <PostCardFooterButton
        activeClassName="bg-[#eaf1fd] text-[#3b6fd4]"
        count={post.commentsCount}
        hoverClassName="hover:bg-[#eaf1fd] hover:text-[#3b6fd4]"
        icon={MessageCircle}
        onClick={stopCardNavigation}
      />

      <PostCardFooterButton
        activeClassName="bg-[#e6f4ea] text-[#1e7e34]"
        count={post.sharesCount + (isReposted ? 1 : 0)}
        hoverClassName="hover:bg-[#e6f4ea] hover:text-[#1e7e34]"
        icon={Repeat2}
        isActive={isReposted}
        onClick={handleRepostClick}
      />

      <PostCardFooterButton
        activeClassName="bg-[#fdecea] text-[#c0392b]"
        count={post.likesCount + (isLiked ? 1 : 0)}
        fillIconWhenActive
        hoverClassName="hover:bg-[#fdecea] hover:text-[#c0392b]"
        icon={Heart}
        isActive={isLiked}
        onClick={handleLikeClick}
      />
    </footer>
  );
}
