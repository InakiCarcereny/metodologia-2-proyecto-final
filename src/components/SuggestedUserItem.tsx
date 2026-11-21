import Image from 'next/image';
import Link from 'next/link';
import type { JSX } from 'react';
import { Separator } from '@/components/Separator';
import { FollowButton } from './FollowButton';

interface SuggestedUserItemProps {
  name: string;
  username: string;
}

export function SuggestedUserItem({
  name,
  username,
}: SuggestedUserItemProps): JSX.Element {
  return (
    <li className="flex w-full flex-col gap-2">
      <div className="mt-2 mb-2 flex items-center justify-between">
        <Link className="flex items-center gap-2" href={`/users/${username}`}>
          <Image
            alt="image"
            className="shrink-0 rounded-[10px]"
            height={36}
            loading="eager"
            src="/tired-totoro.jpg"
            width={42}
          />

          <div className="flex min-w-0 flex-col">
            <span className="truncate font-bold text-[14px]">{name}</span>

            <small className="truncate text-[#7e8288] text-[12px]">
              @{username}
            </small>
          </div>
        </Link>

        <FollowButton className="w-15" />
      </div>

      <Separator />
    </li>
  );
}
