'use client';

import { type JSX, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ToggleActionResult {
  error?: string;
  success?: boolean;
}

interface FollowToggleButtonProps {
  className?: string;
  follow: (id: string) => Promise<ToggleActionResult>;
  id: string;
  initialIsFollowing?: boolean;
  unfollow: (id: string) => Promise<ToggleActionResult>;
}

export function FollowToggleButton({
  className,
  follow,
  id,
  initialIsFollowing = false,
  unfollow,
}: FollowToggleButtonProps): JSX.Element {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  const handleClick = (): void => {
    const next = !isFollowing;
    setIsFollowing(next);

    startTransition(async () => {
      const result = next ? await follow(id) : await unfollow(id);

      if (result.error) setIsFollowing(!next);
    });
  };

  return (
    <Button
      className={cn(
        'font-light',
        isFollowing
          ? 'border-[#181c23] bg-[#181c23] font-bold text-white hover:bg-[#303540]'
          : 'text-black',
        className,
      )}
      disabled={isPending}
      onClick={handleClick}
      type="button"
      variant="tertiary"
    >
      {isFollowing ? 'Siguiendo' : 'Seguir'}
    </Button>
  );
}
