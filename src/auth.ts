import { DrizzleAdapter } from '@auth/drizzle-adapter';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub, { type GitHubProfile } from 'next-auth/providers/github';
import { authConfig } from '@/auth.config';
import { db } from '@/db';
import { accounts, profiles, users } from '@/db/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    // biome-ignore lint/suspicious/noExplicitAny: @auth/drizzle-adapter
  } as any),
  events: {
    async linkAccount({ account, profile, user }) {
      if (account.provider !== 'github' || !user.id) return;

      const avatarUrl = (profile as { avatar_url?: string })?.avatar_url;

      await db
        .insert(profiles)
        .values({ avatarUrl, id: user.id })
        .onConflictDoUpdate({
          set: { avatarUrl },
          target: profiles.id,
        });
    },
  },
  providers: [
    GitHub({
      profile(profile: GitHubProfile) {
        return {
          email: profile.email,
          id: profile.id.toString(),
          image: profile.avatar_url,
          name: profile.name ?? profile.login,
          username: profile.login,
        };
      },
    }),
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
