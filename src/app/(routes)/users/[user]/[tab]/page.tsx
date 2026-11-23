import { notFound, redirect } from 'next/navigation';
import type { JSX } from 'react';
import { getFollowersList, getFollowingList } from '@/actions/profile';
import { auth } from '@/auth';
import { FollowPageHeader } from '@/components/FollowPageHeader';
import { FollowUserList } from '@/components/FollowUserList';
import { getUserProfileByUsername } from '@/data/profile';
import { getFollowListTab } from '@/utils/follow-tab';
import { formatDisplayName } from '@/utils/format-display-name';

export default async function UserFollowList({
  params,
}: PageProps<'/users/[user]/[tab]'>): Promise<JSX.Element> {
  const { tab: tabSlug, user: username } = await params;
  const tab = getFollowListTab(tabSlug);
  if (!tab) notFound();

  const profile = await getUserProfileByUsername(username);
  if (!profile) notFound();

  const session = await auth();
  if (session?.user?.id === profile.id) redirect(`/profile/${tabSlug}`);

  const users =
    tab === 'followers'
      ? await getFollowersList(profile.id)
      : await getFollowingList(profile.id);

  return (
    <div className="flex flex-col gap-6">
      <FollowPageHeader
        backHref={`/users/${profile.username}`}
        displayName={formatDisplayName(profile.username)}
        followersCount={profile.followersCount}
        followersHref={`/users/${profile.username}/followers`}
        followingCount={profile.followingCount}
        followingHref={`/users/${profile.username}/following`}
        tab={tab}
      />

      <FollowUserList
        emptyMessage={
          tab === 'followers'
            ? 'Todavía no tiene seguidores.'
            : 'Todavía no sigue a nadie.'
        }
        initialUsers={users}
        removable={false}
        tab={tab}
      />
    </div>
  );
}
