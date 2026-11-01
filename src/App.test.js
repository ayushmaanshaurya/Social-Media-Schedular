import { render, act } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

test('renders app without crashing', async () => {
  await act(async () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    );
  });
  expect(document.body).toBeInTheDocument();
});
