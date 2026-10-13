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
    test('returns default message when text is empty', () => {
      expect(generateCaption('')).toBe('Write something first! 💭');
      expect(generateCaption('   ')).toBe('Write something first! 💭');
    });

    test('formats text based on tone', () => {
      const casual = generateCaption('Hello World', 'casual');
      expect(casual).toContain('Quick thought 💭 Hello World #justsharing');

      const professional = generateCaption('Hello World', 'professional');
      expect(professional).toContain("Here's an insight worth sharing: Hello World #thoughtleadership");

      const viral = generateCaption('Hello World', 'viral');
      expect(viral).toContain("You won't believe this 👀 Hello World #trending #viral");
    });
  });

  describe('shortenCaption', () => {
    test('returns empty message if input is empty', () => {
      expect(shortenCaption('')).toBe('Text is empty');
    });

    test('returns original text if 15 words or fewer', () => {
      const text = 'This is a short caption';
      expect(shortenCaption(text)).toBe(text);
    });

    test('truncates text to 15 words with ellipsis if over 15 words', () => {
      const text = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen';
      const result = shortenCaption(text);
      expect(result.endsWith('...')).toBe(true);
      expect(result.split(' ').length).toBe(15);
    });
  });

  describe('addEmojis', () => {
    test('returns empty message if input is empty', () => {
      expect(addEmojis('')).toBe('Text is empty');
    });

    test('replaces known words with emojis', () => {
      const text = 'I am happy and love coding';
      const result = addEmojis(text);
      expect(result).toContain('😊');
      expect(result).toContain('❤️');
    });

    test('appends fallback emoji if no words matched', () => {
      const text = 'xyz abc';
      const result = addEmojis(text);
      expect(result).toBe('xyz abc ✨');
    });
  });

  describe('rewriteCaption', () => {
    test('returns empty message if input is empty', () => {
      expect(rewriteCaption('')).toBe('Text is empty');
    });

    test('returns rewritten variation containing original text', () => {
      const text = 'My creative post';
      const result = rewriteCaption(text);
      expect(result).toContain(text);
    });
  });

  describe('generateHashtags', () => {
    test('returns fallback hashtags if text is empty', () => {
      expect(generateHashtags('')).toBe('#socialmedia #content #creation');
    });

    test('returns requested count of hashtags', () => {
      const result = generateHashtags('Any post text', 3);
      const hashtags = result.split(' ');
      expect(hashtags.length).toBe(3);
      hashtags.forEach(tag => expect(tag.startsWith('#')).toBe(true));
    });
  });

  describe('optimizeCaption', () => {
    test('returns empty message if input is empty', () => {
      expect(optimizeCaption('')).toBe('Text is empty');
    });

    test('capitalizes first letter and formats sentences', () => {
      const text = 'first sentence. Second sentence. Third sentence.';
      const result = optimizeCaption(text);
      expect(result.startsWith('First sentence.')).toBe(true);
      expect(result).toContain('✨');
    });
  });
});
