import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ExploreFilters } from '@/components/ExploreFilters';
import { ExploreSearch } from '@/components/ExploreSearch';
import { ExploreTagCard } from '@/components/ExploreTagCard';
import { ExploreUserCard } from '@/components/ExploreUserCard';
import { PostCard } from '@/components/PostCard';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { getFeedPosts } from '@/data/post';
import { getExploreUsersToFollow, searchExploreUsers } from '@/data/profile';
import {
  getFollowedTagIds,
  getTrendingTags,
  searchExploreTags,
} from '@/data/tag';
import { cn } from '@/lib/utils';
import type { PostType } from '@/types/post';
import { buildExploreSection } from '@/utils/build-explore-section';

interface ExplorePageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
}

function getPostType(value: string | undefined): PostType | undefined {
  if (value === 'snippet' || value === 'question' || value === 'article') {
    return value;
  }

  return undefined;
}

export default async function Explore({
  searchParams,
}: ExplorePageProps): Promise<JSX.Element> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id;
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const activeType = getPostType(params.type);
  const hasSearch = query.length > 0;
  const searchLimit = hasSearch ? 5 : 4;

  const [posts, searchedTags, searchedUsers] = await Promise.all([
    getFeedPosts({
      query,
      type: activeType,
      viewerId: userId,
    }),
    searchExploreTags(query, searchLimit),
    searchExploreUsers(query, userId, searchLimit),
  ]);

  const needsRecommendedTags = !hasSearch || searchedTags.length === 0;
  const needsRecommendedUsers = !hasSearch || searchedUsers.length === 0;

  const [recommendedTags, recommendedUsers] = await Promise.all([
    needsRecommendedTags ? getTrendingTags(4) : Promise.resolve([]),
    needsRecommendedUsers
      ? getExploreUsersToFollow(userId, 4)
      : Promise.resolve([]),
  ]);

  const tagsSection = buildExploreSection(
    searchedTags,
    recommendedTags,
    hasSearch,
    {
      found: 'TAGS ENCONTRADOS',
      notFound: 'TAG NO ENCONTRADO · TAGS RECOMENDADOS',
      recommended: 'TAGS PARA SEGUIR',
    },
  );

  const usersSection = buildExploreSection(
    searchedUsers,
    recommendedUsers,
    hasSearch,
    {
      found: 'USUARIOS ENCONTRADOS',
      notFound: 'USUARIO NO ENCONTRADO · USUARIOS RECOMENDADOS',
      recommended: 'USUARIOS PARA SEGUIR',
    },
  );

  const allTagIds = [...recommendedTags, ...searchedTags].map((tag) => tag.id);
  const followedTagIds = await getFollowedTagIds(userId, allTagIds);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-bold text-3xl text-[#171b22]">Explorar</h1>
      </header>

      <ExploreSearch />

      <ExploreFilters activeType={activeType} />

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-[#878992] text-[12px]">
          {tagsSection.title}
        </h2>

        <CardWrapper className="overflow-hidden p-0">
          <div className="grid auto-rows-37.5 grid-cols-2">
            {tagsSection.slots.map((tag, index) => {
              const cellClassName = cn(
                'border-[#dfe1e5] p-4',
                index % 2 === 0 && 'border-r',
                index < 2 && 'border-b',
              );

              return (
                <ExploreTagCard
                  cellClassName={cellClassName}
                  isFollowing={tag ? followedTagIds.has(tag.id) : false}
                  key={tag?.id ?? `empty-tag-${index}`}
                  tag={tag}
                />
              );
            })}
          </div>

          {tagsSection.hasMore && (
            <div className="flex justify-end border-[#dfe1e5] border-t p-3">
              <Link
                className="font-mono text-[#4265b3] text-xs hover:underline"
                href={`/explore/tags?q=${encodeURIComponent(query)}`}
              >
                ver más →
              </Link>
            </div>
          )}
        </CardWrapper>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-[#878992] text-[12px]">
          {usersSection.title}
        </h2>

        <CardWrapper className="overflow-hidden p-0">
          <ul className="grid auto-rows-40 grid-cols-2">
            {usersSection.slots.map((user, index) => {
              if (!user) {
                return (
                  <li
                    aria-hidden
                    className={cn(
                      'border-[#dfe1e5] p-4',
                      index % 2 === 0 && 'border-r',
                      index < 2 && 'border-b',
                    )}
                    key={`empty-user-${index}`}
                  />
                );
              }

              return (
                <ExploreUserCard
                  avatarUrl={user.avatarUrl}
                  bio={user.bio}
                  followersCount={user.followersCount}
                  id={user.id}
                  isFollowing={
                    'isFollowing' in user ? Boolean(user.isFollowing) : false
                  }
                  isLastRow={index >= 2}
                  isRightColumn={index % 2 === 1}
                  key={user.id}
                  username={user.username}
                />
              );
            })}
          </ul>

          {usersSection.hasMore && (
            <div className="flex justify-end border-[#dfe1e5] border-t p-3">
              <Link
                className="font-mono text-[#4265b3] text-xs hover:underline"
                href={`/explore/users?q=${encodeURIComponent(query)}`}
              >
                ver más →
              </Link>
            </div>
          )}
        </CardWrapper>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-mono text-[#7e8288] text-xs">
          RESULTADOS · {posts.length} PUBLICACIONES
        </h2>

        {posts.length === 0 ? (
          <p className="py-8 text-center font-mono text-[#878992] text-sm">
            No se encontraron publicaciones.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
