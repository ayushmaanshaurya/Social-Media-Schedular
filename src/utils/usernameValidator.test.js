import { validateUsername, generateUsernamesuggestions } from './usernameValidator';

describe('usernameValidator', () => {
  describe('validateUsername', () => {
    test('returns invalid when username is empty', () => {
      expect(validateUsername('')).toEqual({
        valid: false,
        error: 'Username is required',
      });
      expect(validateUsername(null)).toEqual({
        valid: false,
        error: 'Username is required',
      });
    });

    test('returns invalid when username is less than 3 characters', () => {
      expect(validateUsername('ab')).toEqual({
        valid: false,
        error: 'Username must be at least 3 characters',
      });
    });

    test('returns invalid when username exceeds 20 characters', () => {
      const longName = 'a'.repeat(21);
      expect(validateUsername(longName)).toEqual({
        valid: false,
        error: 'Username must be less than 20 characters',
      });
    });

    test('returns invalid when username contains special characters other than _ and -', () => {
      expect(validateUsername('user@123')).toEqual({
        valid: false,
        error: 'Only letters, numbers, underscores, and hyphens allowed',
      });
      expect(validateUsername('user name')).toEqual({
        valid: false,
        error: 'Only letters, numbers, underscores, and hyphens allowed',
      });
    });

    test('returns invalid when username has 3+ continuous same characters', () => {
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

    test('returns valid for acceptable usernames', () => {
      expect(validateUsername('valid_user-12')).toEqual({ valid: true, error: '' });
      expect(validateUsername('john_doe')).toEqual({ valid: true, error: '' });
    });
  });

  describe('generateUsernamesuggestions', () => {
    test('returns 3 suggestions', () => {
      const suggestions = generateUsernamesuggestions('baseName');
      expect(suggestions).toHaveLength(3);
    });

    test('replaces 3+ same characters with 2 characters if baseUsername is provided', () => {
      const suggestions = generateUsernamesuggestions('aaannneee');
      expect(suggestions[0]).toBe('aannee');
    });
  });
});
