import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { TagFollowButton } from '@/components/TagFollowButton';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { getFollowedTagIds, searchExploreTags } from '@/data/tag';

interface ExploreTagsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ExploreTags({
  searchParams,
}: ExploreTagsPageProps): Promise<JSX.Element> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const tags = await searchExploreTags(query, 20);
  const followedTagIds = await getFollowedTagIds(
    session.user.id,
    tags.map((tag) => tag.id),
  );

  return (
    <div className="flex flex-col gap-5">
      <Link
        className="w-fit font-mono text-[#7e8288] text-sm hover:text-[#171b22]"
        href="/explore"
      >
        ← volver a explorar
      </Link>

      <h1 className="font-bold text-2xl text-[#171b22]">
        Resultados de búsqueda: {query}
      </h1>

      <CardWrapper className="p-0">
        {tags.length === 0 ? (
          <p className="py-6 text-center font-mono text-[#878992] text-sm">
            No se encontraron tags.
          </p>
        ) : (
          <ul className="flex flex-col">
            {tags.map((tag) => (
              <li
                className="flex items-center justify-between gap-4 border-[#dfe1e5] border-b p-4 last:border-b-0"
                key={tag.id}
              >
                <Link
                  className="flex min-w-0 flex-1 flex-col gap-2"
                  href={`/tags/${encodeURIComponent(tag.label)}`}
                >
                  <span className="font-mono text-[#171b22] text-[15px]">
                    #{tag.label}
                  </span>

                  {tag.description && (
                    <span className="text-[#494d56] text-sm">
                      {tag.description}
                    </span>
                  )}

                  <span className="font-mono text-[#7e8288] text-xs">
                    {tag.followersCount} seguidores · {tag.postsCount} posts
                  </span>
                </Link>

                <TagFollowButton
                  className="min-w-24 px-3 py-1 text-[13px]"
                  initialIsFollowing={followedTagIds.has(tag.id)}
                  tagId={tag.id}
                />
              </li>
            ))}
          </ul>
        )}
      </CardWrapper>
    </div>
  );
}
