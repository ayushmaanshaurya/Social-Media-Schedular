import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { ThemeProvider } from "../context/ThemeContext";
import * as AuthContextModule from "../context/AuthContext";

describe("Navbar component", () => {
  test("renders navigation links when user is authenticated", () => {
    jest.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: { uid: "123", email: "test@example.com", role: "user" },
      logout: jest.fn(),
      updateUserPhoto: jest.fn(),
    });

    render(
      <MemoryRouter>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("Social Scheduler")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  test("does not render when user is not authenticated", () => {
    jest.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      logout: jest.fn(),
      updateUserPhoto: jest.fn(),
    });

    const { container } = render(
      <MemoryRouter>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
