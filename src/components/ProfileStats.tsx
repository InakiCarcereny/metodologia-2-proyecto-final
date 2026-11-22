import type { JSX } from 'react';

interface ProfileStatsProps {
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export function ProfileStats({
  followersCount,
  followingCount,
  postsCount,
}: ProfileStatsProps): JSX.Element {
  const stats = [
    { label: 'posts', value: postsCount },
    { label: 'seguidores', value: followersCount },
    { label: 'siguiendo', value: followingCount },
  ];

  return (
    <div className="flex items-center gap-8 text-[#82868c] text-[13px]">
      {stats.map(({ label, value }) => (
        <span className="flex items-center gap-2" key={label}>
          <span className="font-bold text-black text-xl">{value}</span>
          {label}
        </span>
      ))}
    </div>
  );
}
