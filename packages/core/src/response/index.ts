import type {
  ParsedQuery,
  PaginationParams,
  QueryResponse,
  QueryResponseMeta,
  CursorPaginationParams,
  CursorQueryResponse,
} from '../types';

export function buildResponseMeta(
  total: number,
  pagination: PaginationParams,
): QueryResponseMeta {
  const pages = Math.ceil(total / pagination.limit);

  return {
    page: pagination.page,
    limit: pagination.limit,
    total,
    pages,
    next: pagination.page < pages ? pagination.page + 1 : null,
    previous: pagination.page > 1 ? pagination.page - 1 : null,
    hasNext: pagination.page < pages,
    hasPrevious: pagination.page > 1,
  };
}

export function createResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams,
): QueryResponse<T> {
  return {
    success: true,
    data,
    meta: buildResponseMeta(total, pagination),
  };
}

export function createCursorResponse<T>(
  data: T[],
  cursor: CursorPaginationParams,
  hasNext: boolean,
  getCursor: (item: T) => string | null,
): CursorQueryResponse<T> {
  const nextCursor =
    hasNext && data.length > 0 ? getCursor(data[data.length - 1]!) : null;
  const hasPrevious = !!cursor.cursor;

  return {
    success: true,
    data,
    meta: {
      nextCursor,
      previousCursor: cursor.cursor ?? null,
      hasNext,
      hasPrevious,
      take: cursor.take,
    },
  };
}

export function response<T>(
  query: ParsedQuery,
  data: T[],
  total: number,
): QueryResponse<T> | CursorQueryResponse<T> {
  if (query.cursor) {
    return createCursorResponse(
      data,
      query.cursor,
      data.length === query.cursor.take,
      (item: T) => {
        if (typeof item === 'object' && item !== null && 'id' in item) {
          return String((item as Record<string, unknown>)['id']);
        }
        return null;
      },
    );
  }

  return createResponse(data, total, query.pagination);
}
