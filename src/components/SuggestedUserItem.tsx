import Link from 'next/link';
import type { JSX } from 'react';
import { FollowButton } from '@/components/FollowButton';
import { Separator } from '@/components/Separator';
import { UserAvatar } from '@/components/UserAvatar';
import { formatDisplayName } from '@/utils/format-display-name';

interface SuggestedUserItemProps {
  avatarUrl: string | null;
  id: string;
  username: string;
}

export function SuggestedUserItem({
  avatarUrl,
  id,
  username,
}: SuggestedUserItemProps): JSX.Element {
  return (
    <li className="flex w-full flex-col gap-2">
      <div className="mt-2 mb-2 flex items-center justify-between">
        <Link className="flex items-center gap-2" href={`/users/${username}`}>
          <UserAvatar
            avatarUrl={avatarUrl}
            className="h-10.5 w-10.5"
            imageSize={42}
            username={username}
          />

          <div className="flex min-w-0 flex-col">
            <span className="truncate font-bold text-[14px]">
              {formatDisplayName(username)}
            </span>

            <small className="truncate text-[#7e8288] text-[12px]">
              @{username}
            </small>
          </div>
        </Link>

        <FollowButton className="w-15" userId={id} />
      </div>

      <Separator />
    </li>
  );
}
