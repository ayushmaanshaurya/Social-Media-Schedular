import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { validateUsername, generateUsernamesuggestions } from "../utils/usernameValidator";
import toast from "react-hot-toast";
import "./Login.css";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameSuggestions, setUsernameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiAssistLoading, setAiAssistLoading] = useState(false);
  const aiTimeoutRef = useRef(null);

  const { login, loginWithGoogle, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleUsernameChange = (value) => {
    setUsername(value);

    if (value.length > 0) {
      const validation = validateUsername(value);
      setUsernameError(validation.error);

      if (value.length >= 2) {
        // Show suggestions after a short delay
        const newSuggestions = generateUsernamesuggestions(value);
        setUsernameSuggestions(newSuggestions);
        setShowSuggestions(true);
      }
    } else {
      setUsernameError("");
      setShowSuggestions(false);
    }
  };

  const handleAiAssist = () => {
    setAiAssistLoading(true);

    // Clear previous timeout
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

    // 3-second time limit for AI assist
    aiTimeoutRef.current = setTimeout(() => {
      const suggestions = generateUsernamesuggestions(username);
      setUsernameSuggestions(suggestions);
      setShowSuggestions(true);
      setAiAssistLoading(false);
      toast.success("✨ AI suggestions ready!");
    }, 1500); // Show loading for 1.5 sec, then reveal suggestions at 3 sec total
  };

  const handleUseSuggestion = (suggestion) => {
    setUsername(suggestion);
    const validation = validateUsername(suggestion);
    setUsernameError(validation.error);
    setShowSuggestions(false);
    toast.success(`✅ Username "${suggestion}" selected!`);
  };

  const handleEmailLogin = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email);
      document.querySelector(".login-card")?.classList.add("success");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const validation = validateUsername(username);
    if (!validation.valid) {
      setUsernameError(validation.error);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Store username in localStorage for display
      localStorage.setItem("username", username);
      await login(email);
      document.querySelector(".login-card")?.classList.add("success");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      console.error("Signup error:", err);
      const msg = err?.message || "Signup failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-card glass animate-in">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          disabled={loading || authLoading}
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </button>

        <div className="logo">📅</div>

        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className="subtitle">
          {isSignup ? "Join Social Scheduler" : "Login to Social Scheduler"}
        </p>

        {/* Signup Form */}
        {isSignup && (
          <>
            <div className="form-group">
              <label className="form-label">Create Username</label>
              <div className="username-input-wrapper">
                <input
                  type="text"
                  placeholder="username (no 3+ same chars)"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={usernameError ? "input-error" : ""}
                  disabled={loading || authLoading}
                  maxLength="20"
                />
                <button
                  className="ai-assist-btn"
                  onClick={handleAiAssist}
                  disabled={aiAssistLoading || loading}
                  title="Get AI suggestions (3 sec)"
                >
                  {aiAssistLoading ? "✨..." : "✨"}
                </button>
              </div>

              {usernameError && (
                <p className="error-text username-error">{usernameError}</p>
              )}

              {/* Username Suggestions */}
              {showSuggestions && usernameSuggestions.length > 0 && (
                <div className="suggestions-box">
                  <p className="suggestions-label">💡 AI Suggestions:</p>
                  <div className="suggestions-list">
                    {usernameSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleUseSuggestion(suggestion)}
                        disabled={loading}
                      >
                        <span className="suggestion-icon">✨</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="username-info">
                <p>✓ 3-20 characters</p>
                <p>✓ Letters, numbers, _, -</p>
                <p>✓ No 3+ repeating chars (aaa❌, 111❌)</p>
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "input-error" : ""}
                disabled={loading || authLoading}
              />
            </div>
          </>
        )}

        {/* Login Form */}
        {!isSignup && (
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={error ? "input-error" : ""}
            disabled={loading || authLoading}
          />
        )}

        {error && <p className="error-text">{error}</p>}

        <button
          className="login-btn"
          onClick={isSignup ? handleSignup : handleEmailLogin}
          disabled={
            loading ||
            authLoading ||
            (isSignup && (!username || usernameError))
          }
        >
          {loading || authLoading ? (
            <span className="spinner" />
          ) : isSignup ? (
            "Create Account →"
          ) : (
            "Login →"
          )}
        </button>

        <div className="divider">or</div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading || authLoading}
        >
          🔐 Sign in with Google
        </button>

        <p className="hint">No password required — demo login</p>

        {/* Toggle between Login and Signup */}
        <div className="toggle-mode">
          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              className="toggle-btn"
              onClick={() => {
                setIsSignup(!isSignup);
                setError("");
                setUsernameError("");
                setShowSuggestions(false);
              }}
              disabled={loading || authLoading}
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
