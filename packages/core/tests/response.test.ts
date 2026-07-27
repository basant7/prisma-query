import { describe, it, expect } from 'vitest';
import { response, createResponse, createCursorResponse, buildResponseMeta } from '../src/response';

describe('buildResponseMeta', () => {
  it('calculates metadata correctly', () => {
    const result = buildResponseMeta(100, { page: 2, limit: 20, skip: 20 });
    expect(result).toEqual({
      page: 2,
      limit: 20,
      total: 100,
      pages: 5,
      next: 3,
      previous: 1,
      hasNext: true,
      hasPrevious: true,
    });
  });

  it('handles first page', () => {
    const result = buildResponseMeta(50, { page: 1, limit: 20, skip: 0 });
    expect(result.hasNext).toBe(true);
    expect(result.hasPrevious).toBe(false);
    expect(result.previous).toBeNull();
  });

  it('handles last page', () => {
    const result = buildResponseMeta(50, { page: 3, limit: 20, skip: 40 });
    expect(result.hasNext).toBe(false);
    expect(result.hasPrevious).toBe(true);
    expect(result.next).toBeNull();
  });

  it('handles empty data', () => {
    const result = buildResponseMeta(0, { page: 1, limit: 20, skip: 0 });
    expect(result.pages).toBe(0);
    expect(result.hasNext).toBe(false);
  });
});

describe('createResponse', () => {
  it('creates success response', () => {
    const data = [{ id: 1, name: 'John' }];
    const result = createResponse(data, 1, { page: 1, limit: 20, skip: 0 });
    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
    expect(result.meta.page).toBe(1);
  });
});

describe('createCursorResponse', () => {
  it('creates cursor response', () => {
    const data = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ];
    const result = createCursorResponse(
      data,
      { cursor: undefined, take: 20 },
      true,
      (item) => item.id,
    );
    expect(result.success).toBe(true);
    expect(result.meta.nextCursor).toBe('2');
    expect(result.meta.hasNext).toBe(true);
    expect(result.meta.hasPrevious).toBe(false);
  });
});

describe('response function', () => {
  it('returns paginated response', () => {
    const query = {
      pagination: { page: 1, limit: 20, skip: 0 },
      sort: [],
      filters: {},
      raw: {},
    };
    const data = [{ id: 1 }];
    const result = response(query, data, 50);
    expect(result.meta.page).toBe(1);
    expect(result.meta.total).toBe(50);
  });

  it('returns cursor response when cursor present', () => {
    const query = {
      pagination: { page: 1, limit: 20, skip: 0 },
      cursor: { cursor: 'abc', take: 20 },
      sort: [],
      filters: {},
      raw: {},
    };
    const data = [{ id: 1 }];
    const result = response(query, data, 50);
    expect('nextCursor' in result.meta).toBe(true);
  });
});
