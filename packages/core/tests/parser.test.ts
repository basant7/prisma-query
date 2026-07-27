import { describe, it, expect } from 'vitest';
import { extractQueryParams, parseRawQuery } from '../src/parser';

describe('extractQueryParams', () => {
  it('extracts from plain object', () => {
    const req = { query: { page: '2', limit: '10', sort: '-createdAt' } };
    const result = extractQueryParams(req);
    expect(result).toEqual({ page: '2', limit: '10', sort: '-createdAt' });
  });

  it('extracts from URLSearchParams', () => {
    const params = new URLSearchParams('page=3&limit=20&search=john');
    const req = { query: params };
    const result = extractQueryParams(req);
    expect(result).toEqual({ page: '3', limit: '20', search: 'john' });
  });

  it('handles array values', () => {
    const req = { query: { tags: ['a', 'b', 'c'] } };
    const result = extractQueryParams(req);
    expect(result).toEqual({ tags: 'a,b,c' });
  });

  it('handles non-string values', () => {
    const req = { query: { page: 1, active: true } };
    const result = extractQueryParams(req);
    expect(result).toEqual({ page: '1', active: 'true' });
  });

  it('returns empty object for empty query', () => {
    const req = {};
    const result = extractQueryParams(req);
    expect(result).toEqual({});
  });
});

describe('parseRawQuery', () => {
  it('extracts non-reserved keys', () => {
    const params = { page: '1', customField: 'value', sort: 'name' };
    const result = parseRawQuery(params, {});
    expect(result).toEqual({ customField: 'value' });
  });

  it('excludes bracket notation keys', () => {
    const params = { 'age[gte]': '18', custom: 'val' };
    const result = parseRawQuery(params, {});
    expect(result).toEqual({ custom: 'val' });
  });

  it('excludes dot notation keys', () => {
    const params = { 'posts.title': 'node', custom: 'val' };
    const result = parseRawQuery(params, {});
    expect(result).toEqual({ custom: 'val' });
  });
});
