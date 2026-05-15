import React, { useState, useEffect } from "react";
import client from "../api/client";

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await client.get("/profile/");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("email", profile.email || "");
      
      if (user.role === "candidate") {
        formData.append("bio", profile.bio || "");
        formData.append("skills", profile.skills || "");
        if (resume) {
          formData.append("resume", resume);
        }
      }

      await client.patch("/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>My Profile</h1>
      <div className="card" style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email || ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Enter your email"
              required
            />
          </div>

          {user?.role === "candidate" && (
            <>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  rows="4"
                  value={profile.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  value={profile.skills || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, skills: e.target.value })
                  }
                  placeholder="e.g. JavaScript, React, Python"
                />
              </div>
              <div className="form-group">
                <label>Resume (PDF)</label>
                {profile.resume && (
                  <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                    Current Resume:{" "}
                    <a
                      href={`http://localhost:8000${profile.resume}`}
                      target="_blank"
                      style={{ color: "#2563eb" }}
                    >
                      View
                    </a>
                  </p>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
            </>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
