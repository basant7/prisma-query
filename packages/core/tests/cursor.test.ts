import { describe, it, expect } from 'vitest';
import { parseCursorPagination } from '../src/cursor';

describe('parseCursorPagination', () => {
  it('parses cursor', () => {
    const params = { cursor: 'abc123' };
    const result = parseCursorPagination(params);
    expect(result).toEqual({ cursor: 'abc123', take: 20 });
  });

  it('returns undefined when no cursor', () => {
    const result = parseCursorPagination({});
    expect(result).toBeUndefined();
  });

  it('respects max limit', () => {
    const params = { cursor: 'abc', limit: '500' };
    const result = parseCursorPagination(params, { maxLimit: 100 });
    expect(result).toEqual({ cursor: 'abc', take: 100 });
  });

  it('uses custom default limit', () => {
    const params = { cursor: 'abc' };
    const result = parseCursorPagination(params, { limit: 50 });
    expect(result).toEqual({ cursor: 'abc', take: 50 });
  });
});
