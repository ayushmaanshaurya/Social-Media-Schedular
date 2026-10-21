import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

test('renders login page when user is not authenticated', async () => {
  render(
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );

  const welcomeHeading = await screen.findByText(/Welcome Back/i);
  expect(welcomeHeading).toBeInTheDocument();
});
