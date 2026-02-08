import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 TEMP HARDCODED LOGIN (abhi ke liye)
    if (email === "admin@parkping.com" && password === "admin123") {
      setError("");
      onLogin();
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* Logo (optional) */}
        {/* <img src="/logo.png" alt="ParkPing" height="40" /> */}

        <h1>ParkPing Admin</h1>
        <p>Secure access to your command center</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="admin@parkping.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="actions">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span style={{ color: "#22c55e", cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>

          <button type="submit" className="login-btn">
            Sign In →
          </button>
        </form>
      </div>
    </div>
  );
}
