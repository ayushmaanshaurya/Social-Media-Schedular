import { render, screen, act } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const renderApp = async () => {
  let result;
  await act(async () => {
    result = render(
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    );
  });
  return result;
};

test('renders App without crashing', async () => {
  await renderApp();
  expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
});

test('renders login page heading for unauthenticated users', async () => {
  await renderApp();
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
});
