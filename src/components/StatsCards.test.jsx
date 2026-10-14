import { render, screen, waitFor } from '@testing-library/react';
import StatsCards from './StatsCards';
import { fetchPosts } from '../services/api';

jest.mock('../services/api', () => ({
  fetchPosts: jest.fn(),
}));

describe('StatsCards Component', () => {
  test('renders loading state initially and then displays post statistics', async () => {
    const mockPosts = [
      { id: '1', status: 'Upcoming', views: 100 },
      { id: '2', status: 'Published', views: 250, createdAt: new Date().toISOString() },
      { id: '3', status: 'Pending', views: 50 },
    ];
    fetchPosts.mockResolvedValue(mockPosts);

    render(<StatsCards />);

    await waitFor(() => {
      const postElements = screen.getAllByText(/1 posts/i);
      expect(postElements.length).toBeGreaterThan(0);
      expect(screen.getByText('400')).toBeInTheDocument(); // Total views
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    fetchPosts.mockRejectedValue(new Error('Network Error'));

    render(<StatsCards />);

    await waitFor(() => {
      expect(screen.getByText('Scheduled')).toBeInTheDocument();
      const zeroPostElements = screen.getAllByText(/0 posts/i);
      expect(zeroPostElements.length).toBeGreaterThan(0);
    });

    consoleErrorSpy.mockRestore();
  });
});
