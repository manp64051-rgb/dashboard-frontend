import React, { useState } from "react";
import axios from "axios";
import "./auth.css"

export default function AuthPage() {
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    if (view === "login") {
      // Frontend validations
      if (!formData.email.includes("@")) return setMessage("❌ Invalid email");
      if (formData.password.length < 6) return setMessage("❌ Password too short");

      // Backend login
      const res = await axios.post('${API_URL}/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        localStorage.setItem("authToken", res.data.user._id); // save user id as token
        localStorage.setItem("role", res.data.user.role); // save role
        setMessage("✅ Logged in successfully!");
  // Redirect based on role
  if (res.data.user.role === "admin") {
    window.location.href = "/admin/dashboard";
  } else {
    window.location.href = "/home";
  }
      } else {
        setMessage("❌ " + res.data.message);
      }
    }

    if (view === "register") {
      // Frontend validations
      if (!formData.name.trim()) return setMessage("❌ Name is required");
      if (!formData.email.includes("@")) return setMessage("❌ Invalid email address");
      if (formData.password.length < 6) return setMessage("❌ Password must be 6+ characters");
      if (formData.password !== formData.confirmPassword) return setMessage("❌ Passwords do not match");

      // Backend register
      const res = await axios.post('${API_URL}/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        setMessage("✅ Account created successfully!");
        setView("login"); // switch to login view
      } else {
        setMessage("❌ " + res.data.message);
      }
    }

    if (view === "forgot") {
      // Validation
      if (!formData.email.includes("@")) return setMessage("❌ Please enter a valid email");

      // Just log the message for now
      console.log(`Password reset link sent to: ${formData.email}`);
      setMessage("✅ Password reset link sent! Check console.");
    }
  } catch (err) {
    setMessage("❌ Server error");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>
          {view === "login"
            ? "Login"
            : view === "register"
            ? "Create Account"
            : "Forgot Password"}
        </h2>

        <form onSubmit={handleSubmit}>
          {view === "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {view !== "forgot" && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}

          {view === "register" && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit">
            {view === "login"
              ? "Login"
              : view === "register"
              ? "Sign Up"
              : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="auth-links">
          {view === "login" && (
            <>
              <button onClick={() => setView("register")}>Create Account</button>
              <button onClick={() => setView("forgot")}>Forgot Password?</button>
            </>
          )}

          {view === "register" && (
            <button onClick={() => setView("login")}>
              Already have an account? Login
            </button>
          )}

          {view === "forgot" && (
            <button onClick={() => setView("login")}>Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
}
