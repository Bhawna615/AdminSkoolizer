import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CharacterCertificate.css";

const CharacterCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [admissionDate, setAdmissionDate] = useState(null);
  const [graduationDate, setGraduationDate] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      setMessage({ type: "error", text: "Student ID is missing." });
      return;
    }

    if (!admissionDate || !graduationDate) {
      setMessage({
        type: "error",
        text: "Please select both admission and graduation dates.",
      });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const payload = {
        student_id: id,
        admission_date: admissionDate.toLocaleDateString("en-GB"),
        graduation_date: graduationDate.toLocaleDateString("en-GB"),
      };

      console.log("Sending Data:", payload);

      const response = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudent/generateCharacterCertificate",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        navigate("/dashboard/StudentComponent/ViewCharacterCertificates", {
          state: {
            type: "success",
            text: response.data.message,
          },
        });
      } else {
        setMessage({
          type: "error",
          text: response.data.message,
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="character-page">
      <div className="character-container">
        {/* PAGE HEADER */}
        <div className="character-header">
          <div className="character-header-icon">
            <i className="bi bi-award-fill"></i>
          </div>

          <div>
            <h2>Character Certificate</h2>
            <p>
              Enter the student's admission and graduation details to generate
              the certificate.
            </p>
          </div>
        </div>

        {/* MESSAGE */}
        {message.text && (
          <div
            className={`certificate-message ${
              message.type === "success"
                ? "certificate-success"
                : "certificate-error"
            }`}
          >
            <i
              className={
                message.type === "success"
                  ? "bi bi-check-circle-fill"
                  : "bi bi-exclamation-circle-fill"
              }
            ></i>

            <span>{message.text}</span>
          </div>
        )}

        {/* FORM CARD */}
        <div className="character-card">
          <div className="character-card-header">
            <div>
              <h3>Certificate Details</h3>
              <p>Please select the required dates below.</p>
            </div>

            <div className="certificate-badge">
              <i className="bi bi-file-earmark-text-fill"></i>
              Character Certificate
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="character-form-grid">
              {/* ADMISSION DATE */}
              <div className="certificate-field">
                <label>
                  <i className="bi bi-calendar-plus"></i>
                  Admission Date
                </label>

                <DatePicker
                  selected={admissionDate}
                  onChange={(date) => setAdmissionDate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select admission date"
                  className="certificate-date-input"
                  maxDate={new Date()}
                />
              </div>

              {/* GRADUATION DATE */}
              <div className="certificate-field">
                <label>
                  <i className="bi bi-mortarboard-fill"></i>
                  Graduation Date
                </label>

                <DatePicker
                  selected={graduationDate}
                  onChange={(date) => setGraduationDate(date)}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Select graduation date"
                  className="certificate-date-input"
                  minDate={admissionDate || undefined}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="certificate-actions">
              <button
                type="button"
                className="certificate-cancel-btn"
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i>
                Back
              </button>

              <button
                type="submit"
                className="certificate-generate-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="certificate-spinner"></span>
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

        {/* INFORMATION CARD */}
        <div className="certificate-info-card">
          <div className="certificate-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <div>
            <h4>Before generating</h4>
            <p>
              Please verify the admission and graduation dates carefully. These
              details will be used in the student's character certificate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCertificate;