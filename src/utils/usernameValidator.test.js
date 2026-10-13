import { validateUsername, generateUsernamesuggestions } from './usernameValidator';

describe('usernameValidator utility functions', () => {
  describe('validateUsername', () => {
    test('returns invalid for empty username', () => {
      expect(validateUsername('')).toEqual({
        valid: false,
        error: 'Username is required',
      });
    });

    test('returns invalid for short username (< 3 chars)', () => {
      expect(validateUsername('ab')).toEqual({
        valid: false,
        error: 'Username must be at least 3 characters',
      });
    });

    test('returns invalid for long username (> 20 chars)', () => {
      expect(validateUsername('a'.repeat(21))).toEqual({
        valid: false,
        error: 'Username must be less than 20 characters',
      });
    });

    test('returns invalid for invalid characters', () => {
      expect(validateUsername('user@name!')).toEqual({
        valid: false,
        error: 'Only letters, numbers, underscores, and hyphens allowed',
      });
    });

    test('returns invalid for 3+ repeating continuous characters', () => {
      expect(validateUsername('aauser')).toEqual({
        valid: true,
        error: '',
      });
      expect(validateUsername('aaauser')).toEqual({
        valid: false,
        error: "❌ Cannot have 3+ continuous same characters (e.g., 'aaa', '111')",
      });
    });

    test('returns valid for good usernames', () => {
      expect(validateUsername('valid_user-123')).toEqual({
        valid: true,
        error: '',
      });
    });
  });

  describe('generateUsernamesuggestions', () => {
    test('returns 3 suggestions without base username', () => {
      const suggestions = generateUsernamesuggestions('');
      expect(suggestions.length).toBe(3);
    });

    test('includes cleaned base username when baseUsername provided', () => {
      const suggestions = generateUsernamesuggestions('aaabuser');
      expect(suggestions.length).toBe(3);
      expect(suggestions[0]).toBe('aabuser');
    });
  });
});
