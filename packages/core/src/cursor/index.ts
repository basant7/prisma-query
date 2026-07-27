import type { CursorPaginationParams } from '../types';

const DEFAULT_CURSOR_LIMIT = 20;
const MAX_CURSOR_LIMIT = 100;

export function parseCursorPagination(
  params: Record<string, string>,
  defaults?: { limit?: number; maxLimit?: number },
): CursorPaginationParams | undefined {
  const cursor = params['cursor'];
  if (!cursor) return undefined;

  const maxLimit = defaults?.maxLimit ?? MAX_CURSOR_LIMIT;
  const rawLimit = Math.floor(
    Number(params['limit']) || (defaults?.limit ?? DEFAULT_CURSOR_LIMIT),
  );
  const take = Math.min(Math.max(1, rawLimit), maxLimit);

  return { cursor, take };
}

export function buildCursorWhere(cursor: string, sortField: string) {
  return {
    [sortField]: { gt: cursor },
  };
}
