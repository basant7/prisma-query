import type { HttpRequest, ParsedQuery, QueryConfig } from './types';
import { extractQueryParams } from './parser';
import { parseFilters } from './filters';
import { parseSearch } from './search';
import { parseSort } from './sort';
import { parsePagination } from './pagination';
import { parseCursorPagination } from './cursor';
import { parseInclude } from './include';
import { parseSelect } from './select';

export class PrismaQueryBuilder {
  private req: HttpRequest;
  private config: QueryConfig;
  private parsedQuery: Partial<ParsedQuery> = {};

  constructor(req: HttpRequest, config: QueryConfig = {}) {
    this.req = req;
    this.config = config;
  }

  addPagination(): this {
    const params = extractQueryParams(this.req);
    this.parsedQuery.pagination = parsePagination(params, {
      limit: this.config.defaultLimit,
      maxLimit: this.config.maxLimit,
    });
    return this;
  }

  addCursorPagination(): this {
    const params = extractQueryParams(this.req);
    const cursor = parseCursorPagination(params, {
      limit: this.config.defaultLimit,
      maxLimit: this.config.maxLimit,
    });
    if (cursor) {
      this.parsedQuery.cursor = cursor;
    }
    return this;
  }

  addSort(): this {
    const params = extractQueryParams(this.req);
    this.parsedQuery.sort = parseSort(
      params,
      this.config.sortable ?? [],
      this.config.defaultSort,
    );
    return this;
  }

  addFilters(): this {
    const params = extractQueryParams(this.req);
    this.parsedQuery.filters = parseFilters(
      params,
      this.config.filterable ?? [],
    );
    return this;
  }

  addSearch(): this {
    const params = extractQueryParams(this.req);
    const search = parseSearch(params, this.config.searchable ?? []);
    if (search) {
      this.parsedQuery.search = search;
    }
    return this;
  }

  addInclude(): this {
    const params = extractQueryParams(this.req);
    const include = parseInclude(params, this.config.includeable ?? []);
    if (include) {
      this.parsedQuery.include = include;
    }
    return this;
  }

  addSelect(): this {
    const params = extractQueryParams(this.req);
    const select = parseSelect(params, this.config.selectable ?? []);
    if (select) {
      this.parsedQuery.select = select;
    }
    return this;
  }

  build(): ParsedQuery {
    return {
      pagination: this.parsedQuery.pagination ?? {
        page: 1,
        limit: this.config.defaultLimit ?? 20,
        skip: 0,
      },
      sort: this.parsedQuery.sort ?? [],
      filters: this.parsedQuery.filters ?? {},
      search: this.parsedQuery.search,
      include: this.parsedQuery.include,
      select: this.parsedQuery.select,
      raw: extractQueryParams(this.req),
    };
  }
}
// test
