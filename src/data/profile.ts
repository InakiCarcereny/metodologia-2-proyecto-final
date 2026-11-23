import { count, eq, type SQL } from 'drizzle-orm';
import { db } from '@/db';
import { followers, posts, profiles, users } from '@/db/schema';
import type { UserCardData, UserProfile } from '@/types/user';

async function countPostsByUser(idUser: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(posts)
    .where(eq(posts.idUser, idUser));

  return row?.value ?? 0;
}

async function countFollowers(idUser: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(followers)
    .where(eq(followers.idUser, idUser));

  return row?.value ?? 0;
}

async function countFollowing(idFollower: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(followers)
    .where(eq(followers.idFollower, idFollower));

  return row?.value ?? 0;
}

async function getUserProfile(
  where: SQL<unknown>,
): Promise<UserProfile | null> {
  try {
    const [row] = await db
      .select({
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        coverUrl: profiles.coverUrl,
        createdAt: users.createdAt,
        id: users.id,
        location: profiles.location,
        username: users.username,
        website: profiles.website,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.id, users.id))
      .where(where);

    if (!row) return null;

    const [postsCount, followersCount, followingCount] = await Promise.all([
      countPostsByUser(row.id),
      countFollowers(row.id),
      countFollowing(row.id),
    ]);

    return { ...row, followersCount, followingCount, postsCount };
  } catch {
    return null;
  }
}

export function getUserProfileById(id: string): Promise<UserProfile | null> {
  return getUserProfile(eq(users.id, id));
}

export function getUserProfileByUsername(
  username: string,
): Promise<UserProfile | null> {
  return getUserProfile(eq(users.username, username));
}

export async function getUserCardDataById(
  id: string,
): Promise<UserCardData | null> {
  try {
    const [row] = await db
      .select({
        avatarUrl: profiles.avatarUrl,
        id: users.id,
        postsCount: count(posts.id).mapWith(Number),
        username: users.username,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.id, users.id))
      .leftJoin(posts, eq(posts.idUser, users.id))
      .where(eq(users.id, id))
      .groupBy(users.id, profiles.avatarUrl, users.username);

    if (!row) return null;

    const followersCount = await countFollowers(row.id);

    return {
      ...row,
      avatarUrl: row.avatarUrl,
      followersCount,
    };
  } catch {
    return null;
  }
}
