import type { HttpRequest, ParsedQuery, QueryConfig } from '../types';
import { extractQueryParams, parseRawQuery } from './index';
import { parseFilters } from '../filters';
import { parseSearch } from '../search';
import { parseSort } from '../sort';
import { parsePagination } from '../pagination';
import { parseCursorPagination } from '../cursor';
import { parseInclude } from '../include';
import { parseSelect } from '../select';

const DEFAULT_CONFIG: QueryConfig = {
  searchable: [],
  sortable: [],
  filterable: [],
  includeable: [],
  selectable: [],
  defaultLimit: 20,
  maxLimit: 100,
  searchMode: 'insensitive',
};

export function prismaQuery(
  req: HttpRequest,
  config?: QueryConfig,
): ParsedQuery {
  const mergedConfig: QueryConfig = { ...DEFAULT_CONFIG, ...config };
  const params = extractQueryParams(req);

  const pagination = parsePagination(params, {
    limit: mergedConfig.defaultLimit,
    maxLimit: mergedConfig.maxLimit,
  });

  const cursor = parseCursorPagination(params, {
    limit: mergedConfig.defaultLimit,
    maxLimit: mergedConfig.maxLimit,
  });

  const sort = parseSort(
    params,
    mergedConfig.sortable ?? [],
    mergedConfig.defaultSort,
  );

  const filters = parseFilters(params, mergedConfig.filterable ?? []);

  const search = parseSearch(params, mergedConfig.searchable ?? []);

  const include = parseInclude(params, mergedConfig.includeable ?? []);

  const select = parseSelect(params, mergedConfig.selectable ?? []);

  const raw = parseRawQuery(params, mergedConfig);

  const result: ParsedQuery = {
    pagination,
    sort,
    filters,
    search,
    include,
    select,
    raw,
  };

  if (cursor) {
    result.cursor = cursor;
  }

  return result;
}
