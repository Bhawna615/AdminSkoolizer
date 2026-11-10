
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./ViewStudentProfile.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/";
const IMAGE_BASE = "http://localhost/kkblossom/assets/images/students/";
const QR_BASE = "http://localhost/kkblossom/assets/images/students/qrcode/";
const DEFAULT_IMAGE =
  "http://localhost/kkblossom/assets/icons/user-black.png";

const ViewStudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [imageError, setImageError] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStudent = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(
          `${BASE_URL}AdminStudent/view/${studentId}`
        );

        const data = Array.isArray(res.data)
          ? res.data[0]
          : res.data;

        if (!data) {
          throw new Error("Student profile not found.");
        }

        if (isMounted) {
          setStudent(data);
          setImageError(false);
          setQrError(false);
        }
      } catch (err) {
        console.error("Failed to fetch student profile:", err);

        if (isMounted) {
          setError(
            err.message === "Student profile not found."
              ? err.message
              : "Unable to load student profile. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStudent();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  useEffect(() => {
    if (!location.state?.successMessage) return;

    setSuccessMessage(location.state.successMessage);

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [location.state]);

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "-";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return value;
  };

  const formatFee = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return value;
    }

    return `₹${numericValue.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getGender = (gender) => {
    const normalizedGender = String(gender || "").toLowerCase();

    if (normalizedGender === "m" || normalizedGender === "male") {
      return "Male";
    }

    if (normalizedGender === "f" || normalizedGender === "female") {
      return "Female";
    }

    return displayValue(gender);
  };

  const handleEdit = () => {
    navigate(
      `/dashboard/StudentComponent/EditStudent/${student.id}`
    );
  };

  if (loading) {
    return (
      <div className="vsp-page">
        <div className="vsp-state">
          <div className="vsp-loader-ring" />
          <h2>Loading student profile</h2>
          <p>Please wait while we retrieve the student details.</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="vsp-page">
        <div className="vsp-state vsp-error-state">
          <div className="vsp-state-icon">!</div>
          <h2>Profile unavailable</h2>
          <p>{error || "Student profile could not be found."}</p>

          <button
            type="button"
            className="vsp-primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

          <button
            type="button"
            className="vsp-secondary-btn"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const studentImage = student.image
    ? `${IMAGE_BASE}${student.image}`
    : DEFAULT_IMAGE;

  return (
    <div className="vsp-page">
      <div className="vsp-container">

        {/* PAGE HEADING */}
        <div className="vsp-page-heading">
          <div className="vsp-breadcrumb">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="vsp-back-btn"
              aria-label="Go back"
            >
              <span aria-hidden="true">←</span>
            </button>

            <div>
              <div className="vsp-eyebrow">STUDENT MANAGEMENT</div>
              <h1>Student Profile</h1>
              <p>View and manage student information.</p>
            </div>
          </div>

          <div className="vsp-heading-tag">
            <span className="vsp-status-dot" />
            Student Record
          </div>
        </div>

        {/* SUCCESS MESSAGE
        {successMessage && (
          <div
            className="vsp-success-message"
            role="status"
            aria-live="polite"
          >
            <span className="vsp-success-icon">✓</span>
            <span>{successMessage}</span>

            <button
              type="button"
              className="vsp-message-close"
              onClick={() => setSuccessMessage("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )} */}

        {/* STUDENT IDENTITY CARD */}
        <section className="vsp-identity-card">
          <div className="vsp-identity-decoration vsp-decoration-one" />
          <div className="vsp-identity-decoration vsp-decoration-two" />

          <div className="vsp-identity-content">
            <div className="vsp-avatar-frame">
              <img
                src={imageError ? DEFAULT_IMAGE : studentImage}
                alt={`${student.Name || "Student"} profile`}
                className="vsp-avatar"
                onError={() => setImageError(true)}
              />

              <span
                className="vsp-avatar-status"
                title="Student record available"
              />
            </div>

            <div className="vsp-identity-details">
              <span className="vsp-identity-label">
                STUDENT INFORMATION
              </span>

              <h2>{displayValue(student.Name)}</h2>

              <p className="vsp-identity-subtitle">
                Student profile and academic record
              </p>

              <div className="vsp-identity-meta">
                <div className="vsp-meta-chip">
                  <span className="vsp-meta-icon">▦</span>
                  <span>
                    <small>CLASS</small>
                    <strong>{displayValue(student.Class)}</strong>
                  </span>
                </div>

                <div className="vsp-meta-chip">
                  <span className="vsp-meta-icon">#</span>
                  <span>
                    <small>ROLL NUMBER</small>
                    <strong>{displayValue(student.Rollno)}</strong>
                  </span>
                </div>

                <div className="vsp-meta-chip">
                  <span className="vsp-meta-icon">ID</span>
                  <span>
                    <small>ADMISSION NO.</small>
                    <strong>{displayValue(student.Admno)}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="vsp-identity-actions">
            <button
              type="button"
              className="vsp-edit-btn"
              onClick={handleEdit}
            >
              <span aria-hidden="true">✎</span>
              Edit Profile
            </button>
          </div>
        </section>

        {/* QUICK INFORMATION */}
        <div className="vsp-overview-grid">
          <div className="vsp-overview-card">
            <div className="vsp-overview-icon vsp-icon-purple">▦</div>
            <div className="vsp-overview-text">
              <span>Class</span>
              <strong>{displayValue(student.Class)}</strong>
              <small>Current class</small>
            </div>
          </div>

          <div className="vsp-overview-card">
            <div className="vsp-overview-icon vsp-icon-blue">#</div>
            <div className="vsp-overview-text">
              <span>Roll Number</span>
              <strong>{displayValue(student.Rollno)}</strong>
              <small>Student identification</small>
            </div>
          </div>

          <div className="vsp-overview-card">
            <div className="vsp-overview-icon vsp-icon-orange">ID</div>
            <div className="vsp-overview-text">
              <span>Admission No.</span>
              <strong>{displayValue(student.Admno)}</strong>
              <small>Admission record</small>
            </div>
          </div>

          <div className="vsp-overview-card">
            <div className="vsp-overview-icon vsp-icon-green">₹</div>
            <div className="vsp-overview-text">
              <span>Tuition Fee</span>
              <strong>{formatFee(student.tuition_fee)}</strong>
              <small>Recorded tuition fee</small>
            </div>
          </div>
        </div>

        {/* INFORMATION SECTIONS */}
        <div className="vsp-section-heading">
          <div>
            <h2>Student Details</h2>
            <p>Personal, family, contact and admission information.</p>
          </div>
          <span className="vsp-record-label">PROFILE DETAILS</span>
        </div>

        <div className="vsp-details-grid">

          {/* PERSONAL INFORMATION */}
          <ProfileSection
            icon="01"
            title="Personal Information"
            subtitle="Student's basic details"
          >
            <ProfileItem label="Full Name" value={student.Name} />
            <ProfileItem
              label="Date of Birth"
              value={formatDate(student.Dob)}
            />
            <ProfileItem
              label="Gender"
              value={getGender(student.gender)}
            />
            <ProfileItem label="Height" value={student.height} />
            <ProfileItem
              label="Weight"
              value={
                student.weight !== null &&
                student.weight !== undefined &&
                student.weight !== ""
                  ? student.weight
                  : "-"
              }
            />
            <ProfileItem
              label="Blood Group"
              value={student.blood_group}
            />
            <ProfileItem label="House" value={student.House} />
          </ProfileSection>

          {/* FAMILY INFORMATION */}
          <ProfileSection
            icon="02"
            title="Family Information"
            subtitle="Parent and guardian details"
          >
            <ProfileItem
              label="Father's Name"
              value={student.Fname}
            />
            <ProfileItem
              label="Mother's Name"
              value={student.Mname}
            />
            <ProfileItem
              label="Guardian's Name"
              value={student.Guardianname}
            />
          </ProfileSection>

          {/* CONTACT INFORMATION */}
          <ProfileSection
            icon="03"
            title="Contact Information"
            subtitle="Address and contact details"
          >
            <ProfileItem label="Address" value={student.Address} />
            <ProfileItem label="Contact Number" value={student.Contact} />
            <ProfileItem label="SMS Number" value={student.Smsno} />
            <ProfileItem label="Email Address" value={student.Email} />
            <ProfileItem
              label="Aadhaar Number"
              value={student.Aadharno}
            />
          </ProfileSection>

          {/* ADMISSION INFORMATION */}
          <ProfileSection
            icon="04"
            title="Admission Information"
            subtitle="School enrollment details"
          >
            <ProfileItem
              label="Admission Number"
              value={student.Admno}
            />
            <ProfileItem
              label="Admission Date"
              value={formatDate(student.admission_date)}
            />
            <ProfileItem
              label="Previous School"
              value={student.Lastschool}
            />
            <ProfileItem
              label="Transport ID"
              value={student.Passengerid}
            />
          </ProfileSection>

          {/* FEE INFORMATION */}
          <ProfileSection
            icon="05"
            title="Fee Information"
            subtitle="Recorded student fee amounts"
          >
            <ProfileItem
              label="Tuition Fee"
              value={formatFee(student.tuition_fee)}
            />
            <ProfileItem
              label="Annual Fee"
              value={formatFee(student.annual_fee)}
            />
            <ProfileItem
              label="Admission Fee"
              value={formatFee(student.admission_fee)}
            />
            <ProfileItem
              label="Transport Fee"
              value={formatFee(student.transport_fee)}
            />
          </ProfileSection>

          {/* QR CODE */}
          <section className="vsp-section vsp-qr-section">
            <div className="vsp-section-header">
              <div className="vsp-section-number vsp-qr-number">
                06
              </div>

              <div className="vsp-section-title-wrap">
                <h3>Student QR Code</h3>
                <p>Student identification</p>
              </div>
            </div>

            <div className="vsp-qr-content">
              {student.qrcode && !qrError ? (
                <>
                  <div className="vsp-qr-image-frame">
                    <img
                      src={`${QR_BASE}${student.qrcode}.png`}
                      alt="Student QR Code"
                      className="vsp-qr-image"
                      onError={() => setQrError(true)}
                    />
                  </div>

                  <h4>Student Identification QR</h4>
                  <p>Scan this code using a compatible QR scanner.</p>

                  <span className="vsp-qr-code-label">
                    {student.qrcode}
                  </span>
                </>
              ) : (
                <div className="vsp-qr-empty">
                  <div className="vsp-qr-empty-icon">▦</div>
                  <h4>QR code unavailable</h4>
                  <p>
                    {student.qrcode
                      ? "The QR code image could not be loaded."
                      : "No QR code is available for this student."}
                  </p>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="vsp-footer">
          <span className="vsp-footer-mark">S</span>
          <p>
            <span>Student Management System</span>
          </p>

          <button
            type="button"
            className="vsp-footer-back"
            onClick={() => navigate(-1)}
          >
            ← Back to previous page
          </button>
        </div>

      </div>
    </div>
  );
};

const ProfileSection = ({ icon, title, subtitle, children }) => (
  <section className="vsp-section">
    <div className="vsp-section-header">
      <div className="vsp-section-number">{icon}</div>

      <div className="vsp-section-title-wrap">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
    </div>

    <div className="vsp-section-content">{children}</div>
  </section>
);

const ProfileItem = ({ label, value }) => {
  const formattedValue =
    value === null || value === undefined || value === ""
      ? "-"
      : value;

  return (
    <div className="vsp-profile-item">
      <span className="vsp-profile-label">{label}</span>
      <span className="vsp-profile-value">{formattedValue}</span>
    </div>
  );
};

export default ViewStudentProfile;
