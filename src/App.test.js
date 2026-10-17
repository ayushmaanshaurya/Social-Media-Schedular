import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders login or dashboard page without crashing', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Login to Social Scheduler/i)).toBeInTheDocument();
  });
});
