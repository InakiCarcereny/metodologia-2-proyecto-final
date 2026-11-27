import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  ne,
  notInArray,
  or,
  type SQL,
  sql,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '@/db';
import { followers, posts, profiles, users } from '@/db/schema';
import type {
  ExploreUserCardData,
  ExploreUserSuggestion,
  UserCardData,
  UserListItem,
  UserProfile,
} from '@/types/user';

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

export async function isFollowingUser(
  followerId: string,
  targetId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ idUser: followers.idUser })
    .from(followers)
    .where(
      and(eq(followers.idFollower, followerId), eq(followers.idUser, targetId)),
    )
    .limit(1);

  return Boolean(row);
}

async function getFollowingIds(idFollower: string): Promise<Set<string>> {
  const rows = await db
    .select({ idUser: followers.idUser })
    .from(followers)
    .where(eq(followers.idFollower, idFollower));

  return new Set(rows.map((row) => row.idUser));
}

async function getFollowerIds(idUser: string): Promise<Set<string>> {
  const rows = await db
    .select({ idFollower: followers.idFollower })
    .from(followers)
    .where(eq(followers.idUser, idUser));

  return new Set(rows.map((row) => row.idFollower));
}

function withViewerRelations(
  rows: Pick<UserListItem, 'avatarUrl' | 'bio' | 'id' | 'username'>[],
  viewerFollowingIds: Set<string>,
  viewerFollowerIds: Set<string>,
): UserListItem[] {
  return rows.map((row) => ({
    ...row,
    followsViewer: viewerFollowerIds.has(row.id),
    isFollowing: viewerFollowingIds.has(row.id),
  }));
}

export async function getFollowers(
  idUser: string,
  viewerId?: string,
): Promise<UserListItem[]> {
  try {
    const rows = await db
      .select({
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        id: users.id,
        username: users.username,
      })
      .from(followers)
      .innerJoin(users, eq(users.id, followers.idFollower))
      .leftJoin(profiles, eq(profiles.id, users.id))
      .where(eq(followers.idUser, idUser))
      .orderBy(desc(followers.createdAt));

    const [viewerFollowingIds, viewerFollowerIds] = viewerId
      ? await Promise.all([getFollowingIds(viewerId), getFollowerIds(viewerId)])
      : [new Set<string>(), new Set<string>()];

    return withViewerRelations(rows, viewerFollowingIds, viewerFollowerIds);
  } catch {
    return [];
  }
}

export async function getFollowing(
  idFollower: string,
  viewerId?: string,
): Promise<UserListItem[]> {
  try {
    const rows = await db
      .select({
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        id: users.id,
        username: users.username,
      })
      .from(followers)
      .innerJoin(users, eq(users.id, followers.idUser))
      .leftJoin(profiles, eq(profiles.id, users.id))
      .where(eq(followers.idFollower, idFollower))
      .orderBy(desc(followers.createdAt));

    const [viewerFollowingIds, viewerFollowerIds] = viewerId
      ? await Promise.all([getFollowingIds(viewerId), getFollowerIds(viewerId)])
      : [new Set<string>(), new Set<string>()];

    return withViewerRelations(rows, viewerFollowingIds, viewerFollowerIds);
  } catch {
    return [];
  }
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

    return {
      ...row,
      followersCount,
      followingCount,
      postsCount,
    };
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
      followersCount,
    };
  } catch {
    return null;
  }
}

export async function getSuggestedUserCards(
  currentUserId: string,
  limit = 3,
  randomOrder = true,
): Promise<UserCardData[]> {
  try {
    const order = randomOrder ? sql`RANDOM()` : desc(users.createdAt);

    const rows = await db
      .select({
        avatarUrl: profiles.avatarUrl,
        id: users.id,
        postsCount: count(posts.id).mapWith(Number),
        username: users.username,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.id, users.id))
      .leftJoin(posts, eq(posts.idUser, users.id))
      .where(
        and(
          ne(users.id, currentUserId),
          notInArray(
            users.id,
            db
              .select({ id: followers.idUser })
              .from(followers)
              .where(eq(followers.idFollower, currentUserId)),
          ),
        ),
      )
      .groupBy(users.id, profiles.avatarUrl, users.username)
      .orderBy(order)
      .limit(limit);

    const followersCounts = await Promise.all(
      rows.map((row) => countFollowers(row.id)),
    );

    return rows.map((row, index) => ({
      ...row,
      followersCount: followersCounts[index] ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function getExploreUsersToFollow(
  currentUserId: string,
  limit = 4,
): Promise<ExploreUserSuggestion[]> {
  try {
    return await db
      .select({
        avatarUrl: profiles.avatarUrl,
        bio: profiles.bio,
        followersCount: count(followers.idFollower).mapWith(Number),
        id: users.id,
        username: users.username,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.id, users.id))
      .leftJoin(followers, eq(followers.idUser, users.id))
      .where(
        and(
          ne(users.id, currentUserId),
          notInArray(
            users.id,
            db
              .select({ id: followers.idUser })
              .from(followers)
              .where(eq(followers.idFollower, currentUserId)),
          ),
        ),
      )
      .groupBy(
        users.id,
        users.username,
        users.createdAt,
        profiles.avatarUrl,
        profiles.bio,
      )
      .orderBy(desc(count(followers.idFollower)), desc(users.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function searchExploreUsers(
  query: string,
  currentUserId: string,
  limit = 4,
): Promise<ExploreUserCardData[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const searchPattern = `%${trimmedQuery}%`;
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
  } catch {
    return [];
  }
}
