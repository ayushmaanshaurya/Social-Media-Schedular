import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

test('renders app without crashing', async () => {
  render(
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );

  // AuthContext sets loading to false on onAuthStateChanged which resolves to Login route when unauthenticated
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });
  expect(document.body).toBeInTheDocument();
});
