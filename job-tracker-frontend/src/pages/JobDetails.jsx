import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../api/client";

function JobDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await client.get(`jobs/${id}/`);
        setJob(response.data);

        if (user && user.role === "candidate") {
          const apps = await client.get("jobs/applications/");
          const hasApplied = apps.data.some((app) => app.job === parseInt(id));
          setApplied(hasApplied);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await client.post("jobs/applications/", { job: id });
      setApplied(true);
      alert("Application submitted successfully!");
    } catch (error) {
      alert("Failed to apply. " + (error.response?.data?.error || ""));
    }
  };

  if (loading) return <div className="container">Loading job details...</div>;
  if (!job) return <div className="container">Job not found.</div>;

  return (
    <div
      className="animate-fade"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      <div
        className="card"
        style={{ padding: "3rem", position: "relative", overflow: "hidden" }}
      >
        {/* Decorative background element */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "var(--primary-glow)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {job.title.charAt(0)}
              </div>
              <div>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {job.title}
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                  <span
                    style={{ color: "var(--text-main)", fontWeight: "600" }}
                  >
                    {job.employer?.username}
                  </span>{" "}
                  • {job.location}
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "800",
                  color: "var(--primary)",
                }}
              >
                ${job.salary.toLocaleString()}
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Annual Salary (USD)
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "3rem",
            }}
          >
            <div>
              <section style={{ marginBottom: "2.5rem" }}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "1.25rem",
                      background: "var(--primary)",
                      borderRadius: "2px",
                    }}
                  ></span>
                  Role Overview
                </h3>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    color: "#334155",
                    lineHeight: "1.8",
                  }}
                >
                  {job.description}
                </p>
              </section>

              <section style={{ marginBottom: "2.5rem" }}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      width: "4px",
                      height: "1.25rem",
                      background: "var(--primary)",
                      borderRadius: "2px",
                    }}
                  ></span>
                  Preferred Skills
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    marginTop: "1rem",
                  }}
                >
                  {job.skills.split(",").map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#f1f5f9",
                        color: "#475569",
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <div>
              <div
                className="card"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <h4 style={{ marginBottom: "1rem" }}>Job Summary</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  <li
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>Location</span>
                    <span style={{ fontWeight: "600" }}>{job.location}</span>
                  </li>
                  <li
                    style={{
                      marginBottom: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      Posted On
                    </span>
                    <span style={{ fontWeight: "600" }}>
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </li>
                  <li
                    style={{
                      marginBottom: "1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>Status</span>
                    <span className="badge badge-open">{job.status}</span>
                  </li>
                </ul>

                {user?.role !== "employer" && (
                  <button
                    onClick={handleApply}
                    className={applied ? "btn-outline" : "btn-primary"}
                    disabled={applied}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "12px",
                    }}
                  >
                    {applied ? "✓ Application Submitted" : "Apply Now"}
                  </button>
                )}

                {user?.id === job.employer?.id && (
                  <button
                    onClick={() => navigate(`/edit-job/${id}`)}
                    className="btn-outline"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "12px",
                    }}
                  >
                    Edit this Listing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
