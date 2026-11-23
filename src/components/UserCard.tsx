'use client';

import { User } from 'lucide-react';
import Image from 'next/image';
import type { JSX } from 'react';
import { PublishButton } from '@/components/PublishButton';
import { Separator } from '@/components/Separator';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { useUserStore } from '@/store/user-store';
import { formatDisplayName } from '@/utils/format-display-name';

export function UserCard(): JSX.Element | null {
  const user = useUserStore((s) => s.user);
  if (!user) return null;

  return (
    <CardWrapper
      as="article"
      className="flex h-44 w-56 flex-col justify-between"
    >
      <div className="flex items-center gap-2">
        {user.avatarUrl ? (
          <Image
            alt={`${user.username} avatar`}
            className="h-10.5 w-10.5 shrink-0 rounded-[10px] object-cover"
            height={42}
            loading="eager"
            src={user.avatarUrl}
            width={42}
          />
        ) : (
          <span className="shrink-0 rounded-[10px] bg-zinc-200">
            <User color="white" size={42} />
          </span>
        )}

        <div className="flex min-w-0 flex-col">
          <span className="truncate font-bold text-[14px]">
            {formatDisplayName(user.username)}
          </span>

          <small className="truncate text-[#7e8288] text-[12px]">
            @{user.username}
          </small>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-4">
        <small className="text-[#7e8288] text-[12px]">
          <span className="font-bold text-black">{user.postsCount}</span> posts
        </small>

        <small className="text-[#7e8288] text-[12px]">
          <span className="font-bold text-black">{user.followersCount}</span>{' '}
          seguidores
        </small>
      </div>

      <PublishButton />
    </CardWrapper>
  );
}
