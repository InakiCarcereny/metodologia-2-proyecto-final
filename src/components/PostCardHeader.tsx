import { MoreHorizontal } from 'lucide-react';
import type { JSX } from 'react';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { cn } from '@/lib/utils';
import type { Post } from '@/types/post';
import { formatDisplayName } from '@/utils/format-display-name';
import { formatRelativeTime } from '@/utils/format-relative-time';
import { POST_TYPE_LABELS, POST_TYPE_STYLES } from '@/utils/post-type';

interface PostCardHeaderProps {
  detail?: boolean;
  post: Post;
}

export function PostCardHeader({
  detail = false,
  post,
}: PostCardHeaderProps): JSX.Element {
  return (
    <header className="flex items-start justify-between gap-3">
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
          </small>
        </div>
      </div>

      {detail ? (
        <div className="flex flex-wrap justify-end gap-2">
          {post.tags.map((tag) => (
            <span
              className="rounded-lg border border-[#d6d7db] px-2 py-1 font-mono text-[#494d56] text-[11px]"
              key={tag.id}
            >
              #{tag.label}
            </span>
          ))}
        </div>
      ) : (
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
      )}
    </header>
  );
}
