import type { JSX } from 'react';
import { CardWrapper } from '@/components/ui/CardWrapper';

export function TrendingTags(): JSX.Element {
  return (
    <CardWrapper>
      <h2 className="font-medium text-[#878992] text-[12px]">
        TAGS EN TENDENCIA
      </h2>
    </CardWrapper>
  );
}
