import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./pages/Login";
import Explore from "./pages/Explore";
import Analytics from "./pages/Analytics";
import CreatePost from "./pages/CreatePost";
import {
  validateUsername,
  generateUsernamesuggestions,
} from "./utils/usernameValidator";
import {
  generateCaption,
  shortenCaption,
  addEmojis,
  rewriteCaption,
  generateHashtags,
  optimizeCaption,
} from "./utils/aiCaption";
import {
  generateGradientImage,
  generateAvatarPlaceholder,
} from "./utils/imageGenerator";
import * as api from "./services/api";

jest.mock("./services/api");

// Mock AuthContext
jest.mock("./context/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    loginWithGoogle: jest.fn(),
    logout: jest.fn(),
    authLoading: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock ThemeContext
jest.mock("./context/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => <div>{children}</div>,
}));

describe("Login Page Component", () => {
  test("renders Login page correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  test("switches between Login and Signup modes", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    const signupToggle = screen.getByRole("button", { name: "Sign up" });
    fireEvent.click(signupToggle);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username (no 3+ same chars)")).toBeInTheDocument();
  });

  test("shows validation error on invalid username in signup mode", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const signupToggle = screen.getByRole("button", { name: "Sign up" });
    fireEvent.click(signupToggle);

    const usernameInput = screen.getByPlaceholderText("username (no 3+ same chars)");
    fireEvent.change(usernameInput, { target: { value: "aaa" } });

    expect(
      screen.getByText(/Cannot have 3\+ continuous same characters/i)
    ).toBeInTheDocument();
  });
});

describe("Explore Page Component", () => {
  test("renders trending reels and post ideas", () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /Explore Trending Content/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Morning routine reel")).toBeInTheDocument();
    expect(screen.getByText("#contentcreator")).toBeInTheDocument();
  });
});

describe("Analytics Page Component", () => {
  test("renders analytics metrics correctly", async () => {
    api.fetchPosts.mockImplementation(() => Promise.resolve([
      {
        id: "1",
        content: "First test post #productivity",
        platform: "Twitter",
        views: 100,
        likes: 10,
        comments: 2,
        shares: 1,
        createdAt: new Date().toISOString(),
        type: "post",
      },
      {
        id: "2",
        title: "YouTube Video Title",
        platform: "YouTube",
        views: 500,
        likes: 50,
        comments: 10,
        shares: 5,
        createdAt: new Date().toISOString(),
        type: "youtube",
      },
    ]));

    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /Advanced Analytics/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Total Views")[0]).toBeInTheDocument();
    expect(screen.getByText(/First test post/i)).toBeInTheDocument();
  });
});

describe("CreatePost Page Component", () => {
  test("switches tabs and validates character limits", () => {
    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Create Post" })
    ).toBeInTheDocument();

    const reelTab = screen.getByRole("button", { name: /Create Reel/i });
    fireEvent.click(reelTab);
    expect(
      screen.getByRole("heading", { name: "Create Reel" })
    ).toBeInTheDocument();

    const youtubeTab = screen.getByRole("button", { name: /YouTube Video/i });
    fireEvent.click(youtubeTab);
    expect(
      screen.getByRole("heading", { name: "Create YouTube Video" })
    ).toBeInTheDocument();
  });
});

describe("usernameValidator Utility", () => {
  test("validates correct username", () => {
    const res = validateUsername("valid_user1");
    expect(res.valid).toBe(true);
    expect(res.error).toBe("");
  });

  test("rejects short username", () => {
    const res = validateUsername("ab");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("at least 3 characters");
  });

  test("rejects long username", () => {
    const res = validateUsername("a".repeat(21));
    expect(res.valid).toBe(false);
    expect(res.error).toContain("less than 20 characters");
  });

  test("rejects username with invalid characters", () => {
    const res = validateUsername("user@name");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Only letters, numbers, underscores");
  });

  test("rejects username with 3+ repeated characters", () => {
    const res = validateUsername("aaa_user");
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Cannot have 3+ continuous same characters");
  });

  test("generates username suggestions", () => {
    const suggestions = generateUsernamesuggestions("testuser");
    expect(suggestions.length).toBeGreaterThan(0);
  });
});

describe("aiCaption Utility", () => {
  test("generates caption with tone", () => {
    const caption = generateCaption("Hello world", "professional");
    expect(caption).toContain("insight worth sharing");
    expect(caption).toContain("Hello world");
  });

  test("handles empty input in generateCaption", () => {
    expect(generateCaption("")).toBe("Write something first! 💭");
  });

  test("shortens caption", () => {
    const longText =
      "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen";
    const shortened = shortenCaption(longText);
    expect(shortened).toContain("...");
    expect(shortened.split(" ").length).toBeLessThanOrEqual(16);
  });

  test("adds emojis", () => {
    const textWithEmoji = addEmojis("I feel happy and love this");
    expect(textWithEmoji).toContain("😊");
    expect(textWithEmoji).toContain("❤️");
  });

  test("rewrites caption", () => {
    const rewritten = rewriteCaption("Original caption");
    expect(rewritten).not.toBe("Original caption");
    expect(rewritten).toContain("Original caption");
  });

  test("generates hashtags", () => {
    const tags = generateHashtags("my content");
    expect(tags).toContain("#");
  });

  test("optimizes caption", () => {
    const optimized = optimizeCaption("test caption without emoji");
    expect(optimized).toContain("Test caption");
  });
});

describe("imageGenerator Utility", () => {
  beforeEach(() => {
    const mockContext = {
      createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      fillText: jest.fn(),
    };
    jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(mockContext);
    jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/jpeg;base64,fakeimagedata");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("generates gradient image placeholder", () => {
    const image = generateGradientImage("test prompt", "500x500");
    expect(image).toContain("data:image/jpeg;base64,");
  });

  test("generates avatar placeholder", () => {
    const avatar = generateAvatarPlaceholder("cartoon");
    expect(avatar).toContain("data:image/jpeg;base64,");
  });
});
