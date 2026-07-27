export class QueryValidationError extends Error {
  public readonly code: string;
  public readonly field?: string;

  constructor(message: string, code: string, field?: string) {
    super(message);
    this.name = 'QueryValidationError';
    this.code = code;
    this.field = field;
  }
}

export class InvalidSortFieldError extends QueryValidationError {
  constructor(field: string) {
    super(`Invalid sort field: "${field}"`, 'INVALID_SORT_FIELD', field);
  }
}

export class InvalidFilterFieldError extends QueryValidationError {
  constructor(field: string) {
    super(`Invalid filter field: "${field}"`, 'INVALID_FILTER_FIELD', field);
  }
}

export class InvalidIncludeFieldError extends QueryValidationError {
  constructor(field: string) {
    super(`Invalid include field: "${field}"`, 'INVALID_INCLUDE_FIELD', field);
  }
}

export class InvalidSelectFieldError extends QueryValidationError {
  constructor(field: string) {
    super(`Invalid select field: "${field}"`, 'INVALID_SELECT_FIELD', field);
  }
}

export class InvalidSearchFieldError extends QueryValidationError {
  constructor(field: string) {
    super(`Invalid search field: "${field}"`, 'INVALID_SEARCH_FIELD', field);
  }
}

export class PaginationError extends QueryValidationError {
  constructor(message: string) {
    super(message, 'PAGINATION_ERROR');
  }
}
