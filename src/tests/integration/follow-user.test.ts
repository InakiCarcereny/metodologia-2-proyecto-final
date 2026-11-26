import { and, eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

import { followUser, unfollowUser } from '@/actions/follow';
import { auth } from '@/auth';
import { db } from '@/db';
import { followers, users } from '@/db/schema';

describe('followUser integration', () => {
  let followerId: string;
  let targetUserId: string;

  beforeEach(async () => {
    const [follower] = await db
      .insert(users)
      .values({
        email: `follower-${crypto.randomUUID()}@example.com`,
        username: `follower${Date.now()}`,
      })
      .returning({ id: users.id });

    if (!follower) {
      throw new Error('Follower user could not be created');
    }

    followerId = follower.id;

    const [targetUser] = await db
      .insert(users)
      .values({
        email: `target-${crypto.randomUUID()}@example.com`,
        username: `target${Date.now()}`,
      })
      .returning({ id: users.id });

    if (!targetUser) {
      throw new Error('Target user could not be created');
    }

    targetUserId = targetUser.id;

    vi.mocked(auth).mockResolvedValue({
      user: {
        id: followerId,
      },
    } as never);
  });

  afterEach(async () => {
    await db
      .delete(followers)
      .where(
        and(
          eq(followers.idFollower, followerId),
          eq(followers.idUser, targetUserId),
        ),
      );

    await db.delete(users).where(eq(users.id, followerId));
    await db.delete(users).where(eq(users.id, targetUserId));
  });

  it('follows and unfollows another user', async () => {
    const followResult = await followUser(targetUserId);

    expect(followResult).toEqual({ success: true });

    const savedFollow = await db
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.idFollower, followerId),
          eq(followers.idUser, targetUserId),
        ),
      );

    expect(savedFollow).toHaveLength(1);

    const unfollowResult = await unfollowUser(targetUserId);

    expect(unfollowResult).toEqual({ success: true });

    const removedFollow = await db
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.idFollower, followerId),
          eq(followers.idUser, targetUserId),
        ),
      );

    expect(removedFollow).toHaveLength(0);
  });

  it('does not allow a user to follow themselves', async () => {
    const result = await followUser(followerId);

    expect(result).toEqual({
      error: 'No podés seguirte a vos mismo',
    });

    const savedFollow = await db
      .select()
      .from(followers)
      .where(
        and(
          eq(followers.idFollower, followerId),
          eq(followers.idUser, followerId),
        ),
      );

    expect(savedFollow).toHaveLength(0);
  });

  it('rejects unauthenticated users', async () => {
    vi.mocked(auth).mockResolvedValue(null);

    const result = await followUser(targetUserId);

    expect(result).toEqual({
      error: 'No autenticado',
    });
  });
});
