import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  type SQL,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { db } from '@/db';
import {
  bookmarks,
  comments,
  followers,
  postLikes,
  postShares,
  posts,
  postTags,
  profiles,
  tags,
  users,
} from '@/db/schema';
import type { Post, PostType } from '@/types/post';
import type { Tag } from '@/types/tag';

export const FEED_PAGE_SIZE = 20;

export type FeedTab = 'for-you' | 'following';

export type BookmarkFilter = 'all' | PostType;

const POST_COLUMNS = {
  avatarUrl: profiles.avatarUrl,
  codeFilename: posts.codeFilename,
  codeLanguage: posts.codeLanguage,
  codeSnippet: posts.codeSnippet,
  content: posts.content,
  createdAt: posts.createdAt,
  id: posts.id,
  idUser: posts.idUser,
  imageUrl: posts.imageUrl,
  title: posts.title,
  type: posts.type,
  username: users.username,
};

interface PostRow {
  avatarUrl: string | null;
  codeFilename: string | null;
  codeLanguage: string | null;
  codeSnippet: string | null;
  content: string;
  createdAt: Date;
  id: string;
  idUser: string | null;
  imageUrl: string | null;
  repostedBy?: string | null;
  title: string;
  type: PostType;
  username: string;
}

async function buildPosts(rows: PostRow[], viewerId?: string): Promise<Post[]> {
  if (rows.length === 0) return [];

  const postIds = rows.map((row) => row.id);

  const [commentCounts, likeCounts, repostCounts, tagRows] = await Promise.all([
    db
      .select({ idPost: comments.idPost, total: count() })
      .from(comments)
      .where(inArray(comments.idPost, postIds))
      .groupBy(comments.idPost),
    db
      .select({ idPost: postLikes.idPost, total: count() })
      .from(postLikes)
      .where(inArray(postLikes.idPost, postIds))
      .groupBy(postLikes.idPost),
    db
      .select({ idPost: postShares.idPost, total: count() })
      .from(postShares)
      .where(inArray(postShares.idPost, postIds))
      .groupBy(postShares.idPost),
    db
      .select({ id: tags.id, idPost: postTags.idPost, label: tags.label })
      .from(postTags)
      .innerJoin(tags, eq(tags.id, postTags.idTag))
      .where(inArray(postTags.idPost, postIds)),
  ]);

  const commentsById = new Map(
    commentCounts.map((row) => [row.idPost, row.total]),
  );

  const likesById = new Map(likeCounts.map((row) => [row.idPost, row.total]));

  const repostsById = new Map(
    repostCounts.map((row) => [row.idPost, row.total]),
  );

  const tagsByPost = new Map<string, Pick<Tag, 'id' | 'label'>[]>();

  for (const row of tagRows) {
    const current = tagsByPost.get(row.idPost) ?? [];
    current.push({ id: row.id, label: row.label });
    tagsByPost.set(row.idPost, current);
  }

  let likedIds = new Set<string>();
  let bookmarkedIds = new Set<string>();
  let repostedIds = new Set<string>();

  if (viewerId) {
    const [likedRows, bookmarkedRows, repostedRows] = await Promise.all([
      db
        .select({ idPost: postLikes.idPost })
        .from(postLikes)
        .where(
          and(
            eq(postLikes.idUser, viewerId),
            inArray(postLikes.idPost, postIds),
          ),
        ),
      db
        .select({ idPost: bookmarks.idPost })
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.idUser, viewerId),
            inArray(bookmarks.idPost, postIds),
          ),
        ),
      db
        .select({ idPost: postShares.idPost })
        .from(postShares)
        .where(
          and(
            eq(postShares.idUser, viewerId),
            inArray(postShares.idPost, postIds),
          ),
        ),
    ]);

    likedIds = new Set(likedRows.map((row) => row.idPost));
    bookmarkedIds = new Set(bookmarkedRows.map((row) => row.idPost));
    repostedIds = new Set(repostedRows.map((row) => row.idPost));
  }

  return rows.map((row) => ({
    author: {
      avatarUrl: row.avatarUrl,
      username: row.username,
    },
    codeFilename: row.codeFilename,
    codeLanguage: row.codeLanguage,
    codeSnippet: row.codeSnippet,
    commentsCount: commentsById.get(row.id) ?? 0,
    content: row.content,
    createdAt: row.createdAt,
    id: row.id,
    imageUrl: row.imageUrl,
    isOwnPost: viewerId === row.idUser,
    likesCount: likesById.get(row.id) ?? 0,
    sharesCount: repostsById.get(row.id) ?? 0,
    tags: tagsByPost.get(row.id) ?? [],
    title: row.title,
    type: row.type,
    viewer: {
      bookmarked: bookmarkedIds.has(row.id),
      liked: likedIds.has(row.id),
      reposted: repostedIds.has(row.id),
    },
    ...(row.repostedBy ? { repostedBy: row.repostedBy } : {}),
  }));
}

