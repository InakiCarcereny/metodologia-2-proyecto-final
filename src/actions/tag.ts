'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { userTagFollows } from '@/db/schema';

interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function followTag(tagId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  await db
    .insert(userTagFollows)
    .values({ idTag: tagId, idUser: session.user.id })
    .onConflictDoNothing();

  revalidatePath('/', 'layout');

  return { success: true };
}

export async function unfollowTag(tagId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  await db
    .delete(userTagFollows)
    .where(
      and(
        eq(userTagFollows.idUser, session.user.id),
        eq(userTagFollows.idTag, tagId),
      ),
    );

  revalidatePath('/', 'layout');

  return { success: true };
}
