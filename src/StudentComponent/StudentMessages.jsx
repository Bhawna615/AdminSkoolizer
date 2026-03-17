import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./StudentMessages.css";

const StudentMessages = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id && !isNaN(id)) {
      fetchMessages(id);
    } else {
      setError("Invalid Student ID");
      setLoading(false);
    }
  }, [id]);

  const fetchMessages = async (studentId) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("id", studentId);

      const response = await axios.post(
        `http://localhost/kkblossom/api.php/Adminapi/AdminMessage/getMessages`,
        formData
      );

      if (response.data?.status === true) {
        setStudent(response.data.info || null);
        setMessages(response.data.messages || []);
      } else {
        setStudent(null);
        setMessages([]);
        setError(response.data?.message || "No data found.");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Server Error. Please check backend.");
      setStudent(null);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const timestamp = Date.parse(value);
    if (isNaN(timestamp)) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!student) return <div className="no-student">No student found</div>;

  return (
    <div className="messages-container">
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
            <h2 >{student.Name || "N/A"}</h2>
            <p><strong>Class:</strong> {student.Class || "N/A"}</p>
            <p><strong>Roll No:</strong> {student.Rollno || "N/A"}</p>
          </div>
        </div>

        {/* Messages Section */}
        <div className="messages-section">
          {messages.length === 0 ? (
            <h3 className="no-details">Nothing to show.</h3>
          ) : (
            <>
              <h3 className="section-title">Sent Messages</h3>
              {messages.map((msg, index) => (
                <div key={index} className="message-box">
                  <p><strong>Message:</strong> {msg.message}</p>
                  <p><strong>Time:</strong> {formatDate(msg.sent_at)}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMessages;