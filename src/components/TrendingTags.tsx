import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { Separator } from '@/components/Separator';
import { TrendingTagItem } from '@/components/TrendingTagItem';
import { CardWrapper } from '@/components/ui/CardWrapper';
import { getTrendingTags } from '@/data/tag';

export async function TrendingTags(): Promise<JSX.Element | null> {
  const tags = await getTrendingTags();
  if (tags.length === 0) return null;

  return (
    <CardWrapper as="section" className="flex flex-col gap-2">
      <h2 className="font-medium text-[#878992] text-[12px]">
        TAGS EN TENDENCIA
      </h2>

      <ul className="mt-2 mb-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TrendingTagItem key={tag.id} label={tag.label} />
        ))}
      </ul>

      <Separator />

      <Link
        className="mt-2 flex items-center gap-2 font-light text-[#4265b3] text-xs"
        href="/explore"
      >
        ver más <ArrowRight color="#4265b3" size={12} />
      </Link>
    </CardWrapper>
  );
}
