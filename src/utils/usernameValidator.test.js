import { validateUsername } from './usernameValidator';

describe('validateUsername', () => {
  test('returns error for empty username', () => {
    expect(validateUsername('')).toEqual({ valid: false, error: 'Username is required' });
    expect(validateUsername(null)).toEqual({ valid: false, error: 'Username is required' });
  });

  test('returns error for username shorter than 3 characters', () => {
    expect(validateUsername('ab')).toEqual({ valid: false, error: 'Username must be at least 3 characters' });
  });

  test('returns error for username longer than 20 characters', () => {
    expect(validateUsername('a'.repeat(21))).toEqual({ valid: false, error: 'Username must be less than 20 characters' });
  });

  test('returns error for username containing invalid characters', () => {
    expect(validateUsername('user@123')).toEqual({
      valid: false,
      error: 'Only letters, numbers, underscores, and hyphens allowed',
    });
    expect(validateUsername('user 123')).toEqual({
      valid: false,
      error: 'Only letters, numbers, underscores, and hyphens allowed',
    });
  });

  test('returns error for 3+ continuous same characters', () => {
    expect(validateUsername('aauser')).toEqual({ valid: true, error: '' });
    expect(validateUsername('aaauser')).toEqual({
      valid: false,
      error: "❌ Cannot have 3+ continuous same characters (e.g., 'aaa', '111')",
    });
    expect(validateUsername('user111')).toEqual({
      valid: false,
      error: "❌ Cannot have 3+ continuous same characters (e.g., 'aaa', '111')",
    });
  });

  test('returns valid for proper usernames', () => {
    expect(validateUsername('john_doe')).toEqual({ valid: true, error: '' });
    expect(validateUsername('user-123')).toEqual({ valid: true, error: '' });
    expect(validateUsername('Alex99')).toEqual({ valid: true, error: '' });
  });
});
