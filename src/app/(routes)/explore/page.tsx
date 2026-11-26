import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ExploreFilters } from '@/components/ExploreFilters';
import { ExploreSearch } from '@/components/ExploreSearch';
import { ExploreUserCard } from '@/components/ExploreUserCard';
import { PostCard } from '@/components/PostCard';
import { TagFollowButton } from '@/components/TagFollowButton';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { searchExploreTags, searchExploreUsers } from '@/data/explore';
import { getFeedPosts } from '@/data/post';
import { getExploreUsersToFollow } from '@/data/profile';
import { getTrendingTags, isFollowingTag } from '@/data/tag';
import { cn } from '@/lib/utils';
import type { PostType } from '@/types/post';

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

  const [
    recommendedTags,
    recommendedUsers,
    posts,
    searchedTags,
    searchedUsers,
  ] = await Promise.all([
    getTrendingTags(4),
    getExploreUsersToFollow(userId, 4),
    getFeedPosts({
      query,
      type: activeType,
      viewerId: userId,
    }),
    searchExploreTags(query, searchLimit),
    searchExploreUsers(query, userId, searchLimit),
  ]);

  const displayedTags =
    hasSearch && searchedTags.length > 0
      ? searchedTags.slice(0, 4)
      : recommendedTags.slice(0, 4);

  const displayedUsers =
    hasSearch && searchedUsers.length > 0
      ? searchedUsers.slice(0, 4)
      : recommendedUsers.slice(0, 4);

  const tagSlots = Array.from(
    { length: 4 },
    (_, index) => displayedTags[index] ?? null,
  );

  const userSlots = Array.from(
    { length: 4 },
    (_, index) => displayedUsers[index] ?? null,
  );

  const allTags = [...recommendedTags, ...searchedTags];

  const followedTagIds = new Set(
    (
      await Promise.all(
        allTags.map(async (tag) => {
          const following = await isFollowingTag(userId, tag.id);
          return following ? tag.id : null;
        }),
      )
    ).filter((id): id is string => id !== null),
  );

  const hasMoreTags = hasSearch && searchedTags.length > 4;
  const hasMoreUsers = hasSearch && searchedUsers.length > 4;

  const tagsTitle = !hasSearch
    ? 'TAGS PARA SEGUIR'
    : searchedTags.length > 0
      ? 'TAGS ENCONTRADOS'
      : 'TAG NO ENCONTRADO · TAGS RECOMENDADOS';

  const usersTitle = !hasSearch
    ? 'USUARIOS PARA SEGUIR'
    : searchedUsers.length > 0
      ? 'USUARIOS ENCONTRADOS'
      : 'USUARIO NO ENCONTRADO · USUARIOS RECOMENDADOS';

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-bold text-3xl text-[#171b22]">Explorar</h1>
      </header>

      <ExploreSearch />

      <ExploreFilters activeType={activeType} />

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-[#878992] text-[12px]">{tagsTitle}</h2>

        <CardWrapper className="overflow-hidden p-0">
          <div className="grid auto-rows-[110px] grid-cols-2">
            {tagSlots.map((tag, index) => {
              const cellClassName = cn(
                'border-[#dfe1e5] p-4',
                index % 2 === 0 && 'border-r',
                index < 2 && 'border-b',
              );

              if (!tag) {
                return (
                  <div
                    aria-hidden
                    className={cellClassName}
                    key={`empty-tag-${index}`}
                  />
                );
              }

              return (
                <article
                  className={cn(
                    'relative flex flex-col gap-3 transition-colors hover:bg-[#fafafa]',
                    cellClassName,
                  )}
                  key={tag.id}
                >
                  <Link
                    aria-label={`Ver publicaciones con el tag ${tag.label}`}
                    className="absolute inset-0 z-0 rounded-lg"
                    href={`/tags/${encodeURIComponent(tag.label)}`}
                  />

                  <div className="pointer-events-none relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-mono text-[#171b22] text-[15px]">
                        #{tag.label}
                      </h3>

                      <div className="pointer-events-auto">
                        <TagFollowButton
                          className="min-w-24 px-3 py-1 text-[13px]"
                          initialIsFollowing={followedTagIds.has(tag.id)}
                          tagId={tag.id}
                        />
                      </div>
                    </div>

                    {tag.description && (
                      <p className="text-[#494d56] text-sm">
                        {tag.description}
                      </p>
                    )}

                    <span className="font-mono text-[#7e8288] text-xs">
                      {tag.followersCount} seguidores · {tag.postsCount} posts
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {hasMoreTags && (
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
        <h2 className="font-medium text-[#878992] text-[12px]">{usersTitle}</h2>

        <CardWrapper className="overflow-hidden p-0">
          <ul className="grid auto-rows-[160px] grid-cols-2">
            {userSlots.map((user, index) => {
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

          {hasMoreUsers && (
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
