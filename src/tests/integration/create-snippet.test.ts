import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { createPost } from '@/actions/posts';
import { auth } from '@/auth';
import { db } from '@/db';
import { posts, users } from '@/db/schema';

describe('createPost snippet integration', () => {
  let userId: string;
  let createdPostId: string | undefined;

  beforeEach(async () => {
    const [user] = await db
      .insert(users)
      .values({
        email: `snippet-${crypto.randomUUID()}@example.com`,
        username: `snippetuser${Date.now()}`,
      })
      .returning({ id: users.id });

    if (!user) {
      throw new Error('Test user could not be created');
    }

    userId = user.id;

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: userId,
      },
    } as never);
  });

  afterEach(async () => {
    if (createdPostId) {
      await db.delete(posts).where(eq(posts.id, createdPostId));
    }

    await db.delete(users).where(eq(users.id, userId));
  });

  it('persists a valid snippet with its code and language', async () => {
    const result = await createPost({
      codeLanguage: 'typescript',
      codeSnippet: 'const value = 42;',
      content: 'Contenido del snippet',
      title: 'Snippet de integración',
      type: 'snippet',
    });

    expect('post' in result).toBe(true);

    if (!('post' in result) || !result.post) {
      throw new Error('The post was not created');
    }

    createdPostId = result.post.id;

    const [savedPost] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, createdPostId));

    expect(savedPost).toMatchObject({
      codeLanguage: 'typescript',
      codeSnippet: 'const value = 42;',
      content: 'Contenido del snippet',
      idUser: userId,
      title: 'Snippet de integración',
      type: 'snippet',
    });
  });
});
