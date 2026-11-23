import { notFound } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { PostList } from '@/components/PostList';
import { TagHeader } from '@/components/TagHeader';
import { getTagCardByLabel, isFollowingTag } from '@/data/tag';

export default async function Tag({
  params,
}: PageProps<'/tags/[tag]'>): Promise<JSX.Element> {
  const { tag: label } = await params;

  const tag = await getTagCardByLabel(label);
  if (!tag) notFound();

  const session = await auth();
  const isFollowing = session?.user?.id
    ? await isFollowingTag(session.user.id, tag.id)
    : false;

  return (
    <div className="flex flex-col gap-6">
      <TagHeader
        isFollowing={isFollowing}
        isLoggedIn={Boolean(session?.user?.id)}
        tag={tag}
      />

      <PostList emptyMessage="Todavía no hay posts con este tag." posts={[]} />
    </div>
  );
}
