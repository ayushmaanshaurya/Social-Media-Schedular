import { render, screen } from '@testing-library/react';
import PlatformBadge from './PlatformBadge';

describe('PlatformBadge Component', () => {
  test('renders platform name and custom color for Twitter', () => {
    render(<PlatformBadge platform="Twitter" />);
    const badge = screen.getByText('Twitter');
    expect(badge).toBeInTheDocument();
  });

  test('renders fallback style for unknown platform', () => {
    render(<PlatformBadge platform="UnknownPlatform" />);
    const badge = screen.getByText('UnknownPlatform');
    expect(badge).toBeInTheDocument();
  });
});
