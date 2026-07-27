import type { HttpRequest, QueryConfig } from '../types';

export function extractQueryParams(req: HttpRequest): Record<string, string> {
  const params: Record<string, string> = {};

  if (req.query) {
    if (typeof (req.query as Record<string, unknown>)['forEach'] === 'function') {
      (req.query as { forEach: (cb: (value: string, key: string) => void) => void }).forEach((value: string, key: string) => {
        params[key] = value;
      });
    } else {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          params[key] = value;
        } else if (Array.isArray(value)) {
          params[key] = value.join(',');
        } else if (value !== null && value !== undefined) {
          params[key] = String(value);
        }
      }
    }
  }

  return params;
}

export function parseRawQuery(
  params: Record<string, string>,
  config: QueryConfig,
): Record<string, string> {
  const raw: Record<string, string> = {};
  const reservedKeys = new Set([
    'page',
    'limit',
    'cursor',
    'sort',
    'search',
    'q',
    'include',
    'fields',
    'distinct',
    'groupBy',
    'or',
    'and',
    'not',
  ]);

  for (const [key, value] of Object.entries(params)) {
    if (!reservedKeys.has(key) && !key.includes('[') && !key.includes('.')) {
      raw[key] = value;
    }
  }

  void config;
  return raw;
}
