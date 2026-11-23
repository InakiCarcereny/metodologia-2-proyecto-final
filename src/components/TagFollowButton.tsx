import type { JSX } from 'react';
import { followTag, unfollowTag } from '@/actions/tag';
import { FollowToggleButton } from '@/components/FollowToggleButton';

interface TagFollowButtonProps {
  className?: string;
  initialIsFollowing?: boolean;
  tagId: string;
}

export function TagFollowButton({
  className,
  initialIsFollowing,
  tagId,
}: TagFollowButtonProps): JSX.Element {
  return (
    <FollowToggleButton
      className={className}
      follow={followTag}
      id={tagId}
      initialIsFollowing={initialIsFollowing}
      unfollow={unfollowTag}
    />
  );
}
