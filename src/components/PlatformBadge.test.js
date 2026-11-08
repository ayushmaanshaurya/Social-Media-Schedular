import { render, screen } from '@testing-library/react';
import PlatformBadge from './PlatformBadge';

describe('PlatformBadge', () => {
  test('renders platform text', () => {
    render(<PlatformBadge platform="Twitter" />);
    expect(screen.getByText('Twitter')).toBeInTheDocument();
  });

  test('applies platform specific background color', () => {
    render(<PlatformBadge platform="Instagram" />);
    const badge = screen.getByText('Instagram');
    expect(badge).toHaveStyle({ background: '#E1306C' });
  });

  test('uses fallback color for unknown platform', () => {
    render(<PlatformBadge platform="UnknownPlatform" />);
    const badge = screen.getByText('UnknownPlatform');
    expect(badge).toHaveStyle({ background: '#666' });
  });
});
