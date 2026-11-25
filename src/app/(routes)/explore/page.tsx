import { redirect } from 'next/navigation';
import type { JSX } from 'react';
import { auth } from '@/auth';
import { ExploreSearch } from '@/components/ExploreSearch';
import { ExploreUserCard } from '@/components/ExploreUserCard';
import { PostCard } from '@/components/PostCard';
import { TagFollowButton } from '@/components/TagFollowButton';
import { CardWrapper } from '@/components/ui/CardWrapper';
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
  const activeType = getPostType(params.type);

  const [tags, users, posts] = await Promise.all([
    getTrendingTags(4),
    getExploreUsersToFollow(userId, 4),
    getFeedPosts({
      query: params.q,
      type: activeType,
      viewerId: userId,
    }),
  ]);

  const followedTagIds = new Set(
    (
      await Promise.all(
        tags.map(async (tag) => {
          const following = await isFollowingTag(userId, tag.id);
          return following ? tag.id : null;
        }),
      )
    ).filter((id): id is string => id !== null),
  );

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-bold text-3xl text-[#171b22]">Explorar</h1>
      </header>
      <ExploreSearch />
      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-[#878992] text-[12px]">
          TAGS PARA SEGUIR
        </h2>

        <CardWrapper>
          {tags.length === 0 ? (
            <p className="font-mono text-[#878992] text-sm">
              No hay tags disponibles.
            </p>
          ) : (
            <div className="grid grid-cols-2">
              {tags.map((tag) => (
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
        <h2 className="font-medium text-[#878992] text-[12px]">
          USUARIOS PARA SEGUIR
        </h2>

        <CardWrapper>
          {users.length === 0 ? (
            <p className="font-mono text-[#878992] text-sm">
              No hay usuarios disponibles.
            </p>
          ) : (
            <ul className="grid grid-cols-2">
              {users.map((user, index) => (
                <ExploreUserCard
                  avatarUrl={user.avatarUrl}
                  bio={user.bio}
                  followersCount={user.followersCount}
                  id={user.id}
                  isLastRow={index >= users.length - 2}
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
            No hay publicaciones para este filtro.
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
