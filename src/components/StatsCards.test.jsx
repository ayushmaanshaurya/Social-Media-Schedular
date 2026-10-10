import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StatsCards from './StatsCards';
import * as api from '../services/api';

jest.mock('../services/api');

describe('StatsCards', () => {
  test('renders stat cards correctly with fetched data', async () => {
    const today = new Date().toISOString().split('T')[0];
    const mockPosts = [
      { id: '1', status: 'Published', date: today, views: 100 },
      { id: '2', status: 'Upcoming', views: 0 },
      { id: '3', status: 'Pending', views: 0 },
    ];

    api.fetchPosts.mockResolvedValue(mockPosts);

    render(<StatsCards />);

    await waitFor(() => {
      expect(screen.getByText('Total Views')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getAllByText('1 posts').length).toBe(3);
    });
  });
});
