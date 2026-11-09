import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user', displayName: 'Test User' },
    loginWithGoogle: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    updateUserPhoto: jest.fn(),
    authLoading: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('./context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

test('renders app without crashing', async () => {
  render(<App />);
  expect(await screen.findByRole('navigation')).toBeInTheDocument();
});
