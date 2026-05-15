import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [view, setView] = useState("jobs"); // 'jobs' or 'applications'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes, statsRes] = await Promise.all([
          client.get("jobs/"),
          client.get("jobs/applications/"),
          client.get("jobs/stats/"),
        ]);
        setJobs(jobsRes.data);
        setApplications(appsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await client.patch(`jobs/applications/${appId}/`, { status: newStatus });
      setApplications(
        applications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading)
    return <div className="container">Loading employer dashboard...</div>;

  return (
    <div className="animate-fade">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "3rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
            Hiring Dashboard
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Manage your listings and review candidates.
          </p>
        </div>
        <Link to="/create-job" className="btn-primary">
          <span style={{ fontSize: "1.2rem" }}></span> Post New Opening
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3" style={{ marginBottom: "3rem" }}>
        <div className="card">
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
          >
            ACTIVE LISTINGS
          </p>
          <h2
            style={{
              fontSize: "2.5rem",
              marginTop: "0.5rem",
              color: "var(--primary)",
            }}
          >
            {stats?.total_jobs || 0}
          </h2>
        </div>
        <div className="card">
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
          >
            TOTAL APPLICANTS
          </p>
          <h2 style={{ fontSize: "2.5rem", marginTop: "0.5rem" }}>
            {stats?.total_applications || 0}
          </h2>
        </div>
        <div
          className="card"
          style={{ borderLeft: "4px solid var(--warning)" }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: "700",
            }}
          >
            PENDING REVIEW
          </p>
          <h2
            style={{
              fontSize: "2.5rem",
              marginTop: "0.5rem",
              color: "var(--warning)",
            }}
          >
            {stats?.pending_applications || 0}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "1rem",
        }}
      >
        <button
          onClick={() => setView("jobs")}
          style={{
            background: "none",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "600",
            color: view === "jobs" ? "var(--primary)" : "var(--text-muted)",
            borderBottom: view === "jobs" ? "2px solid var(--primary)" : "none",
          }}
        >
          My Listings
        </button>
        <button
          onClick={() => setView("applications")}
          style={{
            background: "none",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            fontWeight: "600",
            color:
              view === "applications" ? "var(--primary)" : "var(--text-muted)",
            borderBottom:
              view === "applications" ? "2px solid var(--primary)" : "none",
          }}
        >
          Candidate Reviews
        </button>
      </div>

      <div className="card">
        {view === "jobs" ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid var(--border-subtle)",
                }}
              >
                <th style={{ padding: "1rem" }}>Role Title</th>
                <th style={{ padding: "1rem" }}>Status</th>
                <th style={{ padding: "1rem" }}>Applicants</th>
                <th style={{ padding: "1rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "1.25rem 1rem", fontWeight: "600" }}>
                    {job.title}
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <span
                      className="badge badge-open"
                      style={{
                        background:
                          job.status === "open" ? "#dcfce7" : "#f1f5f9",
                        color: job.status === "open" ? "#166534" : "#64748b",
                      }}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    {applications.filter((a) => a.job === job.id).length}
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <Link
                      to={`/edit-job/${job.id}`}
                      className="btn-outline"
                      style={{
                        padding: "0.3rem 0.8rem",
                        fontSize: "0.8rem",
                        marginRight: "0.5rem",
                      }}
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/job/${job.id}`}
                      className="btn-outline"
                      style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
                    >
                      Preview
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "2px solid var(--border-subtle)",
                }}
              >
                <th style={{ padding: "1rem" }}>Candidate</th>
                <th style={{ padding: "1rem" }}>Target Role</th>
                <th style={{ padding: "1rem" }}>Decision</th>
                <th style={{ padding: "1rem" }}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <div style={{ fontWeight: "600" }}>
                      {app.candidate?.username}
                    </div>
                    <div
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      {app.candidate?.email}
                    </div>
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    {app.job_details?.title}
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusUpdate(app.id, e.target.value)
                      }
                      style={{
                        padding: "0.4rem",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <option value="applied">New Applied</option>
                      <option value="shortlisted">Shortlist</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                  <td style={{ padding: "1.25rem 1rem" }}>
                    {app.candidate?.resume ? (
                      <a
                        href={`http://localhost:8000${app.candidate.resume}`}
                        target="_blank"
                        className="btn-outline"
                        style={{ padding: "0.3rem 0.8rem", fontSize: "0.8rem" }}
                      >
                        View PDF
                      </a>
                    ) : (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        No Resume
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;
