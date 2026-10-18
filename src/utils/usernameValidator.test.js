import { validateUsername, generateUsernamesuggestions } from "./usernameValidator";

describe("usernameValidator", () => {
  test("validates username correctly", () => {
    expect(validateUsername("").valid).toBe(false);
    expect(validateUsername("ab").valid).toBe(false);
    expect(validateUsername("thisusernameiswaytoolongtobevalid").valid).toBe(false);
    expect(validateUsername("invalid@user").valid).toBe(false);
    expect(validateUsername("aaa_user").valid).toBe(false); // 3+ repeating chars

    expect(validateUsername("valid_user").valid).toBe(true);
    expect(validateUsername("john_doe123").valid).toBe(true);
  });

  test("generates username suggestions", () => {
    const suggestions = generateUsernamesuggestions("testuser");
    expect(Array.isArray(suggestions)).toBe(true);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });
});
