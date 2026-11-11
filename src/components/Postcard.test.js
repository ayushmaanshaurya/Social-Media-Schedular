import { render, screen, fireEvent } from '@testing-library/react';
import PostCard from './Postcard';
import * as AuthContext from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('PostCard', () => {
  const basePost = {
    id: 'post-1',
    content: 'Test content message',
    platform: 'Twitter',
    status: 'Scheduled',
    createdAt: '2026-03-01T12:00:00.000Z',
    views: 12,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    AuthContext.useAuth.mockReturnValue({
      user: { uid: 'user1', role: 'user' },
    });
  });

  test('renders standard post content and views', () => {
    render(
      <PostCard
        post={basePost}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onView={jest.fn()}
      />
    );

    expect(screen.getByText('Test content message')).toBeInTheDocument();
    expect(screen.getByText('Twitter')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
    expect(screen.getByText(/Shown 12 times/i)).toBeInTheDocument();
  });

  test('renders youtube post title and description preview', () => {
    const youtubePost = {
      id: 'yt-1',
      type: 'youtube',
      title: 'YouTube Video Title',
      description: 'Long description for YouTube video that should be trimmed.',
      platform: 'YouTube',
      status: 'Upcoming',
      views: 5,
    };

    render(
      <PostCard
        post={youtubePost}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onView={jest.fn()}
      />
    );

    expect(screen.getByText('YouTube Video Title')).toBeInTheDocument();
    expect(screen.getByText(/Long description for YouTube/i)).toBeInTheDocument();
  });

  test('calls onEdit and onView handlers', () => {
    const onEdit = jest.fn();
    const onView = jest.fn();

    render(
      <PostCard
        post={basePost}
        onDelete={jest.fn()}
        onEdit={onEdit}
        onView={onView}
      />
    );

    fireEvent.click(screen.getByText('✏️ Edit'));
    expect(onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Test content message'));
    expect(onView).toHaveBeenCalledTimes(1);
  });

  test('renders delete button for admin role and calls onDelete', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { uid: 'admin1', role: 'admin' },
    });
    const onDelete = jest.fn();

    render(
      <PostCard
        post={basePost}
        onDelete={onDelete}
        onEdit={jest.fn()}
        onView={jest.fn()}
      />
    );

    const deleteBtn = screen.getByText('🗑 Delete');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('does not render delete button for non-admin user', () => {
    AuthContext.useAuth.mockReturnValue({
      user: { uid: 'user1', role: 'user' },
    });

    render(
      <PostCard
        post={basePost}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onView={jest.fn()}
      />
    );

    expect(screen.queryByText('🗑 Delete')).not.toBeInTheDocument();
  });
});
