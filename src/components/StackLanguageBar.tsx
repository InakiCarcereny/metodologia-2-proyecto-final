import type { JSX } from 'react';

interface StackLanguageBarProps {
  language: string;
  percentage: number;
}

export function StackLanguageBar({
  language,
  percentage,
}: StackLanguageBarProps): JSX.Element {
  return (
    <li className="flex items-center gap-3">
      <span className="w-24 shrink-0 font-mono text-[13px] text-black">
        {language}
      </span>

      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </li>
  );
}
