
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =====================================================
  // FETCH STUDENT DATA
  // =====================================================

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
        } else if (
          Array.isArray(res.data) &&
          res.data.length > 0
        ) {
          setStudent(res.data[0]);
        } else if (
          typeof res.data === "object" &&
          !Array.isArray(res.data)
        ) {
          setStudent(res.data);
        } else {
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

  // =====================================================
  // INLINE MESSAGE
  // =====================================================

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3500);
  };

  // =====================================================
  // SUBMIT CREDENTIALS
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      showMessage("Please enter a password.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage(
        "Password must contain at least 6 characters.",
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);

      await axios.post(
        `${BASE_URL}AdminStudent/storeCredentials`,
        {
          id: id,
          password: password,
        }
      );

      showMessage(
        "Credentials generated successfully!",
        "success"
      );

      setTimeout(() => {
        navigate(
          `/dashboard/StudentComponent/ViewStudentProfile/${id}`,
          {
            state: {
              successMessage: "Credentials generated successfully"
            }
          }
        );
      }, 2500);

    } catch (error) {
      console.error("Store Error:", error);

      showMessage(
        error.response?.data?.message ||
        "Failed to generate credentials.",
        "error"
      );

    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // FULL SCREEN LOADER
  // =====================================================

  if (loading) {
    return (
      <div className="student-cred-loading">

        <div className="student-cred-loader"></div>

        <h3>Loading Student Details</h3>

        <p>Please wait while we prepare the credentials form.</p>

      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error) {
    return (
      <div className="student-cred-error-page">

        <div className="student-cred-error-icon">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>

        <h3>Something went wrong</h3>

        <p>{error}</p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="student-cred-back-button"
        >
          <i className="bi bi-arrow-left"></i>
          Go Back
        </button>

      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="student-cred-container">

      {/* INLINE MESSAGE */}

      {message && (
        <div className="student-cred-message-overlay">

          <div
            className={`student-cred-message-box ${
              messageType === "success"
                ? "student-cred-success"
                : "student-cred-error"
            }`}
          >

            <div className="student-cred-message-icon">

              {messageType === "success" ? (
                <i className="bi bi-check-circle-fill"></i>
              ) : (
                <i className="bi bi-exclamation-circle-fill"></i>
              )}

            </div>

            <h3>
              {messageType === "success"
                ? "Success!"
                : "Unable to Continue"}
            </h3>

            <p>{message}</p>

          </div>

        </div>
      )}

      {/* PAGE HEADER */}

      <div className="student-cred-page-header">

        <div className="student-cred-page-heading">

          <span className="student-cred-eyebrow">
            STUDENT MANAGEMENT
          </span>

          <h1>Generate Credentials</h1>

          <p>
            Create secure login credentials for student access.
          </p>

        </div>

        <div className="student-cred-page-icon">
          <i className="bi bi-shield-lock-fill"></i>
        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="student-cred-main">

        {/* LEFT INFORMATION */}

        <div className="student-cred-info-panel">

          <div className="student-cred-info-icon">
            <i className="bi bi-person-lock"></i>
          </div>

          <span className="student-cred-info-label">
            ACCOUNT SETUP
          </span>

          <h2>Student Login Credentials</h2>

          <p>
            Generate login credentials to allow students to
            securely access their school account.
          </p>

          <div className="student-cred-info-divider"></div>

          <div className="student-cred-info-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Secure student account access</span>
          </div>

          <div className="student-cred-info-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Admission number as account identity</span>
          </div>

          <div className="student-cred-info-feature">
            <i className="bi bi-check-circle-fill"></i>
            <span>Personalized login password</span>
          </div>

          <div className="student-cred-security-note">

            <i className="bi bi-shield-check"></i>

            <span>
              Keep student login credentials confidential
              and share them securely.
            </span>

          </div>

        </div>

        {/* FORM CARD */}

        <div className="student-cred-form-card">

          <div className="student-cred-form-header">

            <div>
              <span className="student-cred-form-label">
                ACCOUNT DETAILS
              </span>

              <h2>Create Student Account</h2>

              <p>
                Enter the password to generate credentials.
              </p>
            </div>

            <div className="student-cred-form-icon">
              <i className="bi bi-key-fill"></i>
            </div>

          </div>

          {student && (

            <form
              onSubmit={handleSubmit}
              className="student-cred-form"
            >

              {/* ADMISSION NUMBER */}

              <div className="student-cred-group">

                <label className="student-cred-label">
                  Admission Number
                </label>

                <div className="student-cred-input-wrapper">

                  <i className="bi bi-person-badge student-cred-input-icon"></i>

                  <input
                    type="text"
                    className="student-cred-input student-cred-disabled-input"
                    value={student.Admno || ""}
                    disabled
                  />

                  <i className="bi bi-lock-fill student-cred-field-lock"></i>

                </div>

                <span className="student-cred-field-hint">
                  <i className="bi bi-info-circle"></i>
                  This admission number is automatically assigned.
                </span>

              </div>

              {/* PASSWORD */}

              <div className="student-cred-group">

                <label className="student-cred-label">
                  Create Password
                </label>

                <div className="student-cred-input-wrapper">

                  <i className="bi bi-shield-lock student-cred-input-icon"></i>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="student-cred-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    minLength={6}
                    autoComplete="new-password"
                    required
                  />

                  <button
                    type="button"
                    className="student-cred-toggle-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    <i
                      className={
                        showPassword
                          ? "bi bi-eye-slash-fill"
                          : "bi bi-eye-fill"
                      }
                    ></i>
                  </button>

                </div>

                <span className="student-cred-field-hint">
                  <i className="bi bi-info-circle"></i>
                  Use at least 6 characters.
                </span>

              </div>

              {/* PASSWORD PREVIEW */}

              {password && (

                <div className="student-cred-password-status">

                  <i className="bi bi-shield-check"></i>

                  <span>
                    Password entered ({password.length} characters)
                  </span>

                </div>

              )}

              {/* FORM BUTTONS */}

              <div className="student-cred-button-area">

                <button
                  type="button"
                  className="student-cred-cancel-button"
                  onClick={() =>
                    navigate(
                      `/dashboard/StudentComponent/ViewStudentProfile/${id}`
                    )
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="student-cred-button"
                  disabled={submitting}
                >

                  {submitting ? (
                    <>
                      <span className="student-cred-button-loader"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-shield-lock-fill"></i>
                      Generate Credentials
                    </>
                  )}

                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>
  );
};

export default CreateCredentials;
