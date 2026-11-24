import { notFound, redirect } from 'next/navigation';
import type { JSX } from 'react';
import { getFollowersList, getFollowingList } from '@/actions/profile';
import { auth } from '@/auth';
import { FollowPageHeader } from '@/components/FollowPageHeader';
import { FollowUserList } from '@/components/FollowUserList';
import { getUserProfileById } from '@/data/profile';
import { getFollowListTab } from '@/utils/follow-tab';
import { formatDisplayName } from '@/utils/format-display-name';

export default async function ProfileFollowList({
  params,
}: PageProps<'/profile/[tab]'>): Promise<JSX.Element> {
  const { tab: tabSlug } = await params;
  const tab = getFollowListTab(tabSlug);
  if (!tab) notFound();

  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const profile = await getUserProfileById(session.user.id);
  if (!profile) redirect('/login');

  const users =
    tab === 'followers'
      ? await getFollowersList(profile.id)
      : await getFollowingList(profile.id);

  return (
    <div className="flex flex-col gap-6">
      <FollowPageHeader
        backHref="/profile"
        displayName={formatDisplayName(profile.username)}
        followersCount={profile.followersCount}
        followersHref="/profile/followers"
        followingCount={profile.followingCount}
        followingHref="/profile/following"
        tab={tab}
      />

      <FollowUserList
        emptyMessage={
          tab === 'followers'
            ? 'Todavía no tenés seguidores.'
            : 'Todavía no seguís a nadie.'
        }
        initialUsers={users}
        removable={tab === 'followers'}
        tab={tab}
      />
    </div>
  );
}
