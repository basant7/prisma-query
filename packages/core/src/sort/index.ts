import type { ParsedSort, SortDirection } from '../types';

export function parseSort(
  params: Record<string, string>,
  sortable: string[],
  defaultSort?: string,
): ParsedSort[] {
  const sortParam = params['sort'];
  const sortableSet = new Set(sortable);
  const result: ParsedSort[] = [];

  if (sortParam) {
    const fields = sortParam.split(',');

    for (const field of fields) {
      const trimmed = field.trim();
      if (!trimmed) continue;

      let direction: SortDirection = 'asc';
      let fieldName = trimmed;

      if (fieldName.startsWith('-')) {
        direction = 'desc';
        fieldName = fieldName.slice(1);
      } else if (fieldName.startsWith('+')) {
        direction = 'asc';
        fieldName = fieldName.slice(1);
      }

      if (sortableSet.has(fieldName)) {
        result.push({ field: fieldName, direction });
      }
    }
  }

  if (result.length === 0 && defaultSort) {
    const fields = defaultSort.split(',');

    for (const field of fields) {
      const trimmed = field.trim();
      if (!trimmed) continue;

      let direction: SortDirection = 'asc';
      let fieldName = trimmed;

      if (fieldName.startsWith('-')) {
        direction = 'desc';
        fieldName = fieldName.slice(1);
      } else if (fieldName.startsWith('+')) {
        fieldName = fieldName.slice(1);
      }

      result.push({ field: fieldName, direction });
    }
  }

  return result;
}

export function buildPrismaSort(
  sort: ParsedSort[],
): Record<string, SortDirection>[] {
  return sort.map((s) => ({ [s.field]: s.direction }));
}
