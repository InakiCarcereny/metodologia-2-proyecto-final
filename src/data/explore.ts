import { and, countDistinct, desc, eq, ilike, ne, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '@/db';
import {
  followers,
  postTags,
  profiles,
  tags,
  users,
  userTagFollows,
} from '@/db/schema';
import type { TagCardData } from '@/types/tag';

export interface ExploreUserResult {
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  id: string;
  isFollowing: boolean;
  username: string;
}

export async function searchExploreUsers(
  query: string,
  currentUserId: string,
  limit = 4,
): Promise<ExploreUserResult[]> {
  const searchPattern = `%${query.trim()}%`;

  if (!query.trim()) return [];

  const following = alias(followers, 'following');

  const rows = await db
    .select({
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
      followersCount: countDistinct(followers.idFollower).mapWith(Number),
      followingId: following.idUser,
      id: users.id,
      username: users.username,
    })
    .from(users)
    .leftJoin(profiles, eq(profiles.id, users.id))
    .leftJoin(followers, eq(followers.idUser, users.id))
    .leftJoin(
      following,
      and(
        eq(following.idFollower, currentUserId),
        eq(following.idUser, users.id),
      ),
    )
    .where(
      and(
        ne(users.id, currentUserId),
        or(
          ilike(users.username, searchPattern),
          ilike(profiles.bio, searchPattern),
        ),
      ),
    )
    .groupBy(
      users.id,
      users.username,
      users.createdAt,
      profiles.avatarUrl,
      profiles.bio,
      following.idUser,
    )
    .orderBy(desc(countDistinct(followers.idFollower)))
    .limit(limit);

  return rows.map(({ followingId, ...user }) => ({
    ...user,
    isFollowing: Boolean(followingId),
  }));
}

export async function searchExploreTags(
  query: string,
  limit = 4,
): Promise<TagCardData[]> {
  const searchPattern = `%${query.trim()}%`;

  if (!query.trim()) return [];

  return db
    .select({
      description: tags.description,
      followersCount: countDistinct(userTagFollows.idUser).mapWith(Number),
      id: tags.id,
      label: tags.label,
      postsCount: countDistinct(postTags.idPost).mapWith(Number),
    })
    .from(tags)
    .leftJoin(userTagFollows, eq(userTagFollows.idTag, tags.id))
    .leftJoin(postTags, eq(postTags.idTag, tags.id))
    .where(ilike(tags.label, searchPattern))
    .groupBy(tags.id, tags.label, tags.description)
    .orderBy(desc(countDistinct(postTags.idPost)))
    .limit(limit);
}
