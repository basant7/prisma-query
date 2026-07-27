import type { PaginationParams } from '../types';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(
  params: Record<string, string>,
  defaults?: { page?: number; limit?: number; maxLimit?: number },
): PaginationParams {
  const defaultPage = defaults?.page ?? DEFAULT_PAGE;
  const defaultLimit = defaults?.limit ?? DEFAULT_LIMIT;
  const maxLimit = defaults?.maxLimit ?? MAX_LIMIT;

  const page = Math.max(1, Math.floor(Number(params['page']) || defaultPage));
  const limitNum = Number(params['limit']);
  const rawLimit = Math.floor(isNaN(limitNum) ? defaultLimit : limitNum);
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
