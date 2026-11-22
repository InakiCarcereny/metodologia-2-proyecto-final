import type { JSX } from 'react';
import { StackLanguageBar } from '@/components/StackLanguageBar';
import { CardWrapper } from '@/components/ui/CardWrapper';
import type { StackLanguage } from '@/data/stack';

interface InferredStackCardProps {
  stack: StackLanguage[];
}

export function InferredStackCard({
  stack,
}: InferredStackCardProps): JSX.Element | null {
  if (stack.length === 0) return null;

  const maxCount = stack[0].count;

  return (
    <CardWrapper as="section" className="flex flex-col gap-3">
      <h2 className="font-medium text-[#878992] text-[12px]">
        STACK INFERIDO DE SUS POSTS
      </h2>

      <ul className="flex flex-col gap-2">
        {stack.map(({ count, language }) => (
          <StackLanguageBar
            key={language}
            language={language}
            percentage={(count / maxCount) * 100}
          />
        ))}
      </ul>
    </CardWrapper>
  );
}
