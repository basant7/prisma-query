import type { ParsedSearch } from '../types';

export function parseSearch(
  params: Record<string, string>,
  searchable: string[],
): ParsedSearch | undefined {
  const searchTerm = params['search'] || params['q'];
  if (!searchTerm || searchable.length === 0) return undefined;

  return {
    OR: searchable.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const,
      },
    })),
  };
}

export function buildPrismaSearch(search: ParsedSearch): Record<string, unknown> {
  if (!search || search.OR.length === 0) return {};

  if (search.OR.length === 1) {
    return search.OR[0] ?? {};
  }

  return { OR: search.OR };
}
