import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaLeaf, FaArrowRight, FaEye, FaEyeSlash, FaUtensils, FaTruck, FaHeart } from "react-icons/fa";
import { API_URL } from '../config';

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const resetFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Login Success");
        setEmail("");
        setPassword("");
        navigate("/profile");
        window.location.reload();
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setMode("login");
        resetFields();
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      {/* Background decorative orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      <div className={`auth-card ${isLogin ? "auth-card-login" : "auth-card-register"}`}>
        {/* Green accent bar */}
        <div className="auth-card-accent" />

        {/* Decorative side panel */}
        <div className={`auth-side-panel ${isLogin ? "auth-side-login" : "auth-side-register"}`}>
          <div className="auth-side-content">
            <div className="auth-side-icon">
              <FaLeaf />
            </div>
            <h3>{isLogin ? "Welcome Back!" : "Join Us!"}</h3>
            <p>
              {isLogin
                ? "Sign in to access your favorite healthy meals and exclusive deals."
                : "Create an account and start your journey towards healthier eating."}
            </p>
            <div className="auth-side-features">
              <div className="auth-side-feature">
                <FaUtensils />
                <span>Fresh Meals</span>
              </div>
              <div className="auth-side-feature">
                <FaTruck />
                <span>Fast Delivery</span>
              </div>
              <div className="auth-side-feature">
                <FaHeart />
                <span>Made with Love</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="auth-form-side">
          {/* Tab switcher */}
          <div className="auth-header">
            <div className="auth-tab-indicator" style={{ transform: isLogin ? "translateX(0)" : "translateX(100%)" }} />
            <button
              type="button"
              className={`auth-tab ${isLogin ? "active" : ""}`}
              onClick={() => { setMode("login"); resetFields(); }}
            >
              Login
            </button>
            <button
              type="button"
              className={`auth-tab ${!isLogin ? "active" : ""}`}
              onClick={() => { setMode("register"); resetFields(); }}
            >
              Register
            </button>
          </div>

          <form className="auth-content" onSubmit={isLogin ? handleLogin : handleRegister}>
            {/* Welcome text */}
            <div className="auth-welcome">
              <div className="auth-welcome-icon">
                {isLogin ? <FaEnvelope /> : <FaUser />}
              </div>
              <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
              <p>{isLogin ? "Enter your credentials to continue" : "Fill in your details to get started"}</p>
            </div>

            {/* Name field (register only) */}
            {mode === "register" && (
              <div className="auth-field">
                <span className="auth-field-icon"><FaUser /></span>
                <div className="auth-field-input">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="auth-field">
              <span className="auth-field-icon"><FaEnvelope /></span>
              <div className="auth-field-input">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="auth-field">
              <span className="auth-field-icon"><FaLock /></span>
              <div className="auth-field-input">
                <label>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit button */}
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="auth-submit-loading">Processing…</span>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <FaArrowRight className="auth-submit-icon" />
                </>
              )}
            </button>
          </form>

          {/* Switch link */}
          <div className="auth-switch">
            {isLogin ? (
              <p>New here? <button type="button" className="auth-link" onClick={() => { setMode("register"); resetFields(); }}>Create an account <FaArrowRight className="auth-link-icon" /></button></p>
            ) : (
              <p>Already have an account? <button type="button" className="auth-link" onClick={() => { setMode("login"); resetFields(); }}>Sign in <FaArrowRight className="auth-link-icon" /></button></p>
            )}
          </div>

          {/* Home link */}
          <div className="auth-home-link">
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
