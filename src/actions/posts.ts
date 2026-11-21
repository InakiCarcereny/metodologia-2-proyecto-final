'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { type CreatePostInput, createPostSchema } from '@/schemas/post';

export async function createPost(input: CreatePostInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { codeFilename, codeLanguage, codeSnippet, content, type } =
    parsed.data;

  const title = content.split('\n')[0].slice(0, 80) || type;

  try {
    const [post] = await db
      .insert(posts)
      .values({
        codeFilename: codeFilename ?? null,
        codeLanguage: codeLanguage ?? null,
        codeSnippet: codeSnippet ?? null,
        content,
        idUser: session.user.id,
        title,
        type,
      })
      .returning();

    revalidatePath('/home');

    return { post };
  } catch {
    return { error: 'No se pudo publicar el post' };
  }
}
