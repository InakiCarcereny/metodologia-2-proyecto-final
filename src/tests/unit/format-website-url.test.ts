import { describe, expect, it } from 'vitest';
import { formatWebsiteUrl } from '../../utils/format-website-url';

describe('formatWebsiteUrl', () => {
  it('returns the hostname without www', () => {
    expect(formatWebsiteUrl('https://www.example.com/profile')).toBe(
      'example.com',
    );
  });

  it('supports URLs without a www prefix', () => {
    expect(formatWebsiteUrl('https://example.com')).toBe('example.com');
  });

  it('removes the protocol when the URL cannot be parsed', () => {
    expect(formatWebsiteUrl('https://not a valid url')).toBe('not a valid url');
  });
});
