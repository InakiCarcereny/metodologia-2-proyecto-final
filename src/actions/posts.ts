'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/db';
import {
  bookmarks,
  postLikes,
  postShares,
  posts,
  postTags,
  tags,
} from '@/db/schema';
import {
  type CreatePostInput,
  createPostSchema,
  type PostInteractionInput,
  postInteractionSchema,
} from '@/schemas/post';

export async function createPost(input: CreatePostInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors ?? {} };
  }

  const {
    codeFilename,
    codeLanguage,
    codeSnippet,
    content,
    imageUrl,
    tags: tagLabels,
    title,
    type,
  } = parsed.data;

  const idUser = session.user.id;

  try {
    const post = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(posts)
        .values({
          codeFilename: codeFilename ?? null,
          codeLanguage: codeLanguage ?? null,
          codeSnippet: codeSnippet ?? null,
          content,
          idUser,
          imageUrl: imageUrl ?? null,
          title,
          type,
        })
        .returning();

      const normalizedLabels = [
        ...new Set(
          (tagLabels ?? [])
            .map((label) => label.trim().toLowerCase())
            .filter((label) => label.length > 0),
        ),
      ];

      if (normalizedLabels.length > 0) {
        await tx
          .insert(tags)
          .values(normalizedLabels.map((label) => ({ label })))
          .onConflictDoNothing();

        const tagRows = await tx
          .select({ id: tags.id })
          .from(tags)
          .where(inArray(tags.label, normalizedLabels));

        if (tagRows.length > 0) {
          await tx
            .insert(postTags)
            .values(
              tagRows.map((tag) => ({ idPost: created.id, idTag: tag.id })),
            )
            .onConflictDoNothing();
        }
      }

      return created;
    });

    revalidatePath('/home');

    return { post };
  } catch {
    return { error: 'No se pudo publicar el post' };
  }
}

export async function toggleLike(input: PostInteractionInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = postInteractionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'ID de post inválido' };
  }

  const { idPost } = parsed.data;
  const idUser = session.user.id;

  try {
    const inserted = await db
      .insert(postLikes)
      .values({ idPost, idUser })
      .onConflictDoNothing()
      .returning();

    let liked = true;

    if (inserted.length === 0) {
      await db
        .delete(postLikes)
        .where(and(eq(postLikes.idPost, idPost), eq(postLikes.idUser, idUser)));
      liked = false;
    }

    revalidatePath('/home');
    return { liked };
  } catch {
    return { error: 'No se pudo procesar el like' };
  }
}

export async function toggleBookmark(input: PostInteractionInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = postInteractionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'ID de post inválido' };
  }

  const { idPost } = parsed.data;
  const idUser = session.user.id;

  try {
    const inserted = await db
      .insert(bookmarks)
      .values({ idPost, idUser })
      .onConflictDoNothing()
      .returning();

    let bookmarked = true;

    if (inserted.length === 0) {
      await db
        .delete(bookmarks)
        .where(and(eq(bookmarks.idPost, idPost), eq(bookmarks.idUser, idUser)));
      bookmarked = false;
    }

    revalidatePath('/home');
    return { bookmarked };
  } catch {
    return { error: 'No se pudo guardar el post' };
  }
}

export async function repostPost(input: PostInteractionInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = postInteractionSchema.safeParse(input);

  if (!parsed.success) {
    return { error: 'ID de post inválido' };
  }

  const { idPost } = parsed.data;
  const idUser = session.user.id;

  try {
    const inserted = await db
      .insert(postShares)
      .values({ idPost, idUser })
      .onConflictDoNothing()
      .returning();

    let reposted = true;

    if (inserted.length === 0) {
      await db
        .delete(postShares)
        .where(
          and(eq(postShares.idPost, idPost), eq(postShares.idUser, idUser)),
        );
      reposted = false;
    }

    revalidatePath('/home');
    return { reposted };
  } catch {
    return { error: 'No se pudo repostear' };
  }
}
