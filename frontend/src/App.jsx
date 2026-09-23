import { useState } from "react";
import Dashboard from "./Dashboard";
import Chat from "./Chat";
import {
  ArrowRight,
  Eye,
  EyeOff,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Mail,
} from "lucide-react";
import "./App.css";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const[showChat, setShowChat] = useState(false);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchToRegister = () => {
    setIsRegistering(true);
    setMessage("");
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const switchToLogin = () => {
    setIsRegistering(false);
    setMessage("");
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/auth/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.username) {
          setError(`Username: ${data.username[0]}`);
        } else if (data.email) {
          setError(`Email: ${data.email[0]}`);
        } else if (data.password) {
          setError(`Password: ${data.password[0]}`);
        } else {
          setError("Registration failed. Please check your details.");
        }
        
        return;
      }

      setMessage("Account created successfully! You can now sign in.");

      setTimeout(() => {
        setIsRegistering(false);
        setMessage("");
        setUsername("");
        setEmail("");
        setPassword("");
      }, 1500);
    } catch (err) {
      setError(
        "Unable to connect to the server. Make sure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8001/api/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("knovexa_access", data.access);
        localStorage.setItem("knovexa_refresh", data.refresh);
      } else {
        sessionStorage.setItem("knovexa_access", data.access);
        sessionStorage.setItem("knovexa_refresh", data.refresh);
      }

      setMessage("Login successful!");

      
      setTimeout(() => {
        setIsLoggedIn(true);
      }, 500);
    } catch (err) {
      setError(
        "Unable to connect to the server. Make sure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };
  if (isLoggedIn) {
    if (showChat) {
      return (
        <Chat
          username={username}
          onBack={() => setShowChat(false)}
        />
      );
  }
      return (
        <Dashboard
          username={username}
          onStartAsking={() => setShowChat(true)}
          onLogout={() => {
            localStorage.removeItem("knovexa_access");
            localStorage.removeItem("knovexa_refresh");
            sessionStorage.removeItem("knovexa_access");
            sessionStorage.removeItem("knovexa_refresh");

            setIsLoggedIn(false);
            setUsername("");
            setPassword("");
          }}
        />
    );
}

  return (
    <main className="page">
      <section className="hero-section">
        <div className="hero-content">
          <nav className="navbar">
          <div className="brand brand-light centered-brand">
            <div className="brand-mark">
              <span></span>
              <span></span>
            </div>

            <span className="brand-text">Knovexa</span>
          </div>
        </nav>

          <div className="hero-main">
            <div className="eyebrow">
              YOUR KNOWLEDGE COMPANION
            </div>

            <h1>
              Explore.
              <br />
              Understand.
              <br />
              <span>Discover.</span>
            </h1>

            <p className="hero-description">
              Get instant answers from your company's documents,
              wikis, and knowledge bases with the power of AI.
            </p>

            <div className="ask-box">
              <div className="ask-icon">
                <Sparkles size={21} strokeWidth={2.2} />
              </div>

              <input
                type="text"
                placeholder="Ask anything..."
              />

              <button
                type="button"
                className="ask-button"
                aria-label="Ask"
              >
                <ArrowRight size={22} />
              </button>
            </div>

            <div className="features">
              <div className="feature">
                <div className="feature-icon">
                  <FileText size={21} />
                </div>

                <h3>Find information fast</h3>

                <p>
                  Get answers from your documents
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <Users size={21} />
                </div>

                <h3>Work smarter together</h3>

                <p>
                  Share knowledge across your team
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <ShieldCheck size={21} />
                </div>

                <h3>Reliable and secure</h3>

                <p>
                  Answers grounded in trusted data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-section">
        <div className="auth-top">
          <span>
            {isRegistering ? "Already have an account?" : "New here?"}
          </span>

          <button
            type="button"
            className="create-top"
            onClick={
              isRegistering ? switchToLogin : switchToRegister
            }
          >
            {isRegistering ? "Sign in" : "Create an account"}
          </button>
        </div>

        <div className="auth-card">
    
              <div className="auth-brand-name">
                Knovexa
              </div>

              
          

          <div className="auth-header">
            <h2>
              {isRegistering
                ? "Create your account"
                : "Welcome back"}
            </h2>

            <p>
              {isRegistering
                ? "Join Knovexa and explore your knowledge."
                : "Sign in to continue to Knovexa."}
            </p>
          </div>

          {message && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "9px",
                background: "#edf7eb",
                color: "#24613e",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                marginBottom: "18px",
                padding: "12px 14px",
                borderRadius: "9px",
                background: "#fff0ef",
                color: "#b33a32",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={
              isRegistering
                ? handleRegister
                : handleLogin
            }
          >
            <div className="input-group">
              <label htmlFor="username">
                Username
              </label>

              <div className="input-wrapper">
                <User size={19} />

                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {isRegistering && (
              <div className="input-group">
                <label htmlFor="email">
                  Email
                </label>

                <div className="input-wrapper">
                  <Mail size={19} />

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <LockKeyhole size={19} />

                <input
                  id="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {!isRegistering && (
              <div className="form-options">
                <label className="remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="sign-in-button"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Please wait..."
                  : isRegistering
                  ? "Create account"
                  : "Sign in"}
              </span>

              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {!isRegistering && (
            <>
              <div className="divider">
                <span></span>
                <p>OR CONTINUE WITH</p>
                <span></span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-button"
                >
                  <svg
                    className="brand-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.27c0-.79-.07-1.54-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.8c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.8Z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.88A5.85 5.85 0 0 1 6.23 12c0-.65.11-1.29.31-1.88V7.59H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.04 4.41l3.25-2.53Z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 6.09c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.2 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.71 5.39l3.25 2.53c.77-2.31 2.92-4.03 5.46-4.03Z"
                    />
                  </svg>

                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="social-button"
                >
                  <svg
                    className="brand-icon microsoft-logo"
                    viewBox="0 0 23 23"
                    aria-hidden="true"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="10"
                      height="10"
                      fill="#F25022"
                    />

                    <rect
                      x="12"
                      y="1"
                      width="10"
                      height="10"
                      fill="#7FBA00"
                    />

                    <rect
                      x="1"
                      y="12"
                      width="10"
                      height="10"
                      fill="#00A4EF"
                    />

                    <rect
                      x="12"
                      y="12"
                      width="10"
                      height="10"
                      fill="#FFB900"
                    />
                  </svg>

                  <span>Microsoft</span>
                </button>
              </div>
            </>
          )}

          <div className="create-account">
            <span>
              {isRegistering
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={
                isRegistering
                  ? switchToLogin
                  : switchToRegister
              }
            >
              {isRegistering ? "Sign in" : "Create one"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;