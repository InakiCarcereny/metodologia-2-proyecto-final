export function normalizeSearchQuery(value: string): string {
  return value.trim().replace(/^[@#]/, '');
}
