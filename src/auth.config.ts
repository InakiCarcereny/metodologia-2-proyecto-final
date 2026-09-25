import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/login' },
  providers: [
    GitHub,
    Credentials({
      authorize: async () => null,
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Contraseña', type: 'password' },
      },
    }),
  ],
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;
