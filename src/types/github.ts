export interface GitHubRepoDto {
  full_name: string;
  html_url: string;
  language: string | null;
  name: string;
  pushed_at: string;
  stargazers_count: number;
}

export interface Repo {
  fullName: string;
  language: string | null;
  pushedAt: Date;
  stars: number;
  url: string;
}

export interface GitHubTokenResponse {
  access_token: string;
}

export interface GitHubUserDto {
  avatar_url: string;
  id: number;
  login: string;
}
