'use server';

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { getFollowers, getFollowing, getUserProfileById } from '@/data/profile';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import {
  type EditProfileFormValues,
  editProfileSchema,
} from '@/schemas/profile';
import type { UserListItem, UserProfile } from '@/types/user';

interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function getMyProfile(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return getUserProfileById(session.user.id);
}

export async function getFollowersList(
  userId: string,
): Promise<UserListItem[]> {
  const session = await auth();

  return getFollowers(userId, session?.user?.id);
}

export async function getFollowingList(
  userId: string,
): Promise<UserListItem[]> {
  const session = await auth();

  return getFollowing(userId, session?.user?.id);
}

export async function updateProfile(
  values: EditProfileFormValues,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  const validated = editProfileSchema.safeParse(values);
  if (!validated.success) return { error: 'Datos inválidos' };

  const { bio, location, website } = validated.data;

  await db
    .update(profiles)
    .set({
      bio: bio || null,
      location: location || null,
      website: website || null,
    })
    .where(eq(profiles.id, session.user.id));

  revalidatePath('/profile');

  return { success: true };
}

export async function updateAvatar(url: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  await db
    .update(profiles)
    .set({ avatarUrl: url })
    .where(eq(profiles.id, session.user.id));

  revalidatePath('/profile');

  return { success: true };
}

export async function updateCover(url: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'No autenticado' };

  await db
    .update(profiles)
    .set({ coverUrl: url })
    .where(eq(profiles.id, session.user.id));

  revalidatePath('/profile');

  return { success: true };
}
