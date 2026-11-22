import type { JSX } from 'react';
import { RepoItem } from '@/components/RepoItem';
import { CardWrapper } from '@/components/ui/CardWrapper';
import type { Repo } from '@/types/github';

interface ConnectedReposCardProps {
  repos: Repo[];
}

export function ConnectedReposCard({
  repos,
}: ConnectedReposCardProps): JSX.Element | null {
  if (repos.length === 0) return null;

  return (
    <CardWrapper as="section" className="flex flex-col gap-3">
      <h2 className="font-medium text-[#878992] text-[12px]">
        REPOS CONECTADOS
      </h2>

      <ul className="flex flex-col gap-3">
        {repos.map((repo) => (
          <RepoItem key={repo.fullName} repo={repo} />
        ))}
      </ul>
    </CardWrapper>
  );
}
