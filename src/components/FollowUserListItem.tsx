import Link from 'next/link';
import type { JSX } from 'react';
import { FollowButton } from '@/components/FollowButton';
import { RemoveFollowerButton } from '@/components/RemoveFollowerButton';
import { Separator } from '@/components/Separator';
import { UserAvatar } from '@/components/UserAvatar';
import type { UserListItem } from '@/types/user';
import { formatDisplayName } from '@/utils/format-display-name';

interface FollowUserListItemProps {
  isLast: boolean;
  isSelf: boolean;
  onRemove?: () => void;
  showFollowsViewerBadge: boolean;
  user: UserListItem;
}

export function FollowUserListItem({
  isLast,
  isSelf,
  onRemove,
  showFollowsViewerBadge,
  user,
}: FollowUserListItemProps): JSX.Element {
  return (
    <li className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Link
          className="flex min-w-0 items-center gap-2"
          href={`/users/${user.username}`}
        >
          <UserAvatar
            avatarUrl={user.avatarUrl}
            className="h-10.5 w-10.5"
            imageSize={42}
            username={user.username}
          />

          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <span className="truncate font-bold text-[14px]">
                {formatDisplayName(user.username)}
              </span>

              <small className="truncate text-[#7e8288] text-[12px]">
                @{user.username}
              </small>

              {showFollowsViewerBadge && user.followsViewer && (
                <span className="shrink-0 rounded-full bg-[#eaf1fd] px-2 py-0.5 font-bold text-[#3b6fd4] text-[12px]">
                  te sigue
                </span>
              )}
            </div>

            {user.bio && (
              <small className="truncate font-light text-[#7e8288] text-[12px]">
                {user.bio}
              </small>
            )}
          </div>
        </Link>

        {!isSelf && (
          <div className="flex shrink-0 items-center gap-3">
            <FollowButton
              className="w-24"
              initialIsFollowing={user.isFollowing}
              userId={user.id}
            />

            {onRemove && (
              <RemoveFollowerButton onRemoved={onRemove} userId={user.id} />
            )}
          </div>
        )}
      </div>

      {!isLast && <Separator />}
    </li>
  );
}
