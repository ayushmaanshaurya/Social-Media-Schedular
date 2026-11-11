import { render, screen } from '@testing-library/react';
import App from './App';
import * as AuthContext from './context/AuthContext';

jest.mock('./context/AuthContext', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('./context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar and main content when user is logged in', async () => {
    AuthContext.useAuth.mockReturnValue({
      user: { uid: 'test-user', displayName: 'Test User' },
      loginWithGoogle: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      updateUserPhoto: jest.fn(),
      authLoading: false,
    });

    render(<App />);
    expect(await screen.findByRole('navigation')).toBeInTheDocument();
  });

  test('renders login route when user is null', () => {
    AuthContext.useAuth.mockReturnValue({
      user: null,
      loginWithGoogle: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      updateUserPhoto: jest.fn(),
      authLoading: false,
    });

    render(<App />);
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
