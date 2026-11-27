import { User } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  avatarUrl: string | null;
  className?: string;
  iconSize?: number;
  imageSize: number;
  username: string;
}

export function UserAvatar({
  avatarUrl,
  className,
  iconSize = 24,
  imageSize,
  username,
}: UserAvatarProps): JSX.Element {
  if (avatarUrl) {
    return (
      <Image
        alt={`${username} avatar`}
        className={cn('shrink-0 rounded-[10px] object-cover', className)}
        height={imageSize}
        loading="eager"
        src={avatarUrl}
        width={imageSize}
      />
    );
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-[10px] bg-zinc-200',
        className,
      )}
    >
      <User color="white" size={iconSize} />
    </span>
  );
}
