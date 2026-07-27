import { describe, it, expect } from 'vitest';
import { parseInclude } from '../src/include';

describe('parseInclude', () => {
  const includeable = ['posts', 'profile', 'comments'];

  it('parses include fields', () => {
    const params = { include: 'posts,profile' };
    const result = parseInclude(params, includeable);
    expect(result).toEqual({ posts: true, profile: true });
  });

  it('ignores non-includeable fields', () => {
    const params = { include: 'posts,secretData' };
    const result = parseInclude(params, includeable);
    expect(result).toEqual({ posts: true });
  });

  it('returns undefined when no include param', () => {
    const result = parseInclude({}, includeable);
    expect(result).toBeUndefined();
  });

  it('returns undefined when no includeable fields', () => {
    const params = { include: 'posts' };
    const result = parseInclude(params, []);
    expect(result).toBeUndefined();
  });

  it('handles single field', () => {
    const params = { include: 'posts' };
    const result = parseInclude(params, includeable);
    expect(result).toEqual({ posts: true });
  });
});
