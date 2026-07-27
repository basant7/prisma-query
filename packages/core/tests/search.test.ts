import { describe, it, expect } from 'vitest';
import { parseSearch, buildPrismaSearch } from '../src/search';

describe('parseSearch', () => {
  const searchable = ['name', 'email', 'bio'];

  it('parses search term', () => {
    const params = { search: 'john' };
    const result = parseSearch(params, searchable);
    expect(result).toEqual({
      OR: [
        { name: { contains: 'john', mode: 'insensitive' } },
        { email: { contains: 'john', mode: 'insensitive' } },
        { bio: { contains: 'john', mode: 'insensitive' } },
      ],
    });
  });

  it('parses q parameter as alternative', () => {
    const params = { q: 'test' };
    const result = parseSearch(params, searchable);
    expect(result).toEqual({
      OR: [
        { name: { contains: 'test', mode: 'insensitive' } },
        { email: { contains: 'test', mode: 'insensitive' } },
        { bio: { contains: 'test', mode: 'insensitive' } },
      ],
    });
  });

  it('returns undefined when no search term', () => {
    const params = {};
    const result = parseSearch(params, searchable);
    expect(result).toBeUndefined();
  });

  it('returns undefined when no searchable fields', () => {
    const params = { search: 'test' };
    const result = parseSearch(params, []);
    expect(result).toBeUndefined();
  });
});

describe('buildPrismaSearch', () => {
  it('builds single field search', () => {
    const search = {
      OR: [{ name: { contains: 'john', mode: 'insensitive' as const } }],
    };
    const result = buildPrismaSearch(search);
    expect(result).toEqual({ name: { contains: 'john', mode: 'insensitive' } });
  });

  it('builds multi-field search', () => {
    const search = {
      OR: [
        { name: { contains: 'john', mode: 'insensitive' as const } },
        { email: { contains: 'john', mode: 'insensitive' as const } },
      ],
    };
    const result = buildPrismaSearch(search);
    expect(result).toEqual({
      OR: [
        { name: { contains: 'john', mode: 'insensitive' } },
        { email: { contains: 'john', mode: 'insensitive' } },
      ],
    });
  });

  it('returns empty for empty search', () => {
    const search = { OR: [] };
    const result = buildPrismaSearch(search);
    expect(result).toEqual({});
  });
});
