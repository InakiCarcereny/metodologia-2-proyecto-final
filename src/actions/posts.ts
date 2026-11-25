'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { FEED_PAGE_SIZE, type FeedTab, getFeedPosts } from '@/data/post';
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
import type { Post } from '@/types/post';

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

type InteractionTable = typeof bookmarks | typeof postLikes | typeof postShares;

async function toggleInteraction({
  errorMessage,
  input,
  table,
}: {
  errorMessage: string;
  input: PostInteractionInput;
  table: InteractionTable;
}): Promise<{ active: boolean } | { error: string }> {
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
      .insert(table)
      .values({ idPost, idUser })
      .onConflictDoNothing()
      .returning();

    let active = true;

    if (inserted.length === 0) {
      await db
        .delete(table)
        .where(and(eq(table.idPost, idPost), eq(table.idUser, idUser)));
      active = false;
    }

    revalidatePath('/home');
    revalidatePath(`/posts/${idPost}`);

    return { active };
  } catch {
    return { error: errorMessage };
  }
}

export async function toggleLike(input: PostInteractionInput) {
  const result = await toggleInteraction({
    errorMessage: 'No se pudo procesar el like',
    input,
    table: postLikes,
  });

  if ('error' in result) return result;
  return { liked: result.active };
}

export async function toggleBookmark(input: PostInteractionInput) {
  const result = await toggleInteraction({
    errorMessage: 'No se pudo guardar el post',
    input,
    table: bookmarks,
  });

  if ('error' in result) return result;
  return { bookmarked: result.active };
}

export async function repostPost(input: PostInteractionInput) {
  const result = await toggleInteraction({
    errorMessage: 'No se pudo repostear',
    input,
    table: postShares,
  });

  if ('error' in result) return result;
  return { reposted: result.active };
}

export async function fetchMoreFeedPosts({
  offset,
  tab,
}: {
  offset: number;
  tab: FeedTab;
}): Promise<{ hasMore: boolean; posts: Post[] } | { error: string }> {
  try {
    const session = await auth();

    const morePosts = await getFeedPosts({
      offset,
      tab,
      viewerId: session?.user?.id,
    });

    return { hasMore: morePosts.length === FEED_PAGE_SIZE, posts: morePosts };
  } catch {
    return { error: 'No se pudieron cargar más posts' };
  }
}
