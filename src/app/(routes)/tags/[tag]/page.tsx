import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { PostList } from '@/components/PostList';
import { TagHeader } from '@/components/TagHeader';
import { getTagCardByLabel, isFollowingTag } from '@/data/tag';
import { getPostsByTagLabel } from '@/db/queries/posts';

export default async function Tag({
  params,
}: PageProps<'/tags/[tag]'>): Promise<JSX.Element> {
  const { tag: label } = await params;

  const tag = await getTagCardByLabel(label);
  if (!tag) notFound();

  const session = await auth();

  const [posts, isFollowing] = await Promise.all([
    getPostsByTagLabel(tag.label, { viewerId: session?.user?.id }),
    session?.user?.id
      ? isFollowingTag(session.user.id, tag.id)
      : Promise.resolve(false),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <TagHeader
        isFollowing={isFollowing}
        isLoggedIn={Boolean(session?.user?.id)}
        tag={tag}
      />

      <PostList
        emptyMessage="Todavía no hay posts con este tag."
        posts={posts}
      />
    </div>
  );
}
