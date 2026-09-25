import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { db } from '@/db';
import { profiles, users } from '@/db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  callbacks: {
    async signIn({ user, account, profile }): Promise<boolean> {
      if (account?.provider === 'github' && profile) {
        if (!user.id) return false;

        await db
          .insert(profiles)
          .values({
            avatarUrl: profile.avatar_url as string,
            id: user.id,
          })
          .onConflictDoUpdate({
            set: { avatarUrl: profile.avatar_url as string },
            target: profiles.id,
          });
      }
      return true;
    },
  },
  providers: [
    ...authConfig.providers.filter((p) => p.name !== 'credentials'),
    Credentials({
      authorize: async (credentials) => {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );
        if (!valid) return null;

        return user;
      },
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Contraseña', type: 'password' },
      },
    }),
  ],
});
