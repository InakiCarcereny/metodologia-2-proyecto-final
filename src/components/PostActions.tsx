import { Bookmark, Heart, MessageCircle, Repeat2 } from 'lucide-react';
import type { JSX } from 'react';

interface PostActionsProps {
  comments: number;
  likes: number;
  shares: number;
}

export function PostActions({
  comments,
  likes,
  shares,
}: PostActionsProps): JSX.Element {
  return (
    <div className="flex items-center justify-between text-[#676b72] text-xs">
      <div className="flex items-center gap-6">
        <span className="flex cursor-pointer items-center gap-1.5">
          <MessageCircle size={15} />
          {comments}
        </span>

        <span className="flex cursor-pointer items-center gap-1.5">
          <Repeat2 size={15} />
          {shares}
        </span>

        <span className="flex cursor-pointer items-center gap-1.5">
          <Heart size={15} />
          {likes}
        </span>
      </div>

      <span className="cursor-pointer">
        {' '}
        <Bookmark size={15} />{' '}
      </span>
    </div>
  );
}
