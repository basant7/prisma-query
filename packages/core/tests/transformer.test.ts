import { describe, it, expect } from 'vitest';
import { toPrismaQuery } from '../src/transformer';
import type { ParsedQuery } from '../src/types';

describe('toPrismaQuery', () => {
  it('transforms pagination', () => {
    const query: ParsedQuery = {
      pagination: { page: 2, limit: 20, skip: 20 },
      sort: [],
      filters: {},
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.skip).toBe(20);
    expect(result.take).toBe(20);
  });

  it('transforms sort', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [
        { field: 'createdAt', direction: 'desc' },
        { field: 'name', direction: 'asc' },
      ],
      filters: {},
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.orderBy).toEqual([{ createdAt: 'desc' }, { name: 'asc' }]);
  });

  it('transforms filters', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: { status: { equals: 'ACTIVE' } },
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.where).toEqual({ status: 'ACTIVE' });
  });

  it('transforms search', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: {},
      search: {
        OR: [{ name: { contains: 'john', mode: 'insensitive' } }],
      },
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.where).toEqual({
      name: { contains: 'john', mode: 'insensitive' },
    });
  });

  it('combines filters and search', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: { status: { equals: 'ACTIVE' } },
      search: {
        OR: [{ name: { contains: 'john', mode: 'insensitive' } }],
      },
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.where).toEqual({
      AND: [
        { status: 'ACTIVE' },
        { name: { contains: 'john', mode: 'insensitive' } },
      ],
    });
  });

  it('transforms include', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: {},
      include: { posts: true, profile: true },
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.include).toEqual({ posts: true, profile: true });
  });

  it('transforms select', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: {},
      select: { id: true, name: true },
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.select).toEqual({ id: true, name: true });
  });

  it('handles cursor pagination', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      cursor: { cursor: 'abc123', take: 20 },
      sort: [],
      filters: {},
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.take).toBe(20);
    expect(result.skip).toBeUndefined();
  });

  it('handles soft delete config', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: {},
      raw: {},
    };
    const result = toPrismaQuery(query, {
      softDelete: true,
      softDeleteField: 'deletedAt',
    });
    expect(result.where).toEqual({ deletedAt: null });
  });

  it('returns empty object for empty query', () => {
    const query: ParsedQuery = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: {},
      raw: {},
    };
    const result = toPrismaQuery(query);
    expect(result.where).toBeUndefined();
    expect(result.orderBy).toBeUndefined();
    expect(result.include).toBeUndefined();
    expect(result.select).toBeUndefined();
  });
});
