import type { GitHubRepoDto, Repo } from '@/types/github';

export function adaptGitHubRepo(dto: GitHubRepoDto): Repo {
  return {
    fullName: dto.full_name,
    language: dto.language,
    pushedAt: new Date(dto.pushed_at),
    stars: dto.stargazers_count,
    url: dto.html_url,
  };
}
