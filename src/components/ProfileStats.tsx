import Link from 'next/link';
import type { JSX } from 'react';

interface ProfileStatsProps {
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  postsCount: number;
  username: string;
}

export function ProfileStats({
  followersCount,
  followingCount,
  isOwnProfile,
  postsCount,
  username,
}: ProfileStatsProps): JSX.Element {
  const basePath = isOwnProfile ? '/profile' : `/users/${username}`;

  return (
    <div className="flex items-center gap-8 text-[#82868c] text-[13px]">
      <span className="flex items-center gap-2">
        <span className="font-bold text-black text-xl">{postsCount}</span>
        posts
      </span>

      <Link className="flex items-center gap-2" href={`${basePath}/followers`}>
        <span className="font-bold text-black text-xl">{followersCount}</span>
        seguidores
      </Link>

      <Link className="flex items-center gap-2" href={`${basePath}/following`}>
        <span className="font-bold text-black text-xl">{followingCount}</span>
        siguiendo
      </Link>
    </div>
  );
}
