import { and, eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { toggleLike } from '@/actions/posts';
import { auth } from '@/auth';
import { db } from '@/db';
import { postLikes, posts, users } from '@/db/schema';

describe('toggleLike integration', () => {
  let userId: string;
  let postId: string;

  beforeEach(async () => {
    const [user] = await db
      .insert(users)
      .values({
        email: `test-${crypto.randomUUID()}@example.com`,
        username: `testuser${Date.now()}`,
      })
      .returning({ id: users.id });

    if (!user) {
      throw new Error('Test user could not be created');
    }

    userId = user.id;

    const [post] = await db
      .insert(posts)
      .values({
        content: 'Contenido del post de prueba',
        idUser: userId,
        title: 'Post de prueba',
        type: 'article',
      })
      .returning({ id: posts.id });

    if (!post) {
      throw new Error('Test post could not be created');
    }

    postId = post.id;

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: userId,
      },
    } as never);
  });

  afterEach(async () => {
    await db.delete(posts).where(eq(posts.id, postId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('adds and removes a like when toggled twice', async () => {
    const firstResult = await toggleLike({ idPost: postId });

    expect(firstResult).toEqual({ liked: true });

    const firstLike = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.idPost, postId), eq(postLikes.idUser, userId)));

    expect(firstLike).toHaveLength(1);

    const secondResult = await toggleLike({ idPost: postId });

    expect(secondResult).toEqual({ liked: false });

    const secondLike = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.idPost, postId), eq(postLikes.idUser, userId)));

    expect(secondLike).toHaveLength(0);
  });
});
