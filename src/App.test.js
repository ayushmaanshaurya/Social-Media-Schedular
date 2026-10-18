import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const renderApp = () => {
  return render(
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  );
};

test("renders App and login screen when unauthenticated", async () => {
  renderApp();
  const heading = await screen.findByRole("heading", { name: /Welcome Back/i });
  expect(heading).toBeInTheDocument();
});

test("renders login email input when unauthenticated", async () => {
  renderApp();
  const emailInput = await screen.findByPlaceholderText(/Enter your email/i);
  expect(emailInput).toBeInTheDocument();
});
