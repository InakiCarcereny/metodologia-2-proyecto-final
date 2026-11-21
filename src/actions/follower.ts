'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { followers } from '@/db/schema';
import { type FollowUserInput, followUserSchema } from '@/schemas/follower';

export async function newFollower(input: FollowUserInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = followUserSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const [follow] = await db
    .insert(followers)
    .values({ ...parsed.data, idFollower: session.user.id })
    .returning();

  revalidatePath('/');

  return { follow };
}

export async function deleteFollowe(input: FollowUserInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = followUserSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const { idUser } = parsed.data;

  await db
    .delete(followers)
    .where(
      and(
        eq(followers.idFollower, session.user.id),
        eq(followers.idUser, idUser),
      ),
    );

  revalidatePath('/');

  return { success: true };
}
