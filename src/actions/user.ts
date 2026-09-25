'use server';

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import {
  type CreateUserInput,
  createUserSchema,
  type UpdateUserInput,
  updateUserSchema,
} from '@/schemas/user';

const publicUserColumns = {
  createdAt: users.createdAt,
  email: users.email,
  emailVerified: users.emailVerified,
  id: users.id,
  username: users.username,
};

export async function createUser(input: CreateUserInput) {
  const parsed = createUserSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const { email, password, username } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash, username })
      .returning(publicUserColumns);

    return { user };
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    ) {
      return { error: 'El email o username ya está en uso' };
    }

    throw error;
  }
}

export async function updateUser(input: UpdateUserInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'No autenticado' };
  }

  const parsed = updateUserSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  try {
    const [user] = await db
      .update(users)
      .set(parsed.data)
      .where(eq(users.id, session.user.id))
      .returning(publicUserColumns);

    return { user };
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    ) {
      return { error: 'El email o username ya está en uso' };
    }

    throw error;
  }
}
