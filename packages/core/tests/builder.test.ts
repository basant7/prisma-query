import { describe, it, expect } from 'vitest';
import { PrismaQueryBuilder } from '../src/builder';

describe('PrismaQueryBuilder', () => {
  it('builds query with all modules', () => {
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

    const query = new PrismaQueryBuilder(req, {
      sortable: ['createdAt'],
      searchable: ['name'],
      filterable: ['status'],
      includeable: ['posts'],
      selectable: ['id', 'name'],
    })
      .addPagination()
      .addSort()
      .addSearch()
      .addFilters()
      .addInclude()
      .addSelect()
      .build();

    expect(query.pagination.page).toBe(1);
    expect(query.sort).toHaveLength(1);
    expect(query.search).toBeDefined();
    expect(query.filters).toBeDefined();
    expect(query.include).toBeDefined();
    expect(query.select).toBeDefined();
  });

  it('builds minimal query', () => {
    const req = { query: { page: '3' } };
    const query = new PrismaQueryBuilder(req).addPagination().build();
    expect(query.pagination.page).toBe(3);
    expect(query.sort).toEqual([]);
    expect(query.filters).toEqual({});
  });

  it('provides defaults when no modules added', () => {
    const req = {};
    const query = new PrismaQueryBuilder(req).build();
    expect(query.pagination).toEqual({ page: 1, limit: 20, skip: 0 });
    expect(query.sort).toEqual([]);
    expect(query.filters).toEqual({});
  });
});
