import {
  generateGradientImage,
  generateAvatarPlaceholder,
  generateRandomAvatar,
} from './imageGenerator';

describe('imageGenerator utility functions', () => {
  beforeEach(() => {
    // Mock HTMLCanvasElement.prototype.getContext and toDataURL for jsdom
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
      () => 'data:image/jpeg;base64,mockImageString'
    );
  });

  test('generateGradientImage creates a data URL', () => {
    const result = generateGradientImage('Test prompt', '100x100');
    expect(result).toBe('data:image/jpeg;base64,mockImageString');
  });

  test('generateAvatarPlaceholder creates avatar data URL for given style', () => {
    const result = generateAvatarPlaceholder('cartoon', 0.5);
    expect(result).toBe('data:image/jpeg;base64,mockImageString');
  });

  test('generateRandomAvatar creates random avatar data URL', () => {
    const result = generateRandomAvatar(0.123);
    expect(result).toBe('data:image/jpeg;base64,mockImageString');
  });
});
