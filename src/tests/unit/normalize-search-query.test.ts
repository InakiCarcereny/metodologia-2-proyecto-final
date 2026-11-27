import { describe, expect, it } from 'vitest';
import { normalizeSearchQuery } from '../../utils/normalize-search-query';

describe('normalizeSearchQuery', () => {
  it('removes surrounding spaces and a leading @', () => {
    expect(normalizeSearchQuery('  @developer  ')).toBe('developer');
  });

  it('removes a leading # from a tag search', () => {
    expect(normalizeSearchQuery(' #typescript')).toBe('typescript');
  });

  it('keeps a regular query after trimming it', () => {
    expect(normalizeSearchQuery('  web development  ')).toBe('web development');
  });
});
