import { and, count, desc, eq, inArray, or, type SQL } from 'drizzle-orm';
import { db } from '@/db';
import {
  bookmarks,
  comments,
  followers,
  postLikes,
  postShares,
  posts,
  type postTypes,
  profiles,
  users,
} from '@/db/schema';

export const FEED_PAGE_SIZE = 20;

export type FeedTab = 'for-you' | 'following';

export type FeedPost = {
  author: {
    avatarUrl: string | null;
    username: string;
  };
  codeFilename: string | null;
  codeLanguage: string | null;
  codeSnippet: string | null;
  content: string;
  createdAt: Date;
  id: string;
  stats: {
    comments: number;
    likes: number;
    reposts: number;
  };
  type: (typeof postTypes.enumValues)[number];
  viewer: {
    bookmarked: boolean;
    liked: boolean;
    reposted: boolean;
  };
};

export async function getFeedPosts({
  limit = FEED_PAGE_SIZE,
  offset = 0,
  tab = 'for-you',
  viewerId,
}: {
  limit?: number;
  offset?: number;
  tab?: FeedTab;
  viewerId?: string;
}): Promise<FeedPost[]> {
  let where: SQL | undefined;

  if (tab === 'following') {
    // the following tab makes no sense without a logged-in viewer
    if (!viewerId) return [];

    const followedIds = db
      .select({ id: followers.idUser })
      .from(followers)
      .where(eq(followers.idFollower, viewerId));

    // posts from people you follow, plus your own (like X does)
    where = or(eq(posts.idUser, viewerId), inArray(posts.idUser, followedIds));
  }

  const rows = await db
    .select({
      avatarUrl: profiles.avatarUrl,
      codeFilename: posts.codeFilename,
      codeLanguage: posts.codeLanguage,
      codeSnippet: posts.codeSnippet,
      content: posts.content,
      createdAt: posts.createdAt,
      id: posts.id,
      type: posts.type,
      username: users.username,
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .where(where)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  if (rows.length === 0) return [];

  const postIds = rows.map((row) => row.id);

  const [commentCounts, likeCounts, repostCounts] = await Promise.all([
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
  ]);

  const commentsById = new Map(
    commentCounts.map((row) => [row.idPost, row.total]),
  );
  const likesById = new Map(likeCounts.map((row) => [row.idPost, row.total]));
  const repostsById = new Map(
    repostCounts.map((row) => [row.idPost, row.total]),
  );

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
    content: row.content,
    createdAt: row.createdAt,
    id: row.id,
    stats: {
      comments: commentsById.get(row.id) ?? 0,
      likes: likesById.get(row.id) ?? 0,
      reposts: repostsById.get(row.id) ?? 0,
    },
    type: row.type,
    viewer: {
      bookmarked: bookmarkedIds.has(row.id),
      liked: likedIds.has(row.id),
      reposted: repostedIds.has(row.id),
    },
  }));
}
