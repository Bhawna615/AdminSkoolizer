// CreateCredentials.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateCredentials.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/";

const CreateCredentials = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔹 Fetch student data
  useEffect(() => {
    if (!id) {
      setError("Invalid student ID");
      setLoading(false);
      return;
    }

    axios
      .get(`${BASE_URL}AdminStudent/view/${id}`)
      .then((res) => {
        console.log("API Response:", res.data);

        if (!res.data) {
          setError("No data received from server");
        } 
        else if (Array.isArray(res.data) && res.data.length > 0) {
          setStudent(res.data[0]);
        } 
        else if (typeof res.data === "object") {
          setStudent(res.data);
        } 
        else {
          setError("Student not found");
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to fetch student data");
        setLoading(false);
      });
  }, [id]);

  // 🔹 Submit credentials
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}AdminStudent/storeCredentials`,
        {
          id: id,
          password: password,
        }
      );

      console.log("Store Response:", response.data);

      // ✅ Navigate immediately with success message
      navigate(`/dashboard/StudentComponent/ViewStudentProfile/${id}`, {
        state: { successMessage: "Credentials generated successfully" }
      });

    } catch (error) {
      console.error("Store Error:", error);
      setError("Failed to generate credentials");
    }
  };

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="container mt-4">
        <h4>Loading student data...</h4>
      </div>
    );
  }

  // 🔹 Error State
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // 🔹 Main UI
  return (
    <div className="cred-wrapper">
      <div className="cred-card">
        <div className="col-12 title-bar">
          <p style={{ padding: "10px", margin: 0 }}>Details</p>
        </div>

        {student && (
          <form onSubmit={handleSubmit} className="cred-form">
            <div className="cred-group">
              <label className="cred-label">Admission No.</label>
              <input
                type="text"
                className="cred-input"
                value={student.Admno || ""}
                disabled
              />
            </div>

            <div className="cred-group">
              <label className="cred-label">Password</label>
              <input
                type="password"
                className="cred-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <button type="submit" className="cred-button">
              Generate
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateCredentials;