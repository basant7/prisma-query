import type { QueryConfig } from '../types';
import { QueryValidationError } from '../errors';

export function validateFields(
  requested: string[],
  allowed: string[],
  type: 'sort' | 'filter' | 'include' | 'select' | 'search',
): string[] {
  if (allowed.length === 0) return requested;

  const allowedSet = new Set(allowed);
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const field of requested) {
    if (allowedSet.has(field)) {
      valid.push(field);
    } else {
      invalid.push(field);
    }
  }

  if (invalid.length > 0) {
    throw new QueryValidationError(
      `Invalid ${type} field(s): ${invalid.join(', ')}. Allowed: ${allowed.join(', ')}`,
      `INVALID_${type.toUpperCase()}_FIELD`,
    );
  }

  return valid;
}

export function sanitizeParams(
  params: Record<string, string>,
  config: QueryConfig,
): Record<string, string> {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      sanitized[key] = value;
    }
  }

  void config;
  return sanitized;
}
