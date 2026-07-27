import { describe, it, expect } from 'vitest';
import { mergeWhere, pick, omit, isNumber, isString, isObject, isEmptyObject } from '../src/utils';

describe('mergeWhere', () => {
  it('merges simple objects', () => {
    const result = mergeWhere({ status: 'ACTIVE' }, { age: { gte: 18 } });
    expect(result).toEqual({ status: 'ACTIVE', age: { gte: 18 } });
  });

  it('merges AND clauses', () => {
    const result = mergeWhere(
      { AND: [{ status: 'ACTIVE' }] },
      { AND: [{ age: { gte: 18 } }] },
    );
    expect(result.AND).toEqual([{ status: 'ACTIVE' }, { age: { gte: 18 } }]);
  });

  it('merges OR clauses', () => {
    const result = mergeWhere(
      { OR: [{ status: 'ACTIVE' }] },
      { OR: [{ role: 'ADMIN' }] },
    );
    expect(result.OR).toEqual([{ status: 'ACTIVE' }, { role: 'ADMIN' }]);
  });

  it('handles empty input', () => {
    const result = mergeWhere();
    expect(result).toEqual({});
  });
});

describe('pick', () => {
  it('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = pick(obj, ['a', 'c']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('ignores non-existent keys', () => {
    const obj = { a: 1 };
    const result = pick(obj, ['a', 'z']);
    expect(result).toEqual({ a: 1 });
  });
});

describe('omit', () => {
  it('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('handles non-existent keys', () => {
    const obj = { a: 1 };
    const result = omit(obj, ['z']);
    expect(result).toEqual({ a: 1 });
  });
});

describe('type guards', () => {
  it('isNumber works', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber('42')).toBe(false);
  });

  it('isString works', () => {
    expect(isString('hello')).toBe(true);
    expect(isString(42)).toBe(false);
  });

  it('isObject works', () => {
    expect(isObject({})).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
  });

  it('isEmptyObject works', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ a: 1 })).toBe(false);
  });
});
