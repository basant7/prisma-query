export type SortDirection = 'asc' | 'desc';

export type FilterOperator =
  | 'equals'
  | 'not'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'mode';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | string[];
}

export interface ParsedFilters {
  [field: string]: {
    [operator in FilterOperator]?: string | number | boolean | string[];
  };
}

export interface ParsedSort {
  field: string;
  direction: SortDirection;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface CursorPaginationParams {
  cursor?: string;
  take: number;
}

export interface SearchConfig {
  fields: string[];
  mode?: 'insensitive' | 'sensitive';
}

export interface ParsedSearch {
  OR: Array<{ [field: string]: { contains: string; mode?: 'insensitive' } }>;
}

export interface IncludeConfig {
  fields: string[];
}

export interface SelectConfig {
  fields: string[];
}

export interface DateRangeFilter {
  [field: string]: {
    gte?: Date;
    lte?: Date;
  };
}

export interface ParsedQuery {
  pagination: PaginationParams;
  cursor?: CursorPaginationParams;
  sort: ParsedSort[];
  filters: ParsedFilters;
  search?: ParsedSearch;
  include?: Record<string, boolean | object>;
  select?: Record<string, boolean>;
  dateRange?: DateRangeFilter;
  distinct?: string[];
  groupBy?: string[];
  raw: Record<string, unknown>;
}

export interface QueryResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
  next?: number | null;
  previous?: number | null;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface QueryResponse<T> {
  success: boolean;
  data: T[];
  meta: QueryResponseMeta;
}

export interface CursorQueryResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    nextCursor?: string | null;
    previousCursor?: string | null;
    hasNext: boolean;
    hasPrevious: boolean;
    take: number;
  };
}

export interface QueryConfig {
  searchable?: string[];
  sortable?: string[];
  filterable?: string[];
  includeable?: string[];
  selectable?: string[];
  defaultSort?: string;
  defaultLimit?: number;
  maxLimit?: number;
  softDelete?: boolean;
  softDeleteField?: string;
  searchMode?: 'insensitive' | 'sensitive';
}

export interface UrlSearchParams {
  forEach(callback: (value: string, key: string) => void): void;
}

export interface HttpRequest {
  query?: Record<string, unknown> | UrlSearchParams;
  body?: Record<string, unknown>;
}

export type RawQueryValue =
  | string
  | string[]
  | Record<string, unknown>
  | undefined;

export interface RawQuery {
  [key: string]: RawQueryValue;
}
