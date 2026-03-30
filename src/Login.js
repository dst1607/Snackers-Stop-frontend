import React, { useState } from "react";
import "./Auth.css";

const API_BASE = "http://localhost:8080";

function Login({ onLogin, onSwitchToSignup }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("canteenUser", JSON.stringify(data));
      onLogin(data);
    } catch (error) {
      setMessage(error.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg-orb auth-orb-1"></div>
      <div className="auth-bg-orb auth-orb-2"></div>

      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">SNACKERS STOP</p>
          <h2>Welcome back</h2>
          <p className="auth-subtitle">
            Login to continue ordering from your canteen dashboard.
          </p>
        </div>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Don&apos;t have an account?</span>
          <button type="button" className="auth-link-btn" onClick={onSwitchToSignup}>
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;