import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import type { FollowListTab } from '@/utils/follow-tab';

interface FollowPageHeaderProps {
  backHref: string;
  displayName: string;
  followersCount: number;
  followersHref: string;
  followingCount: number;
  followingHref: string;
  tab: FollowListTab;
}

export function FollowPageHeader({
  backHref,
  displayName,
  followersCount,
  followersHref,
  followingCount,
  followingHref,
  tab,
}: FollowPageHeaderProps): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <Link
        className="flex items-center gap-2 text-[#7e8288] text-sm hover:text-black"
        href={backHref}
      >
        <ArrowLeft size={16} />
        {displayName}
      </Link>

      <h1 className="font-bold text-2xl">
        {tab === 'followers' ? 'Seguidores' : 'Seguidos'}
      </h1>

      <div className="flex gap-6 border-[#dfe1e5] border-b">
        <Link
          className={cn(
            'border-transparent border-b-2 px-1 pb-2 font-bold text-[#7e8288] text-[13px]',
            tab === 'followers' && 'border-black text-black',
          )}
          href={followersHref}
        >
          seguidores · {followersCount}
        </Link>

        <Link
          className={cn(
            'border-transparent border-b-2 px-1 pb-2 font-bold text-[#7e8288] text-[13px]',
            tab === 'following' && 'border-black text-black',
          )}
          href={followingHref}
        >
          seguidos · {followingCount}
        </Link>
      </div>
    </div>
  );
}
