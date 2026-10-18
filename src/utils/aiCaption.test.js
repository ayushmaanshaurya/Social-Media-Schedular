import {
  generateCaption,
  shortenCaption,
  addEmojis,
  rewriteCaption,
  generateHashtags,
  optimizeCaption,
} from "./aiCaption";

describe("aiCaption utils", () => {
  test("generateCaption formats text according to tone", () => {
    expect(generateCaption("", "casual")).toContain("Write something first");

    const prof = generateCaption("Product launch tomorrow", "professional");
    expect(prof).toContain("Product launch tomorrow");
    expect(prof).toContain("thoughtleadership");

    const casual = generateCaption("Coffee time", "casual");
    expect(casual).toContain("Coffee time");

    const viral = generateCaption("Unbelievable news", "viral");
    expect(viral).toContain("Unbelievable news");
    expect(viral).toContain("viral");
  });

  test("shortenCaption truncates long captions", () => {
    expect(shortenCaption("")).toBe("Text is empty");
    expect(shortenCaption("Short text")).toBe("Short text");

    const longText = "word ".repeat(20).trim();
    const shortened = shortenCaption(longText);
    expect(shortened).toContain("...");
  });

  test("addEmojis adds emojis to text", () => {
    expect(addEmojis("")).toBe("Text is empty");
    const result = addEmojis("I love success and focus");
    expect(result).toMatch(/[\u1F300-\u1F9FF]|[\u2600-\u26FF]|❤️|✨/);
  });

  test("rewriteCaption provides alternate text phrasing", () => {
    expect(rewriteCaption("")).toBe("Text is empty");
    const rewritten = rewriteCaption("Build in public");
    expect(rewritten).toContain("Build in public");
  });

  test("generateHashtags returns hashtag string", () => {
    const hashtags = generateHashtags("My new project", 3);
    expect(hashtags).toContain("#");
    expect(hashtags.split(" ").length).toBe(3);
  });

  test("optimizeCaption formats caption text", () => {
    expect(optimizeCaption("")).toBe("Text is empty");
    const optimized = optimizeCaption("hello world. check this out");
    expect(optimized).toBeTruthy();
    expect(optimized.charAt(0)).toBe("H");
  });
});
