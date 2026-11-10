
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./StudentMessages.css";

const StudentMessages = () => {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH STUDENT MESSAGES
  // =====================================================

  const fetchMessages = useCallback(async (studentId) => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("id", studentId);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminMessage/getMessages",
        formData
      );

      console.log("Student Messages API Response:", response.data);

      if (response.data?.status === true) {
        const studentInfo = Array.isArray(response.data.info)
          ? response.data.info[0]
          : response.data.info;

        const messageData = Array.isArray(response.data.messages)
          ? response.data.messages
          : [];

        console.log("Message Date Fields:", messageData);

        setStudent(studentInfo || null);
        setMessages(messageData);

        if (!studentInfo) {
          setError("Student information is not available.");
        }
      } else {
        setStudent(null);
        setMessages([]);
        setError(response.data?.message || "No messages found.");
      }
    } catch (err) {
      console.error(
        "Student Messages API Error:",
        err.response?.data || err.message
      );

      setStudent(null);
      setMessages([]);
      setError("Server Error. Please check the backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================================
  // LOAD DATA WHEN STUDENT ID CHANGES
  // =====================================================

  useEffect(() => {
    if (id && !isNaN(Number(id)) && Number(id) > 0) {
      fetchMessages(id);
    } else {
      setStudent(null);
      setMessages([]);
      setError("Invalid Student ID");
      setLoading(false);
    }
  }, [id, fetchMessages]);

  // =====================================================
  // FORMAT MESSAGE DATE
  // =====================================================

  const formatDate = (msg) => {
    if (!msg || typeof msg !== "object") {
      return "N/A";
    }

    // Check all possible date field names
    const dateFields = [
      "sent_at",
      "created_at",
      "message_date",
      "date",
      "Date",
      "datetime",
      "timestamp",
      "created_on",
      "date_created",
      "sent_date",
      "msg_date",
      "added_on",
      "created"
    ];

    let dateValue = null;

    for (const field of dateFields) {
      if (
        msg[field] !== undefined &&
        msg[field] !== null &&
        String(msg[field]).trim() !== ""
      ) {
        dateValue = msg[field];
        break;
      }
    }

    if (!dateValue) {
      console.warn("No date field found for message:", msg);
      return "N/A";
    }

    // Handle invalid MySQL dates
    const invalidDates = [
      "0000-00-00",
      "0000-00-00 00:00:00",
      "0000-00-00T00:00:00"
    ];

    if (invalidDates.includes(String(dateValue).trim())) {
      return "N/A";
    }

    let parsedDate;

    // Handle Unix timestamps
    if (
      typeof dateValue === "number" ||
      /^\d{10,13}$/.test(String(dateValue).trim())
    ) {
      let timestamp = Number(dateValue);

      // Seconds to milliseconds
      if (timestamp < 100000000000) {
        timestamp *= 1000;
      }

      parsedDate = new Date(timestamp);
    } else {
      let dateString = String(dateValue).trim();

      // Handle MySQL datetime format
      // YYYY-MM-DD HH:mm:ss
      if (
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)
      ) {
        dateString = dateString.replace(" ", "T");
      }

      parsedDate = new Date(dateString);
    }

    // Validate date
    if (
      !parsedDate ||
      Number.isNaN(parsedDate.getTime())
    ) {
      console.warn("Invalid message date:", dateValue, msg);
      return "N/A";
    }

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="student-messages-loading">
        <div className="student-messages-loader"></div>

        <h3>Loading Messages</h3>

        <p>
          Please wait while we fetch student messages.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <div className="student-messages-state-container">

        <div className="student-messages-state-icon student-messages-error-icon">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>

        <h3>Unable to Load Messages</h3>

        <p>{error}</p>

        <button
          type="button"
          className="student-messages-retry-btn"
          onClick={() => fetchMessages(id)}
        >
          <i className="bi bi-arrow-clockwise"></i>
          Try Again
        </button>

      </div>
    );
  }

  // =====================================================
  // STUDENT NOT FOUND
  // =====================================================

  if (!student) {
    return (
      <div className="student-messages-state-container">

        <div className="student-messages-state-icon">
          <i className="bi bi-person-x-fill"></i>
        </div>

        <h3>No Student Found</h3>

        <p>Student information is not available.</p>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="student-messages-container">

      {/* PAGE HEADER */}

      <div className="student-messages-page-header">

        <div>
          <span className="student-messages-eyebrow">
            STUDENT MANAGEMENT
          </span>

          <h1>Student Messages</h1>

          <p>
            View all messages sent to this student's account.
          </p>
        </div>

        <div className="student-messages-header-icon">
          <i className="bi bi-chat-left-text-fill"></i>
        </div>

      </div>

      {/* STUDENT PROFILE */}

      <div className="student-messages-profile-card">

        <div className="student-messages-profile-left">

          <div className="student-messages-image-box">

            <img
              src={
                student.image
                  ? `http://localhost/kkblossom/assets/images/students/${student.image}`
                  : "http://localhost/kkblossom/assets/icons/user.svg"
              }
              alt="Student"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "http://localhost/kkblossom/assets/icons/user.svg";
              }}
            />

          </div>

          <div className="student-messages-info-box">

            <span className="student-messages-profile-label">
              STUDENT PROFILE
            </span>

            <h2>{student.Name || "N/A"}</h2>

            <div className="student-messages-profile-details">

              <div className="student-messages-profile-item">
                <i className="bi bi-mortarboard-fill"></i>
                <span>Class</span>
                <strong>{student.Class || "N/A"}</strong>
              </div>

              <div className="student-messages-profile-item">
                <i className="bi bi-person-badge-fill"></i>
                <span>Roll No.</span>
                <strong>{student.Rollno || "N/A"}</strong>
              </div>

            </div>

          </div>

        </div>

        <div className="student-messages-profile-decoration">
          <i className="bi bi-envelope-paper-fill"></i>
        </div>

      </div>

      {/* MESSAGE OVERVIEW */}

      <div className="student-messages-overview">

        <div className="student-messages-section-heading">

          <div>
            <h2>Message Overview</h2>
            <p>Overview of the student's communication history</p>
          </div>

        </div>

        <div className="student-messages-summary-grid">

          <div className="student-messages-summary-card">

            <div className="student-messages-summary-top">

              <div className="student-messages-summary-icon">
                <i className="bi bi-chat-square-text-fill"></i>
              </div>

              <span className="student-messages-summary-tag">
                All Messages
              </span>

            </div>

            <h3>{messages.length}</h3>

            <p>Total Sent Messages</p>

          </div>

          <div className="student-messages-summary-card student-messages-summary-purple">

            <div className="student-messages-summary-top">

              <div className="student-messages-summary-icon">
                <i className="bi bi-send-fill"></i>
              </div>

              <span className="student-messages-summary-tag">
                Communication
              </span>

            </div>

            <h3>{messages.length}</h3>

            <p>Message Records Available</p>

          </div>

        </div>

      </div>

      {/* SENT MESSAGES */}

      <div className="student-messages-section">

        <div className="student-messages-section-heading">

          <div>
            <h2>Sent Messages</h2>
            <p>
              Complete list of messages sent to this student
            </p>
          </div>

          <span className="student-messages-count">
            <i className="bi bi-chat-dots-fill"></i>

            {messages.length}{" "}
            {messages.length === 1 ? "Message" : "Messages"}
          </span>

        </div>

        {messages.length === 0 ? (

          <div className="student-messages-empty">

            <div className="student-messages-empty-icon">
              <i className="bi bi-envelope-open"></i>
            </div>

            <h3>No Messages Yet</h3>

            <p>
              There are currently no messages available for this student.
            </p>

          </div>

        ) : (

          <div className="student-messages-list">

            {messages.map((msg, index) => (

              <div
                key={msg.id || index}
                className="student-messages-message-card"
              >

                {/* MESSAGE NUMBER */}

                <div className="student-messages-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* MESSAGE CONTENT */}

                <div className="student-messages-message-content">

                  <div className="student-messages-message-header">

                    <div className="student-messages-message-title">
                      <div className="student-messages-message-icon">
                        <i className="bi bi-chat-left-text-fill"></i>
                      </div>

                      <div>
                        <span className="student-messages-message-label">
                          MESSAGE
                        </span>

                        <h3>Message #{index + 1}</h3>
                      </div>
                    </div>

                    <span className="student-messages-sent-badge">
                      <i className="bi bi-check-circle-fill"></i>
                      Sent
                    </span>

                  </div>

                  <div className="student-messages-message-text">
                    <p>
                      {msg.message || "N/A"}
                    </p>
                  </div>

                  <div className="student-messages-message-footer">

                    <span className="student-messages-date-label">
                      <i className="bi bi-calendar2-check"></i>
                      Sent On
                    </span>

                    <span className="student-messages-date-value">
                      {formatDate(msg)}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default StudentMessages;
