import { Star } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import type { Repo } from '@/types/github';
import { formatRelativeTime } from '@/utils/format-relative-time';

interface RepoItemProps {
  repo: Repo;
}

export function RepoItem({ repo }: RepoItemProps): JSX.Element {
  return (
    <li className="flex flex-col gap-1">
      <Link
        className="font-mono font-semibold text-[#4265b3] text-[13px]"
        href={repo.url}
        rel="noreferrer"
        target="_blank"
      >
        {repo.fullName}
      </Link>

      <small className="flex items-center gap-1 text-[#7e8288] text-[12px]">
        {repo.language && (
          <>
            <span>{repo.language}</span>
            <span>·</span>
          </>
        )}

        <span className="flex items-center gap-1">
          <Star fill="currentColor" size={11} />
          {repo.stars}
        </span>

        <span>·</span>

        <span>último push {formatRelativeTime(repo.pushedAt)}</span>
      </small>
    </li>
  );
}
