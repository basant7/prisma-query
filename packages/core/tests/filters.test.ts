import { describe, it, expect } from 'vitest';
import { parseFilters, buildPrismaFilters } from '../src/filters';

describe('parseFilters', () => {
  const filterable = ['status', 'age', 'role', 'name', 'price', 'email'];

  it('parses simple equals filter', () => {
    const params = { status: 'ACTIVE' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ status: { equals: 'ACTIVE' } });
  });

  it('parses comparison operators', () => {
    const params = { 'age[gte]': '18', 'age[lte]': '65' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ age: { gte: 18, lte: 65 } });
  });

  it('parses in operator', () => {
    const params = { 'status[in]': 'ACTIVE,PENDING' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ status: { in: ['ACTIVE', 'PENDING'] } });
  });

  it('parses contains operator', () => {
    const params = { 'name[contains]': 'john' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ name: { contains: 'john' } });
  });

  it('parses startsWith operator', () => {
    const params = { 'email[startsWith]': 'a' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ email: { startsWith: 'a' } });
  });

  it('parses endsWith operator', () => {
    const params = { 'email[endsWith]': '@example.com' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ email: { endsWith: '@example.com' } });
  });

  it('parses not operator', () => {
    const params = { 'status[not]': 'BLOCKED' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ status: { not: 'BLOCKED' } });
  });

  it('parses numeric values', () => {
    const params = { 'price[gt]': '100' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({ price: { gt: 100 } });
  });

  it('parses boolean values', () => {
    const params = { 'active[equals]': 'true' };
    const result = parseFilters(params, ['active']);
    expect(result).toEqual({ active: { equals: true } });
  });

  it('ignores non-filterable fields', () => {
    const params = { 'password[hash]': 'abc' };
    const result = parseFilters(params, filterable);
    expect(result).toEqual({});
  });

  it('handles empty params', () => {
    const result = parseFilters({}, filterable);
    expect(result).toEqual({});
  });
});

describe('buildPrismaFilters', () => {
  it('builds simple equals', () => {
    const filters = { status: { equals: 'ACTIVE' } };
    const result = buildPrismaFilters(filters);
    expect(result).toEqual({ status: 'ACTIVE' });
  });

  it('builds complex conditions', () => {
    const filters = { age: { gte: 18, lte: 65 } };
    const result = buildPrismaFilters(filters);
    expect(result).toEqual({ age: { gte: 18, lte: 65 } });
  });

  it('builds in operator', () => {
    const filters = { status: { in: ['ACTIVE', 'PENDING'] } };
    const result = buildPrismaFilters(filters);
    expect(result).toEqual({ status: { in: ['ACTIVE', 'PENDING'] } });
  });
});
