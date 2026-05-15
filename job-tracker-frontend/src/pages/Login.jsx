import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await client.post("token/", { username, password });
      const { access, user } = response.data;
      onLogin(user, access);
      navigate("/");
    } catch (error) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-fade"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <div
        className="card"
        style={{ width: "100%", maxWidth: "450px", padding: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>Password</label>
              <a
                href="#"
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary)",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--primary)", fontWeight: "700" }}
          >
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
