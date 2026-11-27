import { eq, inArray } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createPost } from '@/actions/posts';
import { auth } from '@/auth';
import { db } from '@/db';
import { posts, postTags, tags, users } from '@/db/schema';

describe('createPost integration', () => {
  let userId: string;

  beforeEach(async () => {
    const [user] = await db
      .insert(users)
      .values({
        email: `test-${crypto.randomUUID()}@example.com`,
        username: `testuser${Date.now()}`,
      })
      .returning({ id: users.id });

    expect(user).toBeDefined();

    if (!user) return;

    userId = user.id;

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: userId,
      },
    } as never);
  });

  it('creates a post and associates normalized tags', async () => {
    const result = await createPost({
      content: 'Contenido del post de integración',
      tags: [' TypeScript ', 'Testing', 'typescript'],
      title: 'Post de integración',
      type: 'article',
    });

    expect('post' in result).toBe(true);

    if (!('post' in result)) return;

    const createdPost = result.post;

    expect(createdPost).toBeDefined();

    if (!createdPost) return;

    const [savedPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, createdPost.id));

    expect(savedPost).toMatchObject({
      content: 'Contenido del post de integración',
      idUser: userId,
      title: 'Post de integración',
      type: 'article',
    });

    const savedTags = await db
      .select({ label: tags.label })
      .from(postTags)
      .innerJoin(tags, eq(tags.id, postTags.idTag))
      .where(eq(postTags.idPost, createdPost.id));

    expect(savedTags.map((tag) => tag.label).sort()).toEqual([
      'testing',
      'typescript',
    ]);

    await db.delete(posts).where(eq(posts.id, createdPost.id));

    await db.delete(tags).where(inArray(tags.label, ['testing', 'typescript']));

    await db.delete(users).where(eq(users.id, userId));
  });
});
