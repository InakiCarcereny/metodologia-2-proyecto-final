import type { JSX } from 'react';
import { cn } from '@/lib/utils';

export const POST_TYPE_LABELS = {
  article: 'artículo',
  question: 'pregunta',
  snippet: 'snippet',
} as const;

export type PostType = keyof typeof POST_TYPE_LABELS;

export const POST_TYPE_PILL_CLASSES: Record<PostType, string> = {
  article: 'bg-[#f2f1dd] text-[#6b6420]',
  question: 'bg-[#e8eefb] text-[#2d4f9e]',
  snippet: 'bg-[#fdf0e3] text-[#b45309]',
};

interface TypePillProps {
  type: PostType;
}

export function TypePill({ type }: TypePillProps): JSX.Element {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 font-medium text-[11px]',
        POST_TYPE_PILL_CLASSES[type],
      )}
    >
      {POST_TYPE_LABELS[type]}
    </span>
  );
}
