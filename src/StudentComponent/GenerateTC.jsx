
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GenerateTC.css";

const GenerateTC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [info, setInfo] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("error");
  const [messageTitle, setMessageTitle] = useState("Validation Error");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    admission_date: "",
    admission_class: "",
    failed_mark: "",
    fee_concession: "",
    total_days: "",
    present_days: "",
    admission_number: "",
    subjects: "",
    qualified_mark: "",
    dues_date: "",
    last_school: "",
    nationality: "Indian",
    session: "",
    application_date: "",
    issue_date: "",
    reason: "",
    ncc: "",
    games_played: "",
    general_conduct: "",
    remarks: "",
  });

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/studentAttendance/${id}`
        );

        if (!active) return;

        if (res.data.status && res.data.info) {
          const student = res.data.info;
          const att = res.data.attendance || [];

          setInfo(student);
          setAttendance(att);

          const currentYear = new Date().getFullYear();
          const nextYear = currentYear + 1;

          setFormData((prev) => ({
            ...prev,
            total_days: att[0] ?? "",
            present_days: att[1] ?? "",
            admission_number: student.Admno ?? "",
            session: `${currentYear}-${nextYear}`,
          }));
        } else {
          setMessageTitle("Unable to Load Student");
          setMessage(
            res.data.message || "Unable to load student details."
          );
          setMessageType("error");
        }
      } catch (err) {
        if (active) {
          setMessageTitle("Unable to Load Student");
          setMessage(
            err.response?.data?.message ||
              "Unable to load student details. Please try again."
          );
          setMessageType("error");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setMessageTitle("Missing Student ID");
      setMessage("Student ID is missing. Please select a student first.");
      setMessageType("error");
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showMessage = (title, text, type = "error") => {
    setMessageTitle(title);
    setMessage(text);
    setMessageType(type);
  };

  const closeMessage = () => {
    const wasSuccessful = messageType === "success";

    setMessage(null);

    if (wasSuccessful) {
      navigate("/dashboard/StudentComponent/TransferCertificate", {
        state: {
          successMessage: "Transfer certificate generated successfully.",
        },
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      ["category", "Category"],
      ["admission_date", "Date of Admission"],
      ["admission_class", "Class of Admission"],
      ["admission_number", "Admission Number"],
      ["session", "Academic Session"],
      ["nationality", "Nationality"],
      ["subjects", "Subjects Studied"],
      ["qualified_mark", "Higher Class Qualification"],
      ["last_school", "Last Examination and Result"],
      ["total_days", "Total Working Days"],
      ["present_days", "Total Days Present"],
      ["dues_date", "School Dues Paid Up To"],
      ["application_date", "Application Date"],
      ["issue_date", "TC Issue Date"],
      ["reason", "Reason for Leaving"],
      ["general_conduct", "General Conduct"],
    ];

    for (const [field, label] of requiredFields) {
      if (
        formData[field] === null ||
        formData[field] === undefined ||
        String(formData[field]).trim() === ""
      ) {
        return `${label} is required. Please fill in this field.`;
      }
    }

    const dateFields = [
      ["admission_date", "Date of Admission"],
      ["dues_date", "School Dues Paid Up To"],
      ["application_date", "Application Date"],
      ["issue_date", "TC Issue Date"],
    ];

    for (const [field, label] of dateFields) {
      const date = formData[field];

      if (!date || Number.isNaN(Date.parse(date))) {
        return `Please enter a valid ${label.toLowerCase()}.`;
      }
    }

    const admissionDate = new Date(`${formData.admission_date}T00:00:00`);
    const duesDate = new Date(`${formData.dues_date}T00:00:00`);
    const applicationDate = new Date(`${formData.application_date}T00:00:00`);
    const issueDate = new Date(`${formData.issue_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (admissionDate > today) {
      return "Date of Admission cannot be in the future.";
    }

    if (duesDate < admissionDate) {
      return "School dues paid date cannot be before the admission date.";
    }

    if (applicationDate < admissionDate) {
      return "TC application date cannot be before the admission date.";
    }

    if (issueDate < applicationDate) {
      return "TC issue date cannot be before the application date.";
    }

    if (!/^\d{4}-\d{4}$/.test(formData.session.trim())) {
      return "Please enter the academic session in YYYY-YYYY format, for example 2026-2027.";
    }

    const [sessionStart, sessionEnd] = formData.session
      .trim()
      .split("-")
      .map(Number);

    if (
      sessionEnd !== sessionStart + 1 ||
      sessionStart < 1900 ||
      sessionEnd > 2200
    ) {
      return "Please enter a valid academic session, such as 2026-2027.";
    }

    const totalDays = Number(formData.total_days);
    const presentDays = Number(formData.present_days);

    if (
      !Number.isInteger(totalDays) ||
      totalDays < 0
    ) {
      return "Total working days must be a non-negative whole number.";
    }

    if (
      !Number.isInteger(presentDays) ||
      presentDays < 0
    ) {
      return "Total days present must be a non-negative whole number.";
    }

    if (totalDays === 0) {
      return "Total working days must be greater than zero.";
    }

    if (presentDays > totalDays) {
      return "Total days present cannot exceed total working days.";
    }

    if (
      !String(formData.admission_number).trim()
    ) {
      return "Admission number is required.";
    }

    if (!String(formData.nationality).trim()) {
      return "Nationality is required.";
    }

    if (!info?.Name || !String(info.Name).trim()) {
      return "Student name is missing. Please verify the student record.";
    }

    if (!info?.Admno && !formData.admission_number.trim()) {
      return "The student's admission number is missing.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (!info) {
      showMessage(
        "Student Details Missing",
        "Student details are not available. Please reload the page and try again."
      );
      return;
    }

    // VALIDATION BEFORE API REQUEST
    const validationError = validateForm();

    if (validationError) {
      showMessage("Please Check the Form", validationError, "error");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        id,
        name: info?.Name,
        father_name: info?.Fname,
        mother_name: info?.Mname,
        last_class: info?.Class,
        date_of_birth: info?.Dob,
        roll_no: info?.Rollno,
        ...formData,
      };

      const res = await axios.post(
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudentAttendance/generateTc",
        payload
      );

      if (res.data.status) {
        showMessage(
          "Transfer Certificate Generated",
          res.data.message ||
            "The transfer certificate has been generated successfully.",
          "success"
        );
      } else {
        showMessage(
          "Generation Failed",
          res.data.message ||
            "Unable to generate the transfer certificate. Please check the details and try again.",
          "error"
        );
      }
    } catch (err) {
      console.error("Generate TC Error:", err);
      console.log("Server Response:", err.response?.data);
      console.log("Status:", err.response?.status);

      showMessage(
        "Generation Failed",
        err.response?.data?.message ||
          err.message ||
          "A server error occurred while generating the transfer certificate.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="generate-tc-page">
        <div className="generate-tc-loading-card">
          <span className="generate-tc-spinner"></span>
          <h3>Loading student details</h3>
          <p>Please wait while we prepare the transfer certificate form.</p>
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="generate-tc-page">
        <div className="generate-tc-error-card">
          <div className="generate-tc-error-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <h3>Student details unavailable</h3>
          <p>
            {message || "Unable to find the requested student."}
          </p>
          <button
            type="button"
            className="generate-tc-back-btn"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
        </div>

        {message && (
          <MessageOverlay
            title={messageTitle}
            message={message}
            type={messageType}
            onClose={() => setMessage(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="generate-tc-page">
      {/* PAGE HEADER */}
      <div className="generate-tc-header">
        <div className="generate-tc-heading-content">
          <div className="generate-tc-heading-icon">
            <i className="bi bi-file-earmark-text"></i>
          </div>

          <div>
            <div className="generate-tc-breadcrumb">
              Student Management <i className="bi bi-chevron-right"></i>{" "}
              Transfer Certificate
            </div>
            <h2>Generate Transfer Certificate</h2>
            <p>
              Complete the required details to issue a student's transfer
              certificate.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="generate-tc-back-btn"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          <i className="bi bi-arrow-left"></i>
          Back
        </button>
      </div>

      {/* STUDENT SUMMARY */}
      <div className="generate-tc-student-card">
        <div className="generate-tc-student-avatar">
          <i className="bi bi-person-fill"></i>
        </div>

        <div className="generate-tc-student-info">
          <span className="generate-tc-eyebrow">STUDENT DETAILS</span>
          <h3>{info.Name || "Student"}</h3>

          <div className="generate-tc-student-meta">
            <span>
              <i className="bi bi-person-vcard"></i>
              Admission No: {info.Admno || formData.admission_number || "—"}
            </span>
            <span>
              <i className="bi bi-mortarboard"></i>
              Class: {info.Class || "—"}
            </span>
            <span>
              <i className="bi bi-person"></i>
              Roll No: {info.Rollno || "—"}
            </span>
          </div>
        </div>

        <div className="generate-tc-student-status">
          <i className="bi bi-file-earmark-check"></i>
          TC Application
        </div>
      </div>

      {/* FORM CARD */}
      <div className="generate-tc-card">
        <div className="generate-tc-card-header">
          <div className="generate-tc-card-title-icon">
            <i className="bi bi-pencil-square"></i>
          </div>

          <div>
            <h3>Transfer Certificate Details</h3>
            <p>
              Review the student information and complete the fields below.
            </p>
          </div>

          <span className="generate-tc-required-note">
            <span>*</span> Required fields
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="generate-tc-form-content">
            <FormSection
              number="01"
              title="Admission Information"
              description="Student admission and academic details"
              icon="bi-mortarboard"
            >
              <div className="generate-tc-form-grid">
                <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
                <Input label="Date of Admission" type="date" name="admission_date" value={formData.admission_date} onChange={handleChange} />
                <Input label="Class of Admission" name="admission_class" value={formData.admission_class} onChange={handleChange} />
                <Input label="Admission Number" name="admission_number" value={formData.admission_number} onChange={handleChange} />
                <Input label="Academic Session" name="session" value={formData.session} onChange={handleChange} />
                <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
              </div>
            </FormSection>

            <FormSection
              number="02"
              title="Academic Performance"
              description="Examination, attendance and progression details"
              icon="bi-journal-bookmark"
            >
              <div className="generate-tc-form-grid">
                <Input label="Whether failed, if so once/twice in the same class" name="failed_mark" value={formData.failed_mark} onChange={handleChange} />
                <Input label="Subjects Studied" name="subjects" value={formData.subjects} onChange={handleChange} />
                <Input label="Qualified for Admission to Higher Class?" name="qualified_mark" value={formData.qualified_mark} onChange={handleChange} />
                <Input label="School/Board Annual Examination Last Taken with Result" name="last_school" value={formData.last_school} onChange={handleChange} />
                <Input label="Total Working Days" type="number" min="1" step="1" name="total_days" value={formData.total_days} onChange={handleChange} />
                <Input label="Total Days Present" type="number" min="0" step="1" name="present_days" value={formData.present_days} onChange={handleChange} />
              </div>
            </FormSection>

            <FormSection
              number="03"
              title="Fee & Clearance"
              description="Fee concession and dues clearance information"
              icon="bi-cash-coin"
            >
              <div className="generate-tc-form-grid">
                <Input label="Fee Concession Availed (Nature of Concession)" name="fee_concession" value={formData.fee_concession} onChange={handleChange} />
                <Input label="School Dues Paid Up To" type="date" name="dues_date" value={formData.dues_date} onChange={handleChange} />
              </div>
            </FormSection>

            <FormSection
              number="04"
              title="Certificate Information"
              description="Application, issue and leaving details"
              icon="bi-file-earmark-check"
            >
              <div className="generate-tc-form-grid">
                <Input label="Application Date" type="date" name="application_date" value={formData.application_date} onChange={handleChange} />
                <Input label="TC Issue Date" type="date" name="issue_date" value={formData.issue_date} onChange={handleChange} />
                <Input label="Reason for Leaving the School" name="reason" value={formData.reason} onChange={handleChange} />
                <Input label="NCC / Scout / Guide Details" name="ncc" value={formData.ncc} onChange={handleChange} />
                <Input label="Games / Extracurricular Activities and Achievements" name="games_played" value={formData.games_played} onChange={handleChange} />
                <Input label="General Conduct" name="general_conduct" value={formData.general_conduct} onChange={handleChange} />
              </div>

              <div className="generate-tc-full-field">
                <Input label="Other Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
              </div>
            </FormSection>
          </div>

          <div className="generate-tc-actions">
            <div className="generate-tc-actions-note">
              <i className="bi bi-info-circle"></i>
              Please verify all details before generating the certificate.
            </div>

            <div className="generate-tc-action-buttons">
              <button
                type="button"
                className="generate-tc-cancel-btn"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="generate-tc-button"
                disabled={submitting}
              >
                <i className="bi bi-file-earmark-check"></i>
                Generate TC
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* EDIT-STUDENT-STYLE LOADING OVERLAY */}
      {submitting && <LoadingOverlay />}

      {/* EDIT-STUDENT-STYLE MESSAGE BOX */}
      {message && (
        <MessageOverlay
          title={messageTitle}
          message={message}
          type={messageType}
          onClose={closeMessage}
        />
      )}
    </div>
  );
};

const FormSection = ({ number, title, description, icon, children }) => (
  <section className="generate-tc-section">
    <div className="generate-tc-section-heading">
      <div className="generate-tc-section-icon">
        <i className={`bi ${icon}`}></i>
      </div>

      <div className="generate-tc-section-copy">
        <div className="generate-tc-section-kicker">
          SECTION {number}
        </div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>

    {children}
  </section>
);

const Input = ({ label, type = "text", ...props }) => (
  <div className="generate-tc-input-group">
    <label htmlFor={`generate-tc-${props.name}`}>
      {label}
      {[
        "category",
        "admission_date",
        "admission_class",
        "admission_number",
        "session",
        "nationality",
        "subjects",
        "qualified_mark",
        "last_school",
        "total_days",
        "present_days",
        "dues_date",
        "application_date",
        "issue_date",
        "reason",
        "general_conduct",
      ].includes(props.name) && <span className="generate-tc-label-required"> *</span>}
    </label>

    <input
      id={`generate-tc-${props.name}`}
      type={type}
      {...props}
    />
  </div>
);

const LoadingOverlay = () => (
  <div className="generate-tc-update-overlay">
    <div className="generate-tc-loader-content">
      <div className="generate-tc-loader-spinner">
        <span></span>
      </div>

      <h3>Generating Transfer Certificate</h3>
      <p>Please wait while we process the student's certificate.</p>

      <div className="generate-tc-loader-progress">
        <span></span>
      </div>

      <div className="generate-tc-loader-caption">
        <i className="bi bi-shield-check"></i>
        Please do not close or refresh this page.
      </div>
    </div>
  </div>
);

const MessageOverlay = ({ title, message, type, onClose }) => {
  const success = type === "success";

  return (
    <div className="generate-tc-message-overlay" role="presentation">
      <div
        className={`generate-tc-message-box ${
          success
            ? "generate-tc-modal-success"
            : "generate-tc-modal-error"
        }`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="generate-tc-modal-title"
        aria-describedby="generate-tc-modal-description"
      >
        <div className="generate-tc-modal-icon">
          <i
            className={`bi ${
              success
                ? "bi-check-lg"
                : "bi-exclamation-lg"
            }`}
          ></i>
        </div>

        <div className="generate-tc-modal-badge">
          {success ? "SUCCESS" : "ATTENTION REQUIRED"}
        </div>

        <h3 id="generate-tc-modal-title">{title}</h3>

        <p id="generate-tc-modal-description">{message}</p>

        <button
          type="button"
          className="generate-tc-modal-button"
          onClick={onClose}
          autoFocus
        >
          {success ? "Continue" : "OK, Got It"}
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default GenerateTC;
