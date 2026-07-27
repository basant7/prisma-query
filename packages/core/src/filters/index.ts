import type { FilterOperator, ParsedFilters } from '../types';

const OPERATOR_MAP: Record<string, FilterOperator> = {
  equals: 'equals',
  eq: 'equals',
  not: 'not',
  neq: 'not',
  gt: 'gt',
  gte: 'gte',
  lt: 'lt',
  lte: 'lte',
  in: 'in',
  notIn: 'notIn',
  contains: 'contains',
  startsWith: 'startsWith',
  endsWith: 'endsWith',
  mode: 'mode',
};

export function parseFilters(
  params: Record<string, string>,
  filterable: string[],
): ParsedFilters {
  const filters: ParsedFilters = {};
  const filterableSet = new Set(filterable);

  for (const [key, value] of Object.entries(params)) {
    const bracketMatch = key.match(/^(\w+)\[(\w+)\]$/);

    if (bracketMatch) {
      const [, field, operatorRaw] = bracketMatch;
      if (!field || !operatorRaw) continue;
      if (!filterableSet.has(field)) continue;

      const operator = OPERATOR_MAP[operatorRaw];
      if (!operator) continue;

      if (!filters[field]) {
        filters[field] = {};
      }

      const parsedValue = parseFilterValue(operator, value);
      (filters[field] as Record<string, unknown>)[operator] = parsedValue;
    } else if (filterableSet.has(key)) {
      if (!filters[key]) {
        filters[key] = {};
      }
      (filters[key] as Record<string, unknown>)['equals'] = parseFilterValue(
        'equals',
        value,
      );
    }
  }

  return filters;
}

function parseFilterValue(
  operator: FilterOperator,
  value: string,
): string | number | boolean | string[] {
  if (operator === 'in' || operator === 'notIn') {
    return value.split(',').map((v) => v.trim());
  }

  if (operator === 'mode') {
    return value as 'insensitive' | 'sensitive';
  }

  if (value === 'true') return true;
  if (value === 'false') return false;

  const num = Number(value);
  if (!isNaN(num) && value !== '') return num;

  return value;
}

export function buildPrismaFilters(
  filters: ParsedFilters,
): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  for (const [field, conditions] of Object.entries(filters)) {
    const fieldConditions = conditions as Record<string, unknown>;
    const keys = Object.keys(fieldConditions);

    if (keys.length === 1 && keys[0] === 'equals') {
      where[field] = fieldConditions['equals'];
    } else {
      where[field] = { ...fieldConditions };
    }
  }

  return where;
}
