import { notFound, redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ConnectedReposCard } from '@/components/ConnectedReposCard';
import { InferredStackCard } from '@/components/InferredStackCard';
import { PostList } from '@/components/PostList';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProfileTabs } from '@/components/ProfileTabs';
import { getConnectedRepos } from '@/data/github';
import { getUserProfileByUsername } from '@/data/profile';
import { getInferredStack } from '@/data/stack';

export default async function User({
  params,
}: PageProps<'/users/[user]'>): Promise<JSX.Element> {
  const { user } = await params;

  const profile = await getUserProfileByUsername(user);
  if (!profile) notFound();

  const session = await auth();
  if (session?.user?.id === profile.id) redirect('/profile');

  const [stack, repos] = await Promise.all([
    getInferredStack(profile.id),
    getConnectedRepos(profile.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader isOwnProfile={false} profile={profile} />

      {(stack.length > 0 || repos.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          <InferredStackCard stack={stack} />
          <ConnectedReposCard repos={repos} />
        </div>
      )}

      <ProfileTabs
        postsSlot={
          <PostList
            emptyMessage="Todavía no hay posts para mostrar."
            posts={[]}
          />
        }
        repostsSlot={
          <PostList emptyMessage="Todavía no hizo reposts." posts={[]} />
        }
      />
    </div>
  );
}
