import { describe, it, expect } from 'vitest';
import { parseSort, buildPrismaSort } from '../src/sort';

describe('parseSort', () => {
  const sortable = ['name', 'createdAt', 'age', 'price'];

  it('parses ascending sort', () => {
    const params = { sort: 'name' };
    const result = parseSort(params, sortable);
    expect(result).toEqual([{ field: 'name', direction: 'asc' }]);
  });

  it('parses descending sort with dash prefix', () => {
    const params = { sort: '-createdAt' };
    const result = parseSort(params, sortable);
    expect(result).toEqual([{ field: 'createdAt', direction: 'desc' }]);
  });

  it('parses ascending sort with plus prefix', () => {
    const params = { sort: '+name' };
    const result = parseSort(params, sortable);
    expect(result).toEqual([{ field: 'name', direction: 'asc' }]);
  });

  it('parses multiple sort fields', () => {
    const params = { sort: 'name,-createdAt,price' };
    const result = parseSort(params, sortable);
    expect(result).toEqual([
      { field: 'name', direction: 'asc' },
      { field: 'createdAt', direction: 'desc' },
      { field: 'price', direction: 'asc' },
    ]);
  });

  it('ignores non-sortable fields', () => {
    const params = { sort: 'password' };
    const result = parseSort(params, sortable);
    expect(result).toEqual([]);
  });

  it('uses default sort when no sort param', () => {
    const params = {};
    const result = parseSort(params, sortable, '-createdAt');
    expect(result).toEqual([{ field: 'createdAt', direction: 'desc' }]);
  });

  it('handles empty sortable array', () => {
    const params = { sort: 'name' };
    const result = parseSort(params, []);
    expect(result).toEqual([]);
  });
});

describe('buildPrismaSort', () => {
  it('builds sort object', () => {
    const sort = [
      { field: 'name', direction: 'asc' as const },
      { field: 'createdAt', direction: 'desc' as const },
    ];
    const result = buildPrismaSort(sort);
    expect(result).toEqual([{ name: 'asc' }, { createdAt: 'desc' }]);
  });

  it('handles empty sort', () => {
    const result = buildPrismaSort([]);
    expect(result).toEqual([]);
  });
});
