import React, { useState } from "react";
import "./Auth.css";

const API_BASE = "http://localhost:8080";

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Signup successful. Please login now.");
      setTimeout(() => {
        onSignupSuccess();
      }, 1000);
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
          <p className="auth-eyebrow">CREATE YOUR ACCOUNT</p>
          <h2>Join the canteen system</h2>
          <p className="auth-subtitle">
            Signup once and order faster with saved user details.
          </p>
        </div>

        {message && <div className="auth-alert">{message}</div>}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="auth-field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="auth-primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button type="button" className="auth-link-btn" onClick={onSwitchToLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;