'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';
import { cn } from '@/lib/utils';
import type { PostType } from '@/types/post';

interface ExploreFiltersProps {
  activeType?: PostType;
}

const FILTERS: Array<{
  label: string;
  value: PostType;
}> = [
  {
    label: 'tipo:snippet',
    value: 'snippet',
  },
  {
    label: 'tipo:pregunta',
    value: 'question',
  },
  {
    label: 'tipo:artículo',
    value: 'article',
  },
];

export function ExploreFilters({
  activeType,
}: ExploreFiltersProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleFilterChange(type: PostType): void {
    const params = new URLSearchParams(searchParams.toString());

    if (activeType === type) {
      params.delete('type');
    } else {
      params.set('type', type);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[#7e8288] text-xs">filtros:</span>

      {FILTERS.map((filter) => {
        const isActive = activeType === filter.value;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              'cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-[13px] transition-colors',
              isActive
                ? 'border-[#171b22] bg-[#171b22] text-white'
                : 'border-[#d6d7db] bg-white text-[#494d56] hover:border-[#9b9ea5]',
            )}
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
