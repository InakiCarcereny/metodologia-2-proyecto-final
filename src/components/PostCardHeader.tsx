import { MoreHorizontal } from 'lucide-react';
import type { JSX } from 'react';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { cn } from '@/lib/utils';
import type { Post, PostType } from '@/types/post';
import { formatDisplayName } from '@/utils/format-display-name';
import { formatRelativeTime } from '@/utils/format-relative-time';

interface PostCardHeaderProps {
  post: Post;
}

const POST_TYPE_LABELS: Record<PostType, string> = {
  article: 'artículo',
  question: 'pregunta',
  snippet: 'snippet',
};

const POST_TYPE_STYLES: Record<PostType, string> = {
  article: 'bg-[#eaf1fd] text-[#3b6fd4]',
  question: 'bg-[#f3ecfb] text-[#8a4fd1]',
  snippet: 'bg-[#fdecea] text-[#c0392b]',
};

export function PostCardHeader({ post }: PostCardHeaderProps): JSX.Element {
  return (
    <header className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <PostCardAvatar
          avatarUrl={post.author.avatarUrl}
          username={post.author.username}
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[14px]">
              {formatDisplayName(post.author.username)}
            </span>

            <span className="font-light text-[#7e8288] text-[13px]">
              @{post.author.username}
            </span>
          </div>

          <small className="text-[#7e8288] text-[12px]">
            {formatRelativeTime(post.createdAt)}

            {post.tags.length > 0 &&
              ` · ${post.tags.map((tag) => `#${tag.label}`).join(' ')}`}
          </small>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {post.isPinned && (
          <span className="rounded-full bg-[#e6f4ea] px-2 py-0.5 font-medium text-[#1e7e34] text-[11px]">
            fijado
          </span>
        )}

        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-medium text-[11px]',
            POST_TYPE_STYLES[post.type],
          )}
        >
          {POST_TYPE_LABELS[post.type]}
        </span>

        <MoreHorizontal className="text-[#9b9ea5]" size={18} />
      </div>
    </header>
  );
}
