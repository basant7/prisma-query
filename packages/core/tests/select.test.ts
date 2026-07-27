import { describe, it, expect } from 'vitest';
import { parseSelect } from '../src/select';

describe('parseSelect', () => {
  const selectable = ['id', 'name', 'email', 'password'];

  it('parses select fields', () => {
    const params = { fields: 'id,name,email' };
    const result = parseSelect(params, selectable);
    expect(result).toEqual({ id: true, name: true, email: true });
  });

  it('ignores non-selectable fields', () => {
    const params = { fields: 'id,name,secretToken' };
    const result = parseSelect(params, selectable);
    expect(result).toEqual({ id: true, name: true });
  });

  it('returns undefined when no fields param', () => {
    const result = parseSelect({}, selectable);
    expect(result).toBeUndefined();
  });

  it('returns undefined when no selectable fields', () => {
    const params = { fields: 'id,name' };
    const result = parseSelect(params, []);
    expect(result).toBeUndefined();
  });

  it('handles single field', () => {
    const params = { fields: 'id' };
    const result = parseSelect(params, selectable);
    expect(result).toEqual({ id: true });
  });
});
