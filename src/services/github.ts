import type {
  GitHubRepoDto,
  GitHubTokenResponse,
  GitHubUserDto,
} from '@/types/github';

const GITHUB_API_URL =
  'https://api.github.com/user/repos?sort=pushed&direction=desc&affiliation=owner&per_page=5';

export const GITHUB_CONNECT_STATE_COOKIE = 'github_connect_state';

export async function fetchGitHubRepos(
  accessToken: string,
): Promise<GitHubRepoDto[]> {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function exchangeGitHubCode(
  code: string,
  redirectUri: string,
): Promise<GitHubTokenResponse> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    body: JSON.stringify({
      client_id: process.env.AUTH_GITHUB_ID,
      client_secret: process.env.AUTH_GITHUB_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(
      `Error de intercambio de tokens de GitHub: ${response.status}`,
    );
  }

  const data: GitHubTokenResponse = await response.json();
  if (!data.access_token) {
    throw new Error(
      'El intercambio de tokens de GitHub no devolvió ningún access_token',
    );
  }

  return data;
}

export async function fetchGitHubUser(
  accessToken: string,
): Promise<GitHubUserDto> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
