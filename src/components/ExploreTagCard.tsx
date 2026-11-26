import Link from 'next/link';
import type { JSX } from 'react';
import { TagFollowButton } from '@/components/TagFollowButton';
import { cn } from '@/lib/utils';
import type { TagCardData } from '@/types/tag';

interface ExploreTagCardProps {
  cellClassName: string;
  isFollowing: boolean;
  tag: TagCardData | null;
}

export function ExploreTagCard({
  cellClassName,
  isFollowing,
  tag,
}: ExploreTagCardProps): JSX.Element {
  if (!tag) {
    return <div aria-hidden className={cellClassName} />;
  }

  return (
    <article
      className={cn(
        'relative flex flex-col gap-3 transition-colors hover:bg-[#fafafa]',
        cellClassName,
      )}
    >
      <Link
        aria-label={`Ver publicaciones con el tag ${tag.label}`}
        className="absolute inset-0 z-0 rounded-lg"
        href={`/tags/${encodeURIComponent(tag.label)}`}
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-mono text-[#171b22] text-[15px]">#{tag.label}</h3>

          <div className="pointer-events-auto">
            <TagFollowButton
              className="min-w-24 px-3 py-1 text-[13px]"
              initialIsFollowing={isFollowing}
              tagId={tag.id}
            />
          </div>
        </div>

        {tag.description && (
          <p className="line-clamp-2 text-[#494d56] text-sm">
            {tag.description}
          </p>
        )}

        <span className="mt-auto font-mono text-[#7e8288] text-xs">
          {tag.followersCount} seguidores · {tag.postsCount} posts
        </span>
      </div>
    </article>
  );
}
