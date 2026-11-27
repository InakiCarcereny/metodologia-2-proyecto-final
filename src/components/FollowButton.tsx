import type { JSX } from 'react';
import { followUser, unfollowUser } from '@/actions/follow';
import { FollowToggleButton } from '@/components/FollowToggleButton';

interface FollowButtonProps {
  className?: string;
  initialIsFollowing?: boolean;
  userId: string;
}

export function FollowButton({
  className,
  initialIsFollowing,
  userId,
}: FollowButtonProps): JSX.Element {
  return (
    <FollowToggleButton
      className={className}
      follow={followUser}
      id={userId}
      initialIsFollowing={initialIsFollowing}
      unfollow={unfollowUser}
    />
  );
}
