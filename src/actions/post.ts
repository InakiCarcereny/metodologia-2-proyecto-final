'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { posts } from '@/db/schema';
import {
  type CreatePostInput,
  createPostSchema,
  type UpdatePostInput,
  updatePostSchema,
} from '@/schemas/post';

export async function createPost(input: CreatePostInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const [post] = await db
    .insert(posts)
    .values({ ...parsed.data, idUser: session.user.id })
    .returning();

  revalidatePath('/');

  return { post };
}

export async function updatePost(id: string, input: UpdatePostInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = updatePostSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const [existing] = await db
    .select({ idUser: posts.idUser })
    .from(posts)
    .where(eq(posts.id, id));

  if (!existing) {
    return { error: 'Post no encontrado' };
  }

  if (existing.idUser !== session.user.id) {
    return { error: 'No autorizado' };
  }

  const [post] = await db
    .update(posts)
    .set(parsed.data)
    .where(eq(posts.id, id))
    .returning();

  revalidatePath('/');

  return { post };
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const [existing] = await db
    .select({ idUser: posts.idUser })
    .from(posts)
    .where(eq(posts.id, id));

  if (!existing) {
    return { error: 'Post no encontrado' };
  }

  if (existing.idUser !== session.user.id) {
    return { error: 'No autorizado' };
  }

  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath('/');

  return { success: true };
}
