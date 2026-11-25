import { asc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { comments, profiles, users } from '@/db/schema';

export interface CommentRow {
  author: {
    avatarUrl: string | null;
    username: string;
  };
  content: string;
  createdAt: Date;
  id: string;
  idParent: string | null;
}

export type CommentThread = CommentRow & {
  replies: CommentThread[];
};

export async function getCommentsByPost(
  idPost: string,
): Promise<CommentThread[]> {
  const rows = await db
    .select({
      avatarUrl: profiles.avatarUrl,
      content: comments.content,
      createdAt: comments.createdAt,
      id: comments.id,
      idParent: comments.idParent,
      username: users.username,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.idUser))
    .leftJoin(profiles, eq(profiles.id, users.id))
    .where(eq(comments.idPost, idPost))
    .orderBy(asc(comments.createdAt));

  const byId = new Map<string, CommentThread>();
  for (const row of rows) {
    byId.set(row.id, {
      author: {
        avatarUrl: row.avatarUrl,
        username: row.username,
      },
      content: row.content,
      createdAt: row.createdAt,
      id: row.id,
      idParent: row.idParent,
      replies: [],
    });
  }

  const threads: CommentThread[] = [];
  for (const row of rows) {
    const node = byId.get(row.id);
    if (!node) continue;

    if (row.idParent && byId.has(row.idParent)) {
      byId.get(row.idParent)?.replies.push(node);
    } else {
      threads.push(node);
    }
  }

  return threads;
}
