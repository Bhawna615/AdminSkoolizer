
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GenerateExperienceCertificate.css";

const BASE_URL =
  "http://localhost/kkblossom/api.php/Adminapi/AdminTeacher/";

const GenerateExperienceCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [designation, setDesignation] = useState("PRINCIPAL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [classesTaught, setClassesTaught] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-close success popup and navigate after 2.5 seconds.
  // Error popup remains open until the user closes it.
  useEffect(() => {
    if (messageType !== "success" || !message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
      navigate("/dashboard/TeacherComponent/ExperienceCertificate");
    }, 2500);

    return () => clearTimeout(timer);
  }, [message, messageType, navigate]);

  const closeMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    const formData = new FormData();

    formData.append("id", id);
    formData.append("designation", designation);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("classes_taught", classesTaught);

    try {
      const res = await axios.post(
        BASE_URL + "generateExperienceCertificate",
        formData
      );

      if (res.data.status) {
        setMessage("Certificate Generated Successfully");
        setMessageType("success");

        setFromDate("");
        setToDate("");
        setClassesTaught("");
      } else {
        setMessage(
          res.data.message || "Failed to generate certificate"
        );
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
      setMessageType("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="experience-container">
      {/* PAGE HEADER */}

      <div className="experience-page-header">
        <div className="experience-title-section">
          <div className="experience-header-icon">
            <i className="bi bi-file-earmark-text-fill"></i>
          </div>

          <div>
            <h2>Experience Certificate</h2>

            <p>
              Generate a professional experience certificate
              for the selected teacher.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="experience-back-btn"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>
      </div>

      {/* MAIN CARD */}

      <div className="experience-card">
        {/* CARD HEADER */}

        <div className="experience-card-header">
          <div className="experience-card-heading">
            <div className="experience-card-icon">
              <i className="bi bi-pencil-square"></i>
            </div>

            <div>
              <h3>Certificate Details</h3>

              <p>
                Fill in the employment and teaching details
                below.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div className="experience-body">
          <form onSubmit={handleSubmit}>
            <div className="experience-form-grid">
              {/* DESIGNATION */}

              <div className="experience-form-group">
                <label>
                  <i className="bi bi-person-badge"></i>
                  Designation
                </label>

                <input
                  type="text"
                  value={designation}
                  onChange={(e) =>
                    setDesignation(e.target.value)
                  }
                  className="experience-form-input"
                  placeholder="Enter designation"
                  required
                />
              </div>

              {/* CLASSES TAUGHT */}

              <div className="experience-form-group">
                <label>
                  <i className="bi bi-mortarboard-fill"></i>
                  Classes Taught
                </label>

                <input
                  type="text"
                  value={classesTaught}
                  onChange={(e) =>
                    setClassesTaught(e.target.value)
                  }
                  className="experience-form-input"
                  placeholder="Example: Classes 6 to 10"
                  required
                />
              </div>

              {/* FROM DATE */}

              <div className="experience-form-group">
                <label>
                  <i className="bi bi-calendar-event"></i>
                  From Date
                </label>

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) =>
                    setFromDate(e.target.value)
                  }
                  className="experience-form-input"
                  required
                />
              </div>

              {/* TO DATE */}

              <div className="experience-form-group">
                <label>
                  <i className="bi bi-calendar-check"></i>
                  To Date
                </label>

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) =>
                    setToDate(e.target.value)
                  }
                  className="experience-form-input"
                  required
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div className="experience-submit-area">
              <button
                type="button"
                className="experience-cancel-btn"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-x-lg"></i>
                Cancel
              </button>

              <button
                type="submit"
                className="experience-generate-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="experience-spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-plus-fill"></i>
                    Generate Certificate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CENTERED SUCCESS / ERROR MODAL */}

      {message && (
        <div className="experience-modal-overlay">
          <div
            className={`experience-modal-popup ${
              messageType === "success"
                ? "experience-modal-success"
                : "experience-modal-error"
            }`}
            role="alertdialog"
            aria-modal="true"
            aria-live="assertive"
            aria-label={
              messageType === "success"
                ? "Success message"
                : "Error message"
            }
          >
            <button
              type="button"
              className="experience-modal-close"
              onClick={closeMessage}
              aria-label="Close message"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <div className="experience-modal-icon">
              {messageType === "success" ? (
                <i className="bi bi-check-circle-fill"></i>
              ) : (
                <i className="bi bi-exclamation-circle-fill"></i>
              )}
            </div>

            <h3>
              {messageType === "success"
                ? "Success!"
                : "Something Went Wrong"}
            </h3>

            <p>{message}</p>

            {messageType === "success" ? (
              <>
                <div className="experience-modal-progress-track">
                  <div className="experience-modal-progress-bar"></div>
                </div>

                <span className="experience-modal-note">
                  Redirecting...
                </span>
              </>
            ) : (
              <button
                type="button"
                className="experience-modal-okay-btn"
                onClick={closeMessage}
              >
                Okay
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateExperienceCertificate;
