import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ConnectedReposCard } from '@/components/ConnectedReposCard';
import { GithubConnectButton } from '@/components/GithubConnectButton';
import { GithubConnectStatus } from '@/components/GithubConnectStatus';
import { InferredStackCard } from '@/components/InferredStackCard';
import { PostList } from '@/components/PostList';
import { ProfileHeader } from '@/components/ProfileHeader';
import { ProfileTabs } from '@/components/ProfileTabs';
import { getConnectedRepos, hasGitHubAccount } from '@/data/github';
import { getUserPosts, getUserReposts } from '@/data/post';
import { getUserProfileById } from '@/data/profile';
import { getInferredStack } from '@/data/stack';

export default async function Profile({
  searchParams,
}: PageProps<'/profile'>): Promise<JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const profile = await getUserProfileById(session.user.id);
  if (!profile) redirect('/login');

  const [stack, repos, isGitHubConnected, params, userPosts, userReposts] =
    await Promise.all([
      getInferredStack(profile.id),
      getConnectedRepos(profile.id),
      hasGitHubAccount(profile.id),
      searchParams,
      getUserPosts({ idUser: profile.id, viewerId: session.user.id }),
      getUserReposts({ idUser: profile.id, viewerId: session.user.id }),
    ]);

  const githubLinked = params.githubLinked === '1';
  const githubError =
    typeof params.githubError === 'string' ? params.githubError : undefined;

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader isOwnProfile profile={profile} />

      <GithubConnectStatus error={githubError} linked={githubLinked} />

      {!isGitHubConnected && <GithubConnectButton />}

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
            posts={userPosts}
          />
        }
        repostsSlot={
          <PostList
            emptyMessage="Todavía no hizo reposts."
            posts={userReposts}
          />
        }
      />
    </div>
  );
}
