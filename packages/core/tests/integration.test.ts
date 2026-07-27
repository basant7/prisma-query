import { describe, it, expect } from 'vitest';
import { prismaQuery } from '../src/index';

describe('prismaQuery - Simple API', () => {
  it('parses basic pagination', () => {
    const req = { query: { page: '2', limit: '10' } };
    const result = prismaQuery(req);
    expect(result.pagination).toEqual({ page: 2, limit: 10, skip: 10 });
  });

  it('parses sorting', () => {
    const req = { query: { sort: '-createdAt,name' } };
    const result = prismaQuery(req, { sortable: ['createdAt', 'name'] });
    expect(result.sort).toEqual([
      { field: 'createdAt', direction: 'desc' },
      { field: 'name', direction: 'asc' },
    ]);
  });

  it('parses filters', () => {
    const req = { query: { 'status[equals]': 'ACTIVE', 'age[gte]': '18' } };
    const result = prismaQuery(req, { filterable: ['status', 'age'] });
    expect(result.filters).toEqual({
      status: { equals: 'ACTIVE' },
      age: { gte: 18 },
    });
  });

  it('parses search', () => {
    const req = { query: { search: 'john' } };
    const result = prismaQuery(req, { searchable: ['name', 'email'] });
    expect(result.search).toEqual({
      OR: [
        { name: { contains: 'john', mode: 'insensitive' } },
        { email: { contains: 'john', mode: 'insensitive' } },
      ],
    });
  });

  it('parses include', () => {
    const req = { query: { include: 'posts,profile' } };
    const result = prismaQuery(req, { includeable: ['posts', 'profile'] });
    expect(result.include).toEqual({ posts: true, profile: true });
  });

  it('parses select', () => {
    const req = { query: { fields: 'id,name,email' } };
    const result = prismaQuery(req, { selectable: ['id', 'name', 'email'] });
    expect(result.select).toEqual({ id: true, name: true, email: true });
  });

  it('combines all query types', () => {
    const req = {
      query: {
        page: '1',
        limit: '20',
        sort: '-createdAt',
        search: 'test',
        'status[equals]': 'ACTIVE',
        include: 'posts',
        fields: 'id,name',
      },
    };
    const result = prismaQuery(req, {
      sortable: ['createdAt'],
      searchable: ['name'],
      filterable: ['status'],
      includeable: ['posts'],
      selectable: ['id', 'name'],
    });
    expect(result.pagination.page).toBe(1);
    expect(result.sort).toHaveLength(1);
    expect(result.search).toBeDefined();
    expect(result.include).toBeDefined();
    expect(result.select).toBeDefined();
  });
});
