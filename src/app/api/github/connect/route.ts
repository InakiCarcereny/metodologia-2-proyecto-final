import { randomBytes } from 'node:crypto';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GITHUB_CONNECT_STATE_COOKIE } from '@/services/github';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const state = randomBytes(16).toString('hex');
  const redirectUri = new URL(
    '/api/github/connect/callback',
    request.url,
  ).toString();

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', process.env.AUTH_GITHUB_ID ?? '');
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'read:user');
  authorizeUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(GITHUB_CONNECT_STATE_COOKIE, state, {
    httpOnly: true,
    maxAge: 60 * 10,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
