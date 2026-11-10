import { generateCaption, shortenCaption } from './aiCaption';

describe('generateCaption', () => {
  test('returns placeholder when text is empty or missing', () => {
    expect(generateCaption('')).toBe('Write something first! 💭');
    expect(generateCaption(null)).toBe('Write something first! 💭');
  });

  test('generates casual caption by default', () => {
    const result = generateCaption('Hello world');
    expect(result).toBe('Quick thought 💭 Hello world #justsharing');
  });

  test('generates professional caption when tone is professional', () => {
    const result = generateCaption('Hello world', 'professional');
    expect(result).toBe("Here's an insight worth sharing: Hello world #thoughtleadership");
  });

  test('generates viral caption when tone is viral', () => {
    const result = generateCaption('Hello world', 'viral');
    expect(result).toBe("You won't believe this 👀 Hello world #trending #viral");
  });
});

describe('shortenCaption', () => {
  test('returns error string when text is empty', () => {
    expect(shortenCaption('')).toBe('Text is empty');
  });

  test('returns original text if 15 words or fewer', () => {
    const text = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen';
    expect(shortenCaption(text)).toBe(text);
  });

  test('shortens text to 15 words with ellipsis if over 15 words', () => {
    const text = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen';
    const expected = 'One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen...';
    expect(shortenCaption(text)).toBe(expected);
  });
});
