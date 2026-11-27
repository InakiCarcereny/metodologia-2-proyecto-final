import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type NavigationMode = 'push' | 'replace';

interface UseQueryParamResult {
  searchParams: URLSearchParams;
  setParam: (key: string, value: string | null, mode?: NavigationMode) => void;
}

export function useQueryParam(): UseQueryParamResult {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (
      key: string,
      value: string | null,
      mode: NavigationMode = 'push',
    ): void => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (mode === 'replace') {
        router.replace(url, { scroll: false });
      } else {
        router.push(url);
      }
    },
    [pathname, router, searchParams],
  );

  return { searchParams, setParam };
}
