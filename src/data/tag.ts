import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  inArray,
} from 'drizzle-orm';
import { db } from '@/db';
import { postTags, tags, userTagFollows } from '@/db/schema';
import type { Tag, TagCardData } from '@/types/tag';

export async function countTagFollowers(idTag: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(userTagFollows)
    .where(eq(userTagFollows.idTag, idTag));

  return row?.value ?? 0;
}

export async function countTagPosts(idTag: string): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(postTags)
    .where(eq(postTags.idTag, idTag));

  return row?.value ?? 0;
}

export async function isFollowingTag(
  userId: string,
  tagId: string,
): Promise<boolean> {
  const [row] = await db
    .select({ idTag: userTagFollows.idTag })
    .from(userTagFollows)
    .where(
      and(eq(userTagFollows.idUser, userId), eq(userTagFollows.idTag, tagId)),
    )
    .limit(1);

  return Boolean(row);
}

export async function getFollowedTagIds(
  userId: string,
  tagIds: string[],
): Promise<Set<string>> {
  if (tagIds.length === 0) return new Set();

  try {
    const rows = await db
      .select({ idTag: userTagFollows.idTag })
      .from(userTagFollows)
      .where(
        and(
          eq(userTagFollows.idUser, userId),
          inArray(userTagFollows.idTag, tagIds),
        ),
      );

    return new Set(rows.map((row) => row.idTag));
  } catch {
    return new Set();
  }
}

export async function getTagByLabel(label: string): Promise<Tag | null> {
  try {
    const [tag] = await db.select().from(tags).where(eq(tags.label, label));

    return tag ?? null;
  } catch {
    return null;
  }
}

export async function getTagCardByLabel(
  label: string,
): Promise<TagCardData | null> {
  try {
    const tag = await getTagByLabel(label);
    if (!tag) return null;

    const [followersCount, postsCount] = await Promise.all([
      countTagFollowers(tag.id),
      countTagPosts(tag.id),
    ]);

    return {
      description: tag.description,
      followersCount,
      id: tag.id,
      label: tag.label,
      postsCount,
    };
  } catch {
    return null;
  }
}

export async function getFollowedTagsByUser(
  userId: string,
): Promise<TagCardData[]> {
  try {
    const rows = await db
      .select({
        description: tags.description,
        id: tags.id,
        label: tags.label,
      })
      .from(userTagFollows)
      .innerJoin(tags, eq(tags.id, userTagFollows.idTag))
      .where(eq(userTagFollows.idUser, userId))
      .orderBy(desc(userTagFollows.followedAt));

    const followersCounts = await Promise.all(
      rows.map((row) => countTagFollowers(row.id)),
    );

    return rows.map((row, i) => ({
      ...row,
      followersCount: followersCounts[i] ?? 0,
      postsCount: 0,
    }));
  } catch {
    return [];
  }
}

export async function getTrendingTags(limit = 5): Promise<TagCardData[]> {
  try {
    const rows = await db
      .select({
        description: tags.description,
        followersCount: count(userTagFollows.idUser).mapWith(Number),
        id: tags.id,
        label: tags.label,
      })
      .from(tags)
      .leftJoin(userTagFollows, eq(userTagFollows.idTag, tags.id))
      .groupBy(tags.id, tags.label)
      .orderBy(desc(count(userTagFollows.idUser)))
      .limit(limit);

    return rows.map((row) => ({ ...row, postsCount: 0 }));
  } catch {
    return [];
  }
}

export async function searchExploreTags(
  query: string,
  limit = 4,
): Promise<TagCardData[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  try {
    const searchPattern = `%${trimmedQuery}%`;

    return await db
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
  } catch {
    return [];
  }
}
