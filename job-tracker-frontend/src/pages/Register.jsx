import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post("register/", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
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
        style={{ width: "100%", maxWidth: "500px", padding: "3rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Join JobTracker
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Start your journey as a candidate or employer
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Choose your path</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                onClick={() => setFormData({ ...formData, role: "candidate" })}
                style={{
                  padding: "1.5rem 1rem",
                  border: `2px solid ${formData.role === "candidate" ? "var(--primary)" : "var(--border-subtle)"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "center",
                  background:
                    formData.role === "candidate"
                      ? "var(--primary-glow)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  👋
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    color:
                      formData.role === "candidate"
                        ? "var(--primary)"
                        : "var(--text-main)",
                  }}
                >
                  Candidate
                </div>
              </div>
              <div
                onClick={() => setFormData({ ...formData, role: "employer" })}
                style={{
                  padding: "1.5rem 1rem",
                  border: `2px solid ${formData.role === "employer" ? "var(--primary)" : "var(--border-subtle)"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  textAlign: "center",
                  background:
                    formData.role === "employer"
                      ? "var(--primary-glow)"
                      : "transparent",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                  🏢
                </div>
                <div
                  style={{
                    fontWeight: "700",
                    color:
                      formData.role === "employer"
                        ? "var(--primary)"
                        : "var(--text-main)",
                  }}
                >
                  Employer
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Pick a unique username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", marginTop: "1.5rem", padding: "1rem" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Get Started"}
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
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--primary)", fontWeight: "700" }}
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
