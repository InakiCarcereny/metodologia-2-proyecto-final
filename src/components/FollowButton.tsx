'use client';

import { type JSX, useState, useTransition } from 'react';
import { followUser, unfollowUser } from '@/actions/follow';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FollowButtonProps {
  className?: string;
  initialIsFollowing?: boolean;
  userId: string;
}

export function FollowButton({
  className,
  initialIsFollowing = false,
  userId,
}: FollowButtonProps): JSX.Element {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = (): void => {
    const next = !isFollowing;
    setIsFollowing(next);

    startTransition(async () => {
      const result = next
        ? await followUser(userId)
        : await unfollowUser(userId);

      if (result.error) setIsFollowing(!next);
    });
  };

  return (
    <Button
      className={cn(
        'font-light',
        isFollowing
          ? 'border-none bg-[#181c23] text-white hover:bg-[#303540]'
          : 'text-black',
        className,
      )}
      disabled={isPending}
      onClick={handleClick}
      type="button"
      variant="tertiary"
    >
      {isFollowing ? 'siguiendo' : 'seguir'}
    </Button>
  );
}
