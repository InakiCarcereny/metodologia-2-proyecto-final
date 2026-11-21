import { count, eq } from 'drizzle-orm';
import { db } from '@/db';
import { posts, profiles, users } from '@/db/schema';
import type { UserCardData } from '@/types/user';

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

    return {
      ...row,
      avatarUrl: row.avatarUrl,
    };
  } catch {
    return null;
  }
}
