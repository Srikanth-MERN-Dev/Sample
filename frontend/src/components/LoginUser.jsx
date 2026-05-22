import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaLeaf, FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { API_URL } from '../config';

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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
        navigate("/profile");
        setEmail("");
        setPassword("");
        alert("Login Success");
        window.location.reload();
      } else {
        alert(data.message || "Login failed");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="login-card">
        {/* Decorative top accent */}
        <div className="login-card-accent" />

        {/* Logo & Welcome */}
        <div className="login-welcome">
          <div className="login-logo">
            <FaLeaf />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to order your favorites</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-field">
            <div className="login-field-icon">
              <FaEnvelope />
            </div>
            <div className="login-field-input">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <div className="login-field-icon">
              <FaLock />
            </div>
            <div className="login-field-input">
              <label>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="button"
              className="login-toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : (
              <>Sign In <FaArrowRight className="login-submit-icon" /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Switch to register */}
        <div className="login-switch">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="login-switch-link">
              Create one <FaArrowRight className="login-switch-icon" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;