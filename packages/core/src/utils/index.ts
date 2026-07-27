export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isEmptyObject(value: unknown): boolean {
  return isObject(value) && Object.keys(value).length === 0;
}

export function pick<T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result as Partial<T>;
}

export function omit<T extends Record<string, unknown>>(
  obj: T,
  keys: string[],
): Partial<T> {
  const result: Record<string, unknown> = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Partial<T>;
}

export function mergeWhere(
  ...whereClauses: Array<Record<string, unknown>>
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};

  for (const clause of whereClauses) {
    for (const [key, value] of Object.entries(clause)) {
      if (key === 'AND') {
        const existing = merged['AND'];
        const items = Array.isArray(value) ? value : [value];
        if (Array.isArray(existing)) {
          existing.push(...items);
        } else {
          merged['AND'] = [...items];
        }
      } else if (key === 'OR') {
        const existing = merged['OR'];
        const items = Array.isArray(value) ? value : [value];
        if (Array.isArray(existing)) {
          existing.push(...items);
        } else {
          merged['OR'] = [...items];
        }
      } else {
        merged[key] = value;
      }
    }
  }

  return merged;
}
