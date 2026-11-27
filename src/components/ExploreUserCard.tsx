import Link from 'next/link';
import type { JSX } from 'react';
import { FollowButton } from '@/components/FollowButton';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { formatDisplayName } from '@/utils/format-display-name';

interface ExploreUserCardProps {
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  id: string;
  isFollowing?: boolean;
  isLastRow?: boolean;
  isRightColumn?: boolean;
  username: string;
}

export function ExploreUserCard({
  avatarUrl,
  bio,
  followersCount,
  id,
  isFollowing = false,
  isLastRow = false,
  isRightColumn = false,
  username,
}: ExploreUserCardProps): JSX.Element {
  return (
    <li
      className={cn(
        'relative flex flex-col gap-3 border-[#dfe1e5] p-4 transition-colors hover:bg-[#fafafa]',
        !isLastRow && 'border-b',
        !isRightColumn && 'border-r',
      )}
    >
      <Link
        aria-label={`Ver perfil de ${username}`}
        className="absolute inset-0 z-0 rounded-lg"
        href={`/users/${encodeURIComponent(username)}`}
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar
              avatarUrl={avatarUrl}
              className="h-10.5 w-10.5"
              imageSize={42}
              username={username}
            />

            <div className="flex min-w-0 flex-col">
              <span className="truncate font-bold text-[#171b22] text-[14px]">
                {formatDisplayName(username)}
              </span>

              <span className="truncate font-mono text-[#7e8288] text-[12px]">
                @{username}
              </span>
            </div>
          </div>

          <div className="pointer-events-auto">
            <FollowButton
              className="min-w-20 px-3 py-1"
              initialIsFollowing={isFollowing}
              userId={id}
            />
          </div>
        </div>

        <p className="line-clamp-2 h-10 overflow-hidden text-[#494d56] text-[13px] leading-relaxed">
          {bio ?? ''}
        </p>

        <span className="font-mono text-[#7e8288] text-xs">
          {followersCount} seguidores
        </span>
      </div>
    </li>
  );
}
