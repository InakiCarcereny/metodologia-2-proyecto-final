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
import { getExploreUsersToFollow } from '@/data/profile';
import { getTrendingTags, isFollowingTag } from '@/data/tag';
import { getFeedPosts } from '@/db/queries/posts';
import type { PostType } from '@/types/post';

interface ExplorePageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
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
    searchExploreTags(query),
    searchExploreUsers(query, userId),
  ]);

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

  const displayedTags =
    hasSearch && searchedTags.length > 0 ? searchedTags : recommendedTags;

  const displayedUsers =
    hasSearch && searchedUsers.length > 0 ? searchedUsers : recommendedUsers;

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

        <CardWrapper>
          {displayedTags.length === 0 ? (
            <p className="font-mono text-[#878992] text-sm">
              No hay tags disponibles.
            </p>
          ) : (
            <div className="grid grid-cols-2">
              {displayedTags.map((tag) => (
                <article
                  className="flex flex-col gap-3 border-[#dfe1e5] border-b p-4 first:border-r"
                  key={tag.id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-mono text-[#171b22] text-[15px]">
                      #{tag.label}
                    </h3>

                    <TagFollowButton
                      className="min-w-24 px-3 py-1 text-[13px]"
                      initialIsFollowing={followedTagIds.has(tag.id)}
                      tagId={tag.id}
                    />
                  </div>

                  {tag.description && (
                    <p className="text-[#494d56] text-sm">{tag.description}</p>
                  )}

                  <span className="font-mono text-[#7e8288] text-xs">
                    {tag.followersCount} seguidores · {tag.postsCount} posts
                  </span>
                </article>
              ))}
            </div>
          )}
        </CardWrapper>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-[#878992] text-[12px]">{usersTitle}</h2>

        <CardWrapper>
          {displayedUsers.length === 0 ? (
            <p className="font-mono text-[#878992] text-sm">
              No hay usuarios disponibles.
            </p>
          ) : (
            <ul className="grid grid-cols-2">
              {displayedUsers.map((user, index) => (
                <ExploreUserCard
                  avatarUrl={user.avatarUrl}
                  bio={user.bio}
                  followersCount={user.followersCount}
                  id={user.id}
                  isLastRow={index >= displayedUsers.length - 2}
                  isRightColumn={index % 2 === 1}
                  key={user.id}
                  username={user.username}
                />
              ))}
            </ul>
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
