import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentFeeDetails.css";

const StudentFeeDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && !isNaN(id)) fetchFeeDetails(id);
    else {
      setError("Invalid Student ID");
      setLoading(false);
    }
  }, [id]);

  const fetchFeeDetails = async (studentId) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("id", studentId);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminFee/getFeeDetails",
        formData
      );

      if (response.data?.status) {
        setStudent(response.data.info || null);
        setDetails(response.data.details || []);
      } else {
        setStudent(null);
        setDetails([]);
        setError(response.data?.message || "No data found.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Server Error. Please check backend.");
      setStudent(null);
      setDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const timestamp = Date.parse(value);
    if (isNaN(timestamp)) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!student) return <div className="no-student">No student found</div>;

  return (
    <div className="fee-container">
      <div className="student-card">
        {/* Top Section */}
        <div className="student-top">
          <div className="student-image-box">
            <img
              src={
                student.image
                  ? `http://localhost/kkblossom/assets/images/students/${student.image}`
                  : `http://localhost/kkblossom/assets/icons/user.svg`
              }
              alt="Student"
            />
          </div>

          <div className="student-info-box">
            <h2 className="student-name">{student.Name || "N/A"}</h2>
            <p><strong>Class:</strong> {student.Class || "N/A"}</p>
            <p><strong>Roll No:</strong> {student.Rollno || "N/A"}</p>
          </div>
        </div>

        {/* Fee Details Section */}
        <div className="fee-section">
          {details.length === 0 ? (
            <h3 className="no-details">Nothing to show.</h3>
          ) : (
            <>
              <p className="section-title">Fee Details</p>
              {details.map((fee, idx) => (
                <div key={idx} className="fee-box">
                  <p><strong>Period:</strong> {fee.period}</p>
                  <p><strong>Status:</strong> {fee.status}</p>
                  <p><strong>Last Date:</strong> {formatDate(fee.lastdate)}</p>
                  {fee.paidondate && <p><strong>Paid On:</strong> {formatDate(fee.paidondate)}</p>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeeDetails;