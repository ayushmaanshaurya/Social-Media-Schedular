import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

test('renders App without crashing', async () => {
  render(
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );

  await waitFor(() => {
    const loginHeading = screen.getByRole('heading', { name: /Welcome Back/i });
    expect(loginHeading).toBeInTheDocument();
  });
});
