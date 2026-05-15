import React, { useState, useEffect } from 'react';
import client from '../api/client';

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, statsRes] = await Promise.all([
          client.get('jobs/applications/'),
          client.get('jobs/stats/')
        ]);
        setApplications(appsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Journey</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your applications and career progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none' }}>
          <p style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: '600' }}>TOTAL APPLICATIONS</p>
          <h2 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>{stats?.total_applied || 0}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>INTERVIEWS / SHORTLISTED</p>
          <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', color: 'var(--success)' }}>{stats?.shortlisted || 0}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>PROFILE COMPLETION</p>
          <h2 style={{ fontSize: '3rem', marginTop: '0.5rem', color: 'var(--primary)' }}>85%</h2>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Applications</h2>
        {applications.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-subtle)' }}>
                  <th style={{ padding: '1.25rem 1rem' }}>Job Opportunity</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Company</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Applied On</th>
                  <th style={{ padding: '1.25rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem 1rem', fontWeight: '600', color: 'var(--primary)' }}>
                      {app.job_details?.title}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>{app.job_details?.employer?.username}</td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-muted)' }}>
                      {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}>
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
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't applied for any jobs yet.</p>
            <a href="/" className="btn-primary">Browse Jobs</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;
