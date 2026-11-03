import { validateUsername, generateUsernamesuggestions } from './usernameValidator';

describe('validateUsername', () => {
  test('returns error for empty username', () => {
    const res = validateUsername('');
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Username is required');
  });

  test('returns error for username less than 3 characters', () => {
    const res = validateUsername('ab');
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Username must be at least 3 characters');
  });

  test('returns error for username greater than 20 characters', () => {
    const res = validateUsername('abcdefghijklmnopqrstuvw');
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Username must be less than 20 characters');
  });

  test('returns error for invalid characters', () => {
    const res = validateUsername('user@name!');
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Only letters, numbers, underscores, and hyphens allowed');
  });

  test('returns error for 3+ repeated continuous characters', () => {
    const res = validateUsername('user111');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Cannot have 3+ continuous same characters');
  });

  test('returns valid for correct username', () => {
    const res = validateUsername('valid_user-123');
    expect(res.valid).toBe(true);
    expect(res.error).toBe('');
  });
});

describe('generateUsernamesuggestions', () => {
  test('generates suggestions list', () => {
    const suggestions = generateUsernamesuggestions('mytestuser');
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });
});
