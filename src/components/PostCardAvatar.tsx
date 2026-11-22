import { User } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';

interface PostCardAvatarProps {
  avatarUrl: string | null;
  username: string;
}

export function PostCardAvatar({
  avatarUrl,
  username,
}: PostCardAvatarProps): JSX.Element {
  if (avatarUrl) {
    return (
      <Image
        alt={`${username} avatar`}
        className="h-9 w-9 shrink-0 rounded-[10px] object-cover"
        height={36}
        src={avatarUrl}
        width={36}
      />
    );
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-zinc-200">
      <User color="white" size={20} />
    </span>
  );
}
