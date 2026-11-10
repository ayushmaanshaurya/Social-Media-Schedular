import {
  generateGradientImage,
  generateAvatarPlaceholder,
  generateRandomAvatar,
} from './imageGenerator';

describe('imageGenerator utility functions', () => {
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillText: jest.fn(),
    }));

    HTMLCanvasElement.prototype.toDataURL = jest.fn(
      () => 'data:image/jpeg;base64,mockImageData'
    );
  });

  test('generateGradientImage creates data URL for prompt and size', () => {
    const result = generateGradientImage('A sunset over mountains', '1024x1024');
    expect(result).toBe('data:image/jpeg;base64,mockImageData');
  });

  test('generateAvatarPlaceholder creates data URL for specific style and seed', () => {
    const result = generateAvatarPlaceholder('cartoon', 0.5);
    expect(result).toBe('data:image/jpeg;base64,mockImageData');
  });

  test('generateRandomAvatar creates random avatar data URL', () => {
    const result = generateRandomAvatar(0.8);
    expect(result).toBe('data:image/jpeg;base64,mockImageData');
  });
});
