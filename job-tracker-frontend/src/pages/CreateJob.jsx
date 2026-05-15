import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";

function CreateJob({ isEdit = false }) {
  const { id } = useParams();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
    status: "open",
  });
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        try {
          const response = await client.get(`jobs/${id}/`);
          setFormData({
            title: response.data.title,
            role: response.data.role,
            location: response.data.location,
            salary: response.data.salary,
            description: response.data.description,
            skills: response.data.skills,
            status: response.data.status,
          });
        } catch (error) {
          console.error("Error fetching job:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await client.put(`jobs/${id}/`, formData);
      } else {
        await client.post("jobs/", formData);
      }
      navigate("/employer-dashboard");
    } catch (error) {
      alert("Error saving job: " + JSON.stringify(error.response?.data));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>{isEdit ? "Update Job Listing" : "Post a New Job"}</h1>
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ marginTop: "2rem" }}
      >
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>
        <div className="form-group">
          <label>Role Category</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g. Engineering"
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="e.g. Remote, San Francisco"
          />
        </div>
        <div className="form-group">
          <label>Salary (Annual)</label>
          <input
            type="number"
            required
            value={formData.salary}
            onChange={(e) =>
              setFormData({ ...formData, salary: e.target.value })
            }
            placeholder="e.g. 120000"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="5"
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="form-group">
          <label>Required Skills</label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) =>
              setFormData({ ...formData, skills: e.target.value })
            }
            placeholder="e.g. React, Node.js, Python"
          />
        </div>
        {isEdit && (
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        )}
        <div
          style={{ display: "flex", gap: "1rem", marginTop: "1rem", padding }}
        >
          <button type="submit" className="btn-primary" style={{ flex: 1 }}>
            {isEdit ? "Update Listing" : "Post Job"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateJob;
