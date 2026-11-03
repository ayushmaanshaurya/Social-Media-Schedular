import {
  generateCaption,
  shortenCaption,
  addEmojis,
  rewriteCaption,
  generateHashtags,
  optimizeCaption,
} from './aiCaption';

describe('aiCaption utility functions', () => {
  describe('generateCaption', () => {
    test('returns default message if text is empty', () => {
      expect(generateCaption('')).toBe('Write something first! 💭');
    });

    test('formats caption according to requested tone', () => {
      const prof = generateCaption('Productivity tips', 'professional');
      expect(prof).toContain("Here's an insight worth sharing:");
      expect(prof).toContain('#thoughtleadership');

      const viral = generateCaption('Check this out', 'viral');
      expect(viral).toContain("You won't believe this 👀");
      expect(viral).toContain('#trending #viral');
    });
  });

  describe('shortenCaption', () => {
    test('returns original text if short', () => {
      expect(shortenCaption('Short text')).toBe('Short text');
    });

    test('truncates text with ellipsis if over 15 words', () => {
      const longText = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen';
      const result = shortenCaption(longText);
      expect(result).toContain('...');
      expect(result).toBe('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen...');
    });
  });

  describe('addEmojis', () => {
    test('replaces matching keywords with emojis', () => {
      const text = 'Achieve success and reach your goal';
      const result = addEmojis(text);
      expect(result).toContain('✨');
      expect(result).toContain('🎯');
    });

    test('appends default emoji if no keywords match', () => {
      const text = 'Random text without keywords';
      expect(addEmojis(text)).toBe('Random text without keywords ✨');
    });
  });

  describe('rewriteCaption', () => {
    test('returns rewritten variation', () => {
      const res = rewriteCaption('Great news today');
      expect(res).toContain('Great news today');
    });
  });

  describe('generateHashtags', () => {
    test('returns default hashtags if text is empty', () => {
      expect(generateHashtags('')).toBe('#socialmedia #content #creation');
    });

    test('returns specified count of hashtags', () => {
      const tags = generateHashtags('Any text', 3);
      expect(tags.split(' ').length).toBe(3);
    });
  });

  describe('optimizeCaption', () => {
    test('capitalizes and formats text', () => {
      const opt = optimizeCaption('test sentence for social media post');
      expect(opt.charAt(0)).toBe('T');
      expect(opt).toContain('✨');
    });
  });
});
