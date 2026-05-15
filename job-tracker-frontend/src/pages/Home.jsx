import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    location: "",
    min_salary: "",
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.role) params.append("role", filters.role);
      if (filters.location) params.append("location", filters.location);
      if (filters.min_salary) params.append("min_salary", filters.min_salary);

      const response = await client.get(`jobs/?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="animate-fade">
      <div
        style={{
          textAlign: "center",
          padding: "4rem 0",
          background: "white",
          borderRadius: "var(--radius-lg)",
          marginBottom: "3rem",
          border: "1px solid var(--border-subtle)",
        }}
      >
        <h1
          style={{ fontSize: "3.5rem", marginBottom: "1rem", color: "#1e293b" }}
        >
          Find your next{" "}
          <span style={{ color: "var(--primary)", position: "relative" }}>
            dream career
            <svg
              style={{
                position: "absolute",
                bottom: "-10px",
                left: 0,
                width: "100%",
              }}
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0 5 Q 50 10 100 5"
                stroke="var(--primary)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </span>
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-muted)",
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
          }}
        >
          Explore thousands of opportunities from top companies and take the
          next step in your professional journey.
        </p>

        <form
          onSubmit={handleSearch}
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            gap: "0.5rem",
            padding: "0.5rem",
            background: "#f1f5f9",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
          }}
        >
          <input
            name="search"
            placeholder="Search job titles or keywords..."
            value={filters.search}
            onChange={handleFilterChange}
            style={{ border: "none", background: "transparent", flex: 2 }}
          />
          <div
            style={{ width: "1px", background: "#cbd5e1", margin: "0.5rem 0" }}
          ></div>
          <input
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={handleFilterChange}
            style={{ border: "none", background: "transparent", flex: 1 }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "0.75rem 2rem" }}
          >
            Search
          </button>
        </form>
      </div>

      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Sidebar Filters */}
        <div style={{ width: "280px", flexShrink: 0 }}>
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <h3 style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Filters
            </h3>
            <div className="form-group">
              <label>Specialization</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
              >
                <option value="">All Roles</option>
                <option value="software">Software Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
            </div>
            <div className="form-group">
              <label>Min Salary (USD)</label>
              <input
                type="number"
                name="min_salary"
                value={filters.min_salary}
                onChange={handleFilterChange}
                placeholder="e.g. 50000"
              />
            </div>
            <button
              onClick={fetchJobs}
              className="btn-outline"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Job List */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.5rem" }}>
              Recent Openings ({jobs.length})
            </h2>
          </div>

          {loading ? (
            <div style={{ display: "grid", gap: "1rem" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="card"
                  style={{ height: "140px", background: "#f1f5f9" }}
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <div
                    key={job.id}
                    className="card"
                    style={{
                      display: "flex",
                      gap: "1.5rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "12px",
                        background: "var(--primary-glow)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                        color: "var(--primary)",
                        fontWeight: "bold",
                      }}
                    >
                      {job.title.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              fontSize: "1.25rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {job.title}
                          </h3>
                          <p
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.9rem",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--text-main)",
                                fontWeight: "600",
                              }}
                            >
                              {job.employer?.username}
                            </span>{" "}
                            • {job.location}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              color: "var(--primary)",
                              fontWeight: "700",
                              fontSize: "1.1rem",
                            }}
                          >
                            ${job.salary.toLocaleString()}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            per year
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "1rem",
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <span className="badge badge-open">Full Time</span>
                        {job.role && (
                          <span
                            className="badge"
                            style={{ background: "#f1f5f9", color: "#475569" }}
                          >
                            {job.role}
                          </span>
                        )}
                        <div style={{ flex: 1 }}></div>
                        <Link
                          to={`/job/${job.id}`}
                          className="btn-outline"
                          style={{
                            padding: "0.4rem 1rem",
                            fontSize: "0.85rem",
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "4rem",
                    background: "white",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <p style={{ color: "var(--text-muted)" }}>
                    No jobs found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
