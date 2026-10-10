import React from 'react';
import { render, screen } from '@testing-library/react';
import PlatformBadge from './PlatformBadge';

describe('PlatformBadge', () => {
  test('renders platform badge correctly for Twitter', () => {
    render(<PlatformBadge platform="Twitter" />);
    expect(screen.getByText('Twitter')).toBeInTheDocument();
  });

  test('renders platform badge correctly for Instagram', () => {
    render(<PlatformBadge platform="Instagram" />);
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });
});
