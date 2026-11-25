'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent, JSX } from 'react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function ExploreSearch(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const debouncedQuery = useDebouncedValue(query, 300);

  const updateSearch = useCallback(
    (value: string): void => {
      const params = new URLSearchParams(searchParams.toString());
      const normalizedValue = value.trim();

      if (normalizedValue.length > 0) {
        params.set('q', normalizedValue);
      } else {
        params.delete('q');
      }

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();
    const currentQuery = searchParams.get('q') ?? '';

    if (normalizedQuery === currentQuery) return;

    updateSearch(normalizedQuery);
  }, [debouncedQuery, searchParams, updateSearch]);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    updateSearch(query);
  }

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
