import React, { useState, useEffect } from "react";
import client from "../api/client";

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const prevAppsRef = React.useRef([]);

  const fetchData = async (isInitial = false) => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        client.get("jobs/applications/"),
        client.get("jobs/stats/"),
      ]);

      const newApps = appsRes.data;
      
      // Check for status changes (skip on initial load)
      if (!isInitial && prevAppsRef.current.length > 0) {
        newApps.forEach(newApp => {
          const oldApp = prevAppsRef.current.find(a => a.id === newApp.id);
          if (oldApp && oldApp.status !== newApp.status) {
            setNotification({
              id: Date.now(),
              message: `Status updated! Your application for "${newApp.job_details.title}" is now ${newApp.status.toUpperCase()}.`,
              type: newApp.status === 'rejected' ? 'error' : 'success'
            });
          }
        });
      }

      setApplications(newApps);
      setStats(statsRes.data);
      prevAppsRef.current = newApps;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(true);
    
    // Poll for updates every 10 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="animate-fade">
      {/* Notification Bar */}
      {notification && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            background: notification.type === 'error' ? '#ef4444' : '#10b981',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div style={{ fontSize: '1.25rem' }}>
            {notification.type === 'error' ? '❌' : '🎉'}
          </div>
          <div style={{ fontWeight: '600' }}>{notification.message}</div>
          <button 
            onClick={() => setNotification(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.8rem'
            }}
          >
            Close
          </button>
        </div>
      )}

      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Your Journey
        </h1>

        <p style={{ color: "var(--text-muted)" }}>
          Track your applications and career progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: "3rem" }}>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            color: "white",
            border: "none",
          }}
        >
          <p style={{ opacity: 0.8, fontSize: "0.9rem", fontWeight: "600" }}>
            TOTAL APPLICATIONS
          </p>
          <h2 style={{ fontSize: "3rem", marginTop: "0.5rem" }}>
            {stats?.total_applied || 0}
          </h2>
        </div>

        <div className="card">
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            INTERVIEWS / SHORTLISTED
          </p>
          <h2
            style={{
              fontSize: "3rem",
              marginTop: "0.5rem",
              color: "var(--success)",
            }}
          >
            {stats?.shortlisted || 0}
          </h2>
        </div>

        <div className="card">
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            PROFILE COMPLETION
          </p>
          <h2
            style={{
              fontSize: "3rem",
              marginTop: "0.5rem",
              color: "var(--primary)",
            }}
          >
            85%
          </h2>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: "1.5rem" }}>Recent Applications</h2>
        {applications.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid var(--border-subtle)",
                  }}
                >
                  <th style={{ padding: "1.25rem 1rem" }}>Job Opportunity</th>
                  <th style={{ padding: "1.25rem 1rem" }}>Company</th>
                  <th style={{ padding: "1.25rem 1rem" }}>Applied On</th>
                  <th style={{ padding: "1.25rem 1rem" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background 0.2s",
                    }}
                  >
                    <td
                      style={{
                        padding: "1.25rem 1rem",
                        fontWeight: "600",
                        color: "var(--primary)",
                      }}
                    >
                      {app.job_details?.title}
                    </td>
                    <td style={{ padding: "1.25rem 1rem" }}>
                      {app.job_details?.employer?.username}
                    </td>
                    <td
                      style={{
                        padding: "1.25rem 1rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(app.applied_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "1.25rem 1rem" }}>
                      <span className={`badge badge-${app.status}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              You haven't applied for any jobs yet.
            </p>
            <a href="/" className="btn-primary">
              Browse Jobs
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;
