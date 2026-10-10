import { validateUsername, generateUsernamesuggestions } from './usernameValidator';

describe('usernameValidator', () => {
  describe('validateUsername', () => {
    test('returns invalid when username is empty', () => {
      const result = validateUsername('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    test('returns invalid when username is under 3 characters', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    test('returns invalid when username is over 20 characters', () => {
      const result = validateUsername('a'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be less than 20 characters');
    });

    test('returns invalid when username contains special characters', () => {
      const result = validateUsername('user@name!');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only letters, numbers, underscores, and hyphens allowed');
    });

    test('returns invalid when username has 3+ repetitive consecutive characters', () => {
      const result = validateUsername('user111');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Cannot have 3+ continuous same characters');
    });

    test('returns valid for acceptable usernames', () => {
      const result = validateUsername('valid_user-123');
      expect(result.valid).toBe(true);
      expect(result.error).toBe('');
    });
  });

  describe('generateUsernamesuggestions', () => {
    test('generates suggestions with baseUsername', () => {
      const suggestions = generateUsernamesuggestions('aaaUser');
      expect(suggestions.length).toBeLessThanOrEqual(3);
      expect(suggestions[0]).toBe('aaUser');
    });

    test('generates suggestions without baseUsername', () => {
      const suggestions = generateUsernamesuggestions();
      expect(suggestions.length).toBeLessThanOrEqual(3);
      expect(typeof suggestions[0]).toBe('string');
    });
  });
});
