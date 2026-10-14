
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes
} from "react-icons/fa";
import "./EditTC.css";

const API_BASE =
  "http://localhost/kkblossom/api.php/Adminapi/AdminStudent";

const EditTC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // =========================================================
  // CONVERT DATE TO YYYY-MM-DD
  // =========================================================

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    if (
      dateString.includes("-") &&
      dateString.split("-")[0].length === 4
    ) {
      return dateString;
    }

    const parts = dateString.split("-");

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return "";
  };

  // =========================================================
  // CLOSE MESSAGE
  // =========================================================

  const closeMessage = () => {
    setMessage("");
    setMessageType("");
  };

  // =========================================================
  // AUTO CLOSE SUCCESS MESSAGE AND REDIRECT
  // =========================================================

  useEffect(() => {
    if (message && messageType === "success") {
      const timer = setTimeout(() => {
        navigate(
          "/dashboard/StudentComponent/TransferCertificate"
        );
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message, messageType, navigate]);

  // =========================================================
  // FETCH TRANSFER CERTIFICATE
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/viewTc/${id}`
        );

        console.log("TC Response:", res.data);

        if (res.data.status) {
          const data = res.data.details;

          setFormData({
            ...data,
            id: data.id,
            date_of_birth: formatDateForInput(
              data.date_of_birth
            ),
            date_of_admission: formatDateForInput(
              data.date_of_admission
            ),
            application_date: formatDateForInput(
              data.application_date
            ),
            issue_date: formatDateForInput(
              data.issue_date
            )
          });
        } else {
          setMessage(
            res.data.message || "Student not found"
          );
          setMessageType("error");
        }
      } catch (err) {
        console.error("Fetch Error:", err);

        setMessage(
          "Unable to load transfer certificate."
        );
        setMessageType("error");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================================================
  // UPDATE TRANSFER CERTIFICATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    try {
      console.log("Sending update data:", formData);

      const res = await axios.post(
        `${API_BASE}/updateTc`,
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Update Response:", res.data);

      if (res.data?.status === true) {
        setMessage(
          res.data.message ||
          "Transfer Certificate updated successfully."
        );

        setMessageType("success");
      } else {
        setMessage(
          res.data?.message ||
          "Failed to update certificate."
        );

        setMessageType("error");
      }
    } catch (err) {
      console.error("Update Error:", err);
      console.error("Server Response:", err.response?.data);

      setMessage(
        err.response?.data?.message ||
        "Server error. Unable to update certificate."
      );

      setMessageType("error");
    }
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (!formData) {
    return (
      <>
        <div className="edit-tc-status">
          <div className="edit-tc-loading-box">
            <div className="edit-tc-loader"></div>
            <span>Loading Transfer Certificate...</span>
          </div>
        </div>

        {/* ERROR POPUP WHILE LOADING */}

        {message && (
          <div className="edit-tc-modal-overlay">
            <div
              className="edit-tc-modal-popup edit-tc-modal-error"
              role="alertdialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="edit-tc-modal-close"
                onClick={closeMessage}
                aria-label="Close message"
              >
                <FaTimes />
              </button>

              <div className="edit-tc-modal-icon">
                <FaExclamationCircle />
              </div>

              <h2>Action Required</h2>

              <p>{message}</p>

              <button
                type="button"
                className="edit-tc-modal-ok-btn"
                onClick={closeMessage}
              >
                Okay
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="edit-tc-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="edit-tc-header">

        <div className="edit-tc-header-left">

          <div className="edit-tc-header-icon">
            <i className="las la-file-alt"></i>
          </div>

          <div>
            <h1>Edit Transfer Certificate</h1>

            <p>
              Update student transfer certificate information
            </p>
          </div>

        </div>

        <button
          type="button"
          className="edit-tc-back-btn"
          onClick={() =>
            navigate(
              "/dashboard/StudentComponent/TransferCertificate"
            )
          }
        >
          <i className="las la-arrow-left"></i>
          Back
        </button>

      </div>

      {/* =================================================
          FORM CARD
      ================================================= */}

      <div className="edit-tc-card">

        <div className="edit-tc-card-header">

          <div>
            <h2>Certificate Information</h2>

            <p>
              Edit the details below and click Update to save
              changes.
            </p>
          </div>

          <div className="edit-tc-student-id">
            ID: {formData.id}
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* =================================================
              THREE COLUMN FORM
          ================================================= */}

          <div className="edit-tc-form-grid">

            {/* COLUMN 1 */}

            <div className="edit-tc-form-column">

              <div className="edit-tc-section-title">
                <i className="las la-user"></i>
                <span>Student Details</span>
              </div>

              <TCInput
                label="Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Father's Name"
                name="father_name"
                value={formData.father_name || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Mother's Name"
                name="mother_name"
                value={formData.mother_name || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Last Class"
                name="last_class"
                value={formData.last_class || ""}
                onChange={handleChange}
              />

              <TCInput
                type="date"
                label="Date of Birth"
                name="date_of_birth"
                value={formData.date_of_birth || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Roll No."
                name="roll_no"
                value={formData.roll_no || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Category"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Nationality"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Admission Number"
                name="admission_number"
                value={formData.admission_number || ""}
                onChange={handleChange}
              />

            </div>

            {/* COLUMN 2 */}

            <div className="edit-tc-form-column">

              <div className="edit-tc-section-title">
                <i className="las la-graduation-cap"></i>
                <span>Academic Details</span>
              </div>

              <TCInput
                type="date"
                label="Date of Admission"
                name="date_of_admission"
                value={formData.date_of_admission || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Last School"
                name="last_school"
                value={formData.last_school || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Subjects Studied"
                name="subjects_studied"
                value={formData.subjects_studied || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Qualified for Promotion"
                name="qualified_mark"
                value={formData.qualified_mark || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Failed"
                name="failed_mark"
                value={formData.failed_mark || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Session"
                name="session"
                value={formData.session || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Working Days"
                name="working_days"
                value={formData.working_days || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Present Days"
                name="present_days"
                value={formData.present_days || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Fee Concession"
                name="fee_concession"
                value={formData.fee_concession || ""}
                onChange={handleChange}
              />

            </div>

            {/* COLUMN 3 */}

            <div className="edit-tc-form-column">

              <div className="edit-tc-section-title">
                <i className="las la-file-signature"></i>
                <span>Certificate Details</span>
              </div>

              <TCInput
                type="date"
                label="Application Date"
                name="application_date"
                value={formData.application_date || ""}
                onChange={handleChange}
              />

              <TCInput
                type="date"
                label="Issue Date"
                name="issue_date"
                value={formData.issue_date || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Dues Date"
                name="dues_date"
                value={formData.dues_date || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Reason"
                name="reason"
                value={formData.reason || ""}
                onChange={handleChange}
              />

              <TCInput
                label="NCC"
                name="ncc"
                value={formData.ncc || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Games Played"
                name="games_played"
                value={formData.games_played || ""}
                onChange={handleChange}
              />

              <TCInput
                label="General Conduct"
                name="general_conduct"
                value={formData.general_conduct || ""}
                onChange={handleChange}
              />

              <TCInput
                label="Remarks"
                name="remarks"
                value={formData.remarks || ""}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* =================================================
              FORM FOOTER
          ================================================= */}

          <div className="edit-tc-form-footer">

            <button
              type="button"
              className="edit-tc-cancel-btn"
              onClick={() =>
                navigate(
                  "/dashboard/StudentComponent/TransferCertificate"
                )
              }
            >
              <i className="las la-times"></i>
              Cancel
            </button>

            <button
              type="submit"
              className="edit-tc-update-btn"
            >
              <i className="las la-save"></i>
              Update Certificate
            </button>

          </div>

        </form>

      </div>

      {/* =================================================
          SUCCESS / ERROR POPUP
      ================================================= */}

      {message && (
        <div className="edit-tc-modal-overlay">

          <div
            className={`edit-tc-modal-popup ${
              messageType === "success"
                ? "edit-tc-modal-success"
                : "edit-tc-modal-error"
            }`}
            role="alertdialog"
            aria-modal="true"
          >

            <button
              type="button"
              className="edit-tc-modal-close"
              onClick={closeMessage}
              aria-label="Close message"
            >
              <FaTimes />
            </button>

            <div className="edit-tc-modal-icon">
              {messageType === "success" ? (
                <FaCheckCircle />
              ) : (
                <FaExclamationCircle />
              )}
            </div>

            <h2>
              {messageType === "success"
                ? "Success!"
                : "Action Required"}
            </h2>

            <p>{message}</p>

            {messageType === "success" ? (
              <>
                <div className="edit-tc-modal-status">
                  Your transfer certificate has been updated.
                </div>

                <div className="edit-tc-modal-progress">
                  <div className="edit-tc-modal-progress-bar"></div>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="edit-tc-modal-ok-btn"
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


/* =========================================================
   INPUT COMPONENT
========================================================= */

const TCInput = ({
  label,
  type = "text",
  name,
  value,
  onChange
}) => {
  return (
    <div className="edit-tc-field">

      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />

    </div>
  );
};

export default EditTC;
