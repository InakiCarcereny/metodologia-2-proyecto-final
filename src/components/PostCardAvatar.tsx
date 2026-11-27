import type { JSX } from 'react';
import { UserAvatar } from '@/components/UserAvatar';

interface PostCardAvatarProps {
  avatarUrl: string | null;
  username: string;
}

export function PostCardAvatar({
  avatarUrl,
  username,
}: PostCardAvatarProps): JSX.Element {
  return (
    <UserAvatar
      avatarUrl={avatarUrl}
      className="h-9 w-9"
      iconSize={20}
      imageSize={36}
      username={username}
    />
  );
}
