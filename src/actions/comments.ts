'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { comments } from '@/db/schema';
import {
  type CreateCommentInput,
  createCommentSchema,
} from '@/schemas/comment';

export async function createComment(input: CreateCommentInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = createCommentSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors ?? {} };
  }

  const { content, idParent, idPost } = parsed.data;
  const idUser = session.user.id;

  try {
    const [comment] = await db
      .insert(comments)
      .values({ content, idParent: idParent ?? null, idPost, idUser })
      .returning();

    revalidatePath(`/posts/${idPost}`);
    revalidatePath('/home');

    return { comment };
  } catch {
    return { error: 'No se pudo publicar el comentario' };
  }
}
