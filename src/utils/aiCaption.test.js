import {
  generateCaption,
  shortenCaption,
  addEmojis,
  rewriteCaption,
  generateHashtags,
  optimizeCaption,
} from './aiCaption';

describe('aiCaption utilities', () => {
  describe('generateCaption', () => {
    test('handles empty text', () => {
      expect(generateCaption('')).toBe('Write something first! 💭');
      expect(generateCaption('   ')).toBe('Write something first! 💭');
    });

    test('generates caption for different tones', () => {
      const text = 'Launching our new feature today';
      expect(generateCaption(text, 'professional')).toContain("Here's an insight worth sharing: Launching our new feature today #thoughtleadership");
      expect(generateCaption(text, 'casual')).toContain('Quick thought 💭 Launching our new feature today #justsharing');
      expect(generateCaption(text, 'viral')).toContain("You won't believe this 👀 Launching our new feature today #trending #viral");
    });
  });

  describe('shortenCaption', () => {
    test('handles empty text', () => {
      expect(shortenCaption('')).toBe('Text is empty');
    });

    test('does not shorten text with 15 words or fewer', () => {
      const shortText = 'One two three four five six seven eight nine ten';
      expect(shortenCaption(shortText)).toBe(shortText);
    });

    test('shortens text longer than 15 words and appends ellipsis', () => {
      const longText = 'Word '.repeat(20).trim();
      const result = shortenCaption(longText);
      expect(result.endsWith('...')).toBe(true);
      expect(result.split(' ')).toHaveLength(15);
    });
  });

  describe('addEmojis', () => {
    test('handles empty text', () => {
      expect(addEmojis('')).toBe('Text is empty');
    });

    test('replaces matching keywords with emojis', () => {
      const text = 'We are happy with our success and rocket growth';
      const result = addEmojis(text);
      expect(result).toContain('😊');
      expect(result).toContain('✨');
      expect(result).toContain('🚀');
      expect(result).toContain('📈');
    });

    test('appends default emoji if no keywords match', () => {
      const text = 'Plain text without special keywords';
      expect(addEmojis(text)).toBe('Plain text without special keywords ✨');
    });
  });

  describe('rewriteCaption', () => {
    test('handles empty text', () => {
      expect(rewriteCaption('')).toBe('Text is empty');
    });

    test('returns rewritten caption containing original text', () => {
      const text = 'New update coming soon';
      const result = rewriteCaption(text);
      expect(result).toContain('New update coming soon');
    });
  });

  describe('generateHashtags', () => {
    test('handles empty text', () => {
      expect(generateHashtags('')).toBe('#socialmedia #content #creation');
    });

    test('returns specified count of hashtags', () => {
      const hashtags = generateHashtags('Any post content', 3);
      const tagsArray = hashtags.split(' ');
      expect(tagsArray).toHaveLength(3);
      tagsArray.forEach((tag) => expect(tag.startsWith('#')).toBe(true));
    });
  });

  describe('optimizeCaption', () => {
    test('handles empty text', () => {
      expect(optimizeCaption('')).toBe('Text is empty');
    });

    test('capitalizes first letter and formats text', () => {
      const text = 'hello world. this is a test sentence.';
      const result = optimizeCaption(text);
      expect(result.startsWith('H')).toBe(true);
      expect(result).toContain('✨');
    });
  });
});
