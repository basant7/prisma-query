import { describe, it, expect } from 'vitest';
import { parsePagination } from '../src/pagination';

describe('parsePagination', () => {
  it('parses page and limit', () => {
    const params = { page: '2', limit: '10' };
    const result = parsePagination(params);
    expect(result).toEqual({ page: 2, limit: 10, skip: 10 });
  });

  it('uses defaults when no params', () => {
    const result = parsePagination({});
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });

  it('respects max limit', () => {
    const params = { limit: '1000' };
    const result = parsePagination(params, { maxLimit: 100 });
    expect(result).toEqual({ page: 1, limit: 100, skip: 0 });
  });

  it('enforces minimum limit of 1', () => {
    const params = { limit: '0' };
    const result = parsePagination(params);
    expect(result.limit).toBe(1);
  });

  it('enforces minimum page of 1', () => {
    const params = { page: '0' };
    const result = parsePagination(params);
    expect(result.page).toBe(1);
  });

  it('handles negative page', () => {
    const params = { page: '-5' };
    const result = parsePagination(params);
    expect(result.page).toBe(1);
  });

  it('calculates skip correctly', () => {
    const params = { page: '5', limit: '20' };
    const result = parsePagination(params);
    expect(result.skip).toBe(80);
  });

  it('handles non-numeric values', () => {
    const params = { page: 'abc', limit: 'xyz' };
    const result = parsePagination(params);
    expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
  });
});
