import type { ParsedQuery, QueryConfig, SortDirection } from './types';
import { buildPrismaFilters } from './filters';
import { buildPrismaSearch } from './search';
import { buildPrismaSort } from './sort';
import { buildPrismaInclude } from './include';
import { buildPrismaSelect } from './select';

export interface PrismaQueryObject {
  where?: Record<string, unknown>;
  orderBy?: Record<string, SortDirection>[];
  skip?: number;
  take?: number;
  include?: Record<string, boolean | object>;
  select?: Record<string, boolean>;
  distinct?: string[];
  groupBy?: string[];
}

export function toPrismaQuery(
  query: ParsedQuery,
  config?: QueryConfig,
): PrismaQueryObject {
  const whereClauses: Record<string, unknown>[] = [];

  const filterWhere = buildPrismaFilters(query.filters);
  if (Object.keys(filterWhere).length > 0) {
    whereClauses.push(filterWhere);
  }

  if (query.search) {
    const searchWhere = buildPrismaSearch(query.search);
    if (Object.keys(searchWhere).length > 0) {
      whereClauses.push(searchWhere);
    }
  }

  if (config?.softDelete && config.softDeleteField) {
    whereClauses.push({
      [config.softDeleteField]: null,
    });
  }

  let where: Record<string, unknown> | undefined;

  if (whereClauses.length === 1) {
    where = whereClauses[0];
  } else if (whereClauses.length > 1) {
    where = { AND: whereClauses };
  }

  const orderBy =
    query.sort.length > 0 ? buildPrismaSort(query.sort) : undefined;

  const result: PrismaQueryObject = {};

  if (where) result.where = where;
  if (orderBy) result.orderBy = orderBy;

  if (query.cursor) {
    result.take = query.cursor.take;
  } else {
    result.skip = query.pagination.skip;
    result.take = query.pagination.limit;
  }

  if (query.include) {
    result.include = buildPrismaInclude(query.include);
  }

  if (query.select) {
    result.select = buildPrismaSelect(query.select);
  }

  if (query.distinct && query.distinct.length > 0) {
    result.distinct = query.distinct;
  }

  if (query.groupBy && query.groupBy.length > 0) {
    result.groupBy = query.groupBy;
  }

  return result;
}
