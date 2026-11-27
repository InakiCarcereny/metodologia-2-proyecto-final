import { and, eq } from 'drizzle-orm';
import { adaptGitHubRepo } from '@/adapters/github-repo';
import { db } from '@/db';
import { accounts, profiles } from '@/db/schema';
import { fetchGitHubRepos } from '@/services/github';
import type { Repo } from '@/types/github';

interface LinkGitHubAccountParams {
  accessToken: string;
  avatarUrl: string | null;
  providerAccountId: string;
  userId: string;
}

export async function getConnectedRepos(userId: string): Promise<Repo[]> {
  const [account] = await db
    .select({ accessToken: accounts.access_token })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, 'github')));

  if (!account?.accessToken) return [];

  try {
    const repos = await fetchGitHubRepos(account.accessToken);
    return repos.map(adaptGitHubRepo);
  } catch {
    return [];
  }
}

export async function hasGitHubAccount(userId: string): Promise<boolean> {
  const [account] = await db
    .select({ providerAccountId: accounts.providerAccountId })
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.provider, 'github')));

  return Boolean(account);
}

export async function findGitHubAccountOwner(
  providerAccountId: string,
): Promise<string | null> {
  const [account] = await db
    .select({ userId: accounts.userId })
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, 'github'),
        eq(accounts.providerAccountId, providerAccountId),
      ),
    );

  return account?.userId ?? null;
}

export async function linkGitHubAccount({
  accessToken,
  avatarUrl,
  providerAccountId,
  userId,
}: LinkGitHubAccountParams): Promise<void> {
  await db.insert(accounts).values({
    access_token: accessToken,
    provider: 'github',
    providerAccountId,
    type: 'oauth',
    userId,
  });

  if (!avatarUrl) return;

  await db
    .insert(profiles)
    .values({ avatarUrl, id: userId })
    .onConflictDoUpdate({ set: { avatarUrl }, target: profiles.id });
}
