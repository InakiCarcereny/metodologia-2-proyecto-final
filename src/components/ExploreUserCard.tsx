import Link from 'next/link';
import type { JSX } from 'react';
import { FollowButton } from '@/components/FollowButton';
import { PostCardAvatar } from '@/components/PostCardAvatar';
import { cn } from '@/lib/utils';
import { formatDisplayName } from '@/utils/format-display-name';

interface ExploreUserCardProps {
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  id: string;
  isLastRow?: boolean;
  isRightColumn?: boolean;
  username: string;
}

export function ExploreUserCard({
  avatarUrl,
  bio,
  followersCount,
  id,
  isLastRow = false,
  isRightColumn = false,
  username,
}: ExploreUserCardProps): JSX.Element {
  return (
    <li
      className={cn(
        'flex flex-col gap-3 border-[#dfe1e5] p-4',
        !isLastRow && 'border-b',
        !isRightColumn && 'border-r',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Link
          className="flex min-w-0 items-center gap-3"
          href={`/users/${username}`}
        >
          <PostCardAvatar avatarUrl={avatarUrl} username={username} />

          <div className="flex min-w-0 flex-col">
            <span className="truncate font-bold text-[#171b22] text-[14px]">
              {formatDisplayName(username)}
            </span>

            <span className="truncate font-mono text-[#7e8288] text-[12px]">
              @{username}
            </span>
          </div>
        </Link>

        <FollowButton className="min-w-20 px-3 py-1" userId={id} />
      </div>

      <p className="line-clamp-2 h-10 overflow-hidden text-[#494d56] text-[13px] leading-relaxed">
        {bio ?? ''}
      </p>

      <span className="font-mono text-[#7e8288] text-xs">
        {followersCount} seguidores
      </span>
    </li>
  );
}
