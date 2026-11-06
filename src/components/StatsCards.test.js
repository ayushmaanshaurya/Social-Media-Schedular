import { render, screen, waitFor } from '@testing-library/react';
import StatsCards from './StatsCards';
import * as api from '../services/api';

jest.mock('../services/api');

describe('StatsCards', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('renders card labels and calculated stats correctly', async () => {
    const mockPosts = [
      { id: 1, status: 'Upcoming', views: 100 },
      { id: 2, status: 'Upcoming', views: 50 },
      { id: 3, status: 'Pending', views: 20 },
      { id: 4, status: 'Published', views: 200, date: new Date().toISOString().split('T')[0] },
    ];

    api.fetchPosts.mockResolvedValue(mockPosts);

    render(<StatsCards />);

    await waitFor(() => {
      expect(screen.getByText('2 posts')).toBeInTheDocument(); // Scheduled
      expect(screen.getAllByText('1 posts')).toHaveLength(2); // Published Today & Pending Approval
      expect(screen.getByText('370')).toBeInTheDocument(); // Total views 100+50+20+200
    });
  });

  test('handles fetch errors gracefully', async () => {
    api.fetchPosts.mockRejectedValue(new Error('Fetch failed'));

    render(<StatsCards />);

    await waitFor(() => {
      expect(screen.getAllByText('0 posts').length).toBeGreaterThan(0);
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });
});
