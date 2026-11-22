import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { findGitHubAccountOwner, linkGitHubAccount } from '@/data/github';
import {
  exchangeGitHubCode,
  fetchGitHubUser,
  GITHUB_CONNECT_STATE_COOKIE,
} from '@/services/github';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const savedState = request.cookies.get(GITHUB_CONNECT_STATE_COOKIE)?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(
      new URL('/profile?githubError=invalid-state', request.url),
    );
  }

  const redirectUri = new URL(
    '/api/github/connect/callback',
    request.url,
  ).toString();

  try {
    const { access_token } = await exchangeGitHubCode(code, redirectUri);
    const githubUser = await fetchGitHubUser(access_token);
    const providerAccountId = githubUser.id.toString();

    const ownerId = await findGitHubAccountOwner(providerAccountId);
    if (ownerId && ownerId !== session.user.id) {
      return NextResponse.redirect(
        new URL('/profile?githubError=already-linked', request.url),
      );
    }

    if (!ownerId) {
      await linkGitHubAccount({
        accessToken: access_token,
        avatarUrl: githubUser.avatar_url,
        providerAccountId,
        userId: session.user.id,
      });
    }

    const response = NextResponse.redirect(
      new URL('/profile?githubLinked=1', request.url),
    );
    response.cookies.delete(GITHUB_CONNECT_STATE_COOKIE);

    return response;
  } catch {
    return NextResponse.redirect(
      new URL('/profile?githubError=unknown', request.url),
    );
  }
}
