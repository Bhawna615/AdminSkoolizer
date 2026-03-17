import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentTransportDetails.css";

const StudentExamDetails = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && !isNaN(id)) {
      fetchExamDetails(id);
    } else {
      setError("Invalid Student ID");
      setLoading(false);
    }
  }, [id]);

  const fetchExamDetails = async (studentId) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("id", studentId);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/getExamDetails",
        formData
      );

      if (response.data?.status === true) {
        setStudent(response.data.info || null);

        // Map exams safely and merge uploaded date if available
        const examsWithDates = (response.data.exams || []).map((exam) => {
          // Use uploaded_at from student_marks if it exists
          let uploadedDate = exam.Date; // default
          if (response.data.student_marks && Array.isArray(response.data.student_marks)) {
            const match = response.data.student_marks.find(
              (m) =>
                (m.Subject && m.Subject === exam.Subject) ||
                (m.Examcode && m.Examcode === exam.Examcode) // use proper key from backend
            );
            if (match && match.uploaded_at) uploadedDate = match.uploaded_at;
          }

          return {
            ...exam,
            Date: uploadedDate,
          };
        });

        setExams(examsWithDates);
      } else {
        setStudent(null);
        setExams([]);
        setError(response.data?.message || "No data found.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Server Error. Please check backend.");
      setStudent(null);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Safe date formatter
 const formatDate = (value) => {
  if (!value) return "N/A";

  const timestamp = Date.parse(value);
  if (isNaN(timestamp)) return "N/A";

  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!student) return <div className="no-student">No student found</div>;

  return (
    <div className="transport-container">
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

        {/* Bottom Section */}
        <div className="transport-section">
          {exams.length === 0 ? (
            <h3 className="no-details">Nothing to show.</h3>
          ) : (
            <>
              <h3 className="section-title">Exam Details</h3>
              {exams.map((exam, index) => (
                <div key={index} className="transport-box">
                  <p><strong>Exam Name:</strong> {exam.Examname || "N/A"}</p>
                  <p><strong>Subject:</strong> {exam.Subject || "N/A"}</p>
                  <p><strong>Date:</strong> {formatDate(exam.Date)}</p>
                </div>
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentExamDetails;