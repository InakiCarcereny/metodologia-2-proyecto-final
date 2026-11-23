import type { JSX } from 'react';
import { TagFollowButton } from '@/components/TagFollowButton';
import { CardWrapper } from '@/components/ui/CardWrapper';
import type { TagCardData } from '@/types/tag';

interface TagHeaderProps {
  isFollowing: boolean;
  isLoggedIn: boolean;
  tag: TagCardData;
}

export function TagHeader({
  isFollowing,
  isLoggedIn,
  tag,
}: TagHeaderProps): JSX.Element {
  return (
    <CardWrapper
      as="section"
      className="flex items-start justify-between gap-4"
    >
      <div className="flex min-w-0 flex-col gap-3">
        <h1 className="font-bold text-2xl">#{tag.label}</h1>

        {tag.description && (
          <p className="wrap-break-word font-light text-[#44474c] text-[14px]">
            {tag.description}
          </p>
        )}

        <div className="flex items-center gap-4 font-light text-[#82868c] text-[13px]">
          <span>
            <span className="font-bold text-black">{tag.postsCount}</span>{' '}
            {tag.postsCount === 1 ? 'post' : 'posts'}
          </span>

          <span>
            <span className="font-bold text-black">{tag.followersCount}</span>{' '}
            {tag.followersCount === 1 ? 'seguidor' : 'seguidores'}
          </span>
        </div>
      </div>

      {isLoggedIn && (
        <TagFollowButton
          className="w-32 shrink-0"
          initialIsFollowing={isFollowing}
          tagId={tag.id}
        />
      )}
    </CardWrapper>
  );
}
