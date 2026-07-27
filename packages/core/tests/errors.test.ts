import { describe, it, expect } from 'vitest';
import { validateFields } from '../src/utils/security';
import { QueryValidationError } from '../src/errors';

describe('validateFields', () => {
  it('passes valid fields', () => {
    const result = validateFields(['name', 'email'], ['name', 'email', 'age'], 'sort');
    expect(result).toEqual(['name', 'email']);
  });

  it('throws on invalid fields', () => {
    expect(() =>
      validateFields(['password'], ['name', 'email'], 'filter'),
    ).toThrow(QueryValidationError);
  });

  it('allows all fields when allowed array is empty', () => {
    const result = validateFields(['any', 'field'], [], 'sort');
    expect(result).toEqual(['any', 'field']);
  });
});

describe('QueryValidationError', () => {
  it('has correct properties', () => {
    const error = new QueryValidationError('test message', 'TEST_CODE', 'field');
    expect(error.message).toBe('test message');
    expect(error.code).toBe('TEST_CODE');
    expect(error.field).toBe('field');
    expect(error.name).toBe('QueryValidationError');
  });
});
