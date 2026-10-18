import {
  generateGradientImage,
  generateAvatarPlaceholder,
  generateRandomAvatar,
} from "./imageGenerator";

describe("imageGenerator utils", () => {
  beforeEach(() => {
    const mockCtx = {
      createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillText: jest.fn(),
    };

    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => mockCtx);
    jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(() => "data:image/jpeg;base64,mockdata");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("generateGradientImage produces data URL", () => {
    const dataUrl = generateGradientImage("Sunset beach", "1024x1024");
    expect(typeof dataUrl).toBe("string");
    expect(dataUrl).toContain("data:image/jpeg");
  });

  test("generateAvatarPlaceholder produces data URL for styles", () => {
    const cartoon = generateAvatarPlaceholder("cartoon", 123);
    expect(typeof cartoon).toBe("string");
    expect(cartoon).toContain("data:image/jpeg");
  });

  test("generateRandomAvatar produces data URL", () => {
    const avatar = generateRandomAvatar(456);
    expect(typeof avatar).toBe("string");
    expect(avatar).toContain("data:image/jpeg");
  });
});