export async function getFeedPosts({
  limit = FEED_PAGE_SIZE,
  offset = 0,
  query,
  tab = 'for-you',
  type,
  viewerId,
}: {
  limit?: number;
  offset?: number;
  query?: string;
  tab?: FeedTab;
  type?: PostType;
  viewerId?: string;
}): Promise<Post[]> {
  const conditions: SQL[] = [];

  if (tab === 'following') {
    if (!viewerId) return [];

    const followedIds = db
      .select({ id: followers.idUser })
      .from(followers)
      .where(eq(followers.idFollower, viewerId));

    const followingCondition = or(
      eq(posts.idUser, viewerId),
      inArray(posts.idUser, followedIds),
    );

    if (followingCondition) {
      conditions.push(followingCondition);
    }
  }

  if (type) {
    conditions.push(eq(posts.type, type));
  }

  if (query?.trim()) {
    const searchPattern = `%${query.trim()}%`;

    const searchCondition = or(
      ilike(posts.title, searchPattern),
      ilike(posts.content, searchPattern),
      ilike(users.username, searchPattern),
    );

    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select(POST_COLUMNS)
    .from(posts)
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .where(where)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return buildPosts(rows, viewerId);
}

export async function getUserPosts({
  idUser,
  limit = FEED_PAGE_SIZE,
  viewerId,
}: {
  idUser: string;
  limit?: number;
  viewerId?: string;
}): Promise<Post[]> {
  const rows = await db
    .select(POST_COLUMNS)
    .from(posts)
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .where(eq(posts.idUser, idUser))
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  return buildPosts(rows, viewerId);
}

export async function getUserReposts({
  idUser,
  limit = FEED_PAGE_SIZE,
  viewerId,
}: {
  idUser: string;
  limit?: number;
  viewerId?: string;
}): Promise<Post[]> {
  const sharer = alias(users, 'sharer');

  const rows = await db
    .select({ ...POST_COLUMNS, repostedBy: sharer.username })
    .from(postShares)
    .innerJoin(posts, eq(posts.id, postShares.idPost))
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .innerJoin(sharer, eq(sharer.id, postShares.idUser))
    .where(eq(postShares.idUser, idUser))
    .orderBy(desc(postShares.createdAt))
    .limit(limit);

  return buildPosts(rows, viewerId);
}

export async function getPostsByTagLabel(
  label: string,
  {
    limit = FEED_PAGE_SIZE,
    viewerId,
  }: {
    limit?: number;
    viewerId?: string;
  } = {},
): Promise<Post[]> {
  const normalized = label.trim().toLowerCase();

  const rows = await db
    .select(POST_COLUMNS)
    .from(posts)
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .innerJoin(postTags, eq(postTags.idPost, posts.id))
    .innerJoin(tags, eq(tags.id, postTags.idTag))
    .where(eq(tags.label, normalized))
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  return buildPosts(rows, viewerId);
}

export async function getPostById(
  id: string,
  { viewerId }: { viewerId?: string } = {},
): Promise<Post | null> {
  const rows = await db
    .select(POST_COLUMNS)
    .from(posts)
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  const [post] = await buildPosts(rows, viewerId);

  return post ?? null;
}

export async function getBookmarkedPosts({
  idUser,
  limit = FEED_PAGE_SIZE,
  offset = 0,
  type,
}: {
  idUser: string;
  limit?: number;
  offset?: number;
  type?: PostType;
}): Promise<Post[]> {
  const where = type
    ? and(eq(bookmarks.idUser, idUser), eq(posts.type, type))
    : eq(bookmarks.idUser, idUser);

  const rows = await db
    .select(POST_COLUMNS)
    .from(bookmarks)
    .innerJoin(posts, eq(posts.id, bookmarks.idPost))
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .where(where)
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit)
    .offset(offset);

  return buildPosts(rows, idUser);
}

export async function getBookmarkCounts(
  idUser: string,
): Promise<Record<BookmarkFilter, number>> {
  const rows = await db
    .select({ total: count(), type: posts.type })
    .from(bookmarks)
    .innerJoin(posts, eq(posts.id, bookmarks.idPost))
    .where(eq(bookmarks.idUser, idUser))
    .groupBy(posts.type);

  const counts: Record<BookmarkFilter, number> = {
    all: 0,
    article: 0,
    question: 0,
    snippet: 0,
  };

  for (const row of rows) {
    counts[row.type] = row.total;
    counts.all += row.total;
  }

  return counts;
}
