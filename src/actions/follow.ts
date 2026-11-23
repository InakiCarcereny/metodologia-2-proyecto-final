'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { followers } from '@/db/schema';

interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function followUser(targetUserId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  if (session.user.id === targetUserId) {
    return { error: 'No podés seguirte a vos mismo' };
  }

  await db
    .insert(followers)
    .values({ idFollower: session.user.id, idUser: targetUserId })
    .onConflictDoNothing();

  revalidatePath('/home');

  return { success: true };
}

export async function unfollowUser(
  targetUserId: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  await db
    .delete(followers)
    .where(
      and(
        eq(followers.idFollower, session.user.id),
        eq(followers.idUser, targetUserId),
      ),
    );

  revalidatePath('/home');

  return { success: true };
}
