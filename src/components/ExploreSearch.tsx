'use client';

import type { JSX, SubmitEvent } from 'react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQueryParam } from '@/hooks/useQueryParam';
import { normalizeSearchQuery } from '@/utils/normalize-search-query';

export function ExploreSearch(): JSX.Element {
  const { searchParams, setParam } = useQueryParam();

  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const debouncedQuery = useDebouncedValue(query, 300);

  const updateSearch = useCallback(
    (value: string): void => {
      const normalizedValue = normalizeSearchQuery(value);

      startTransition(() => {
        setParam(
          'q',
          normalizedValue.length > 0 ? normalizedValue : null,
          'replace',
        );
      });
    },
    [setParam],
  );

  useEffect(() => {
    const normalizedQuery = normalizeSearchQuery(debouncedQuery);
    const currentQuery = searchParams.get('q') ?? '';

    if (normalizedQuery === currentQuery) return;

    updateSearch(normalizedQuery);
  }, [debouncedQuery, searchParams, updateSearch]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    updateSearch(query);
  };

  return (
    <form className="flex items-center gap-3" onSubmit={handleSubmit}>
      <input
        className="min-w-0 flex-1 rounded-lg border border-[#d6d7db] bg-white p-3 text-[#494d56] text-sm placeholder:text-[#95989f] focus:outline-none"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar..."
        type="search"
        value={query}
      />

      <Button
        className="px-5"
        disabled={isPending}
        type="submit"
        variant="primary"
      >
        Buscar
      </Button>
    </form>
  );
}
