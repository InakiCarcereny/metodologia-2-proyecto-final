'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { getUserByEmail, getUserByUsername } from '@/data/user';
import { db } from '@/db';
import { profiles, users } from '@/db/schema';
import {
  type LoginFormValues,
  loginSchema,
  type RegisterFormValues,
  registerSchema,
} from '@/schemas/auth';

interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function register(
  values: RegisterFormValues,
): Promise<ActionResult> {
  const validated = registerSchema.safeParse(values);

  if (!validated.success) {
    return { error: 'Datos inválidos' };
  }

  const { email, password, username } = validated.data;

  const existingEmail = await getUserByEmail(email);

  if (existingEmail) {
    return { error: 'Ese correo ya está registrado' };
  }

  const existingUsername = await getUserByUsername(username);

  if (existingUsername) {
    return { error: 'Ese usuario ya está en uso' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({ email, passwordHash, username })
    .returning();

  if (!user) {
    return { error: 'No se pudo crear la cuenta' };
  }

  await db.insert(profiles).values({ id: user.id });

  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Cuenta creada, pero no se pudo iniciar sesión' };
    }
    throw error;
  }

  return { success: true };
}

export async function login(values: LoginFormValues): Promise<ActionResult> {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return { error: 'Datos inválidos' };
  }

  const { email, password } = validated.data;

  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Correo o contraseña incorrectos' };
        default:
          return { error: 'Algo salió mal' };
      }
    }
  }

  return { success: true };
}

export async function loginWithGithub(): Promise<void> {
  await signIn('github', { redirectTo: '/home' });
}
