import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { FollowButton } from '@/components/FollowButton';
import { Separator } from '@/components/Separator';
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
          {avatarUrl ? (
            <Image
              alt={`${username} avatar`}
              className="h-10.5 w-10.5 shrink-0 rounded-[10px] object-cover"
              height={36}
              loading="eager"
              src={avatarUrl}
              width={42}
            />
          ) : (
            <span className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-[10px] bg-zinc-200">
              <User color="white" size={24} />
            </span>
          )}

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
