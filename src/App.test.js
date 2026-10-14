import { render, screen } from '@testing-library/react';
import App from './App';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

jest.mock('./context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('App Component', () => {
  test('renders login page when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(screen.getByText(/Login to Social Scheduler/i)).toBeInTheDocument();
  });

  test('renders navbar and navigation when user is logged in', () => {
    useAuth.mockReturnValue({
      user: { uid: '123', email: 'test@example.com', displayName: 'Test User' },
      logout: jest.fn(),
      updateUserPhoto: jest.fn(),
    });
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
