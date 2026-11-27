interface ExploreSectionLabels {
  found: string;
  notFound: string;
  recommended: string;
}

interface ExploreSectionResult<T> {
  hasMore: boolean;
  slots: (T | null)[];
  title: string;
}

export function buildExploreSection<T>(
  searched: T[],
  recommended: T[],
  hasSearch: boolean,
  labels: ExploreSectionLabels,
  slotCount = 4,
): ExploreSectionResult<T> {
  const hasSearchResults = hasSearch && searched.length > 0;
  const displayed = hasSearchResults
    ? searched.slice(0, slotCount)
    : recommended.slice(0, slotCount);

  const slots = Array.from(
    { length: slotCount },
    (_, index) => displayed[index] ?? null,
  );

  const hasMore = hasSearch && searched.length > slotCount;

  const title = !hasSearch
    ? labels.recommended
    : searched.length > 0
      ? labels.found
      : labels.notFound;

  return { hasMore, slots, title };
}
