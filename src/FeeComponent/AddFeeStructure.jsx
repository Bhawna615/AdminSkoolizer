
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./AddFeeStructure.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function AddFeeStructure() {
  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    class: "",
    admission_fee: "",
    tuition_fee: "",
    annual_fee: "",
    sibling_discount: "",
  });

  // ================= MESSAGE BOX STATES =================

  const [showMsg, setShowMsg] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageText, setMessageText] = useState("");

  // ================= SUBMIT LOADING STATE =================

  const [submitting, setSubmitting] = useState(false);
  const submittingLock = useRef(false);

  // ================= LOAD CLASSES =================

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(API + "getClasses");
      setClasses(res.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
    if (submittingLock.current) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= FORMAT CURRENCY =================

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const totalFee =
    Number(form.admission_fee || 0) +
    Number(form.tuition_fee || 0) +
    Number(form.annual_fee || 0);

  // ================= MESSAGE BOX CONTINUE =================

  const handleContinue = () => {
    setShowMsg(false);

    if (messageSuccess) {
      window.location.href =
        "/dashboard/FeeComponent/FeeStructure";
    }
  };

  // ================= SUBMIT FORM =================

  const submitForm = async (e) => {
    e.preventDefault();

    if (submittingLock.current) return;

    submittingLock.current = true;
    setSubmitting(true);
    setShowMsg(false);

    try {
      const res = await axios.post(API + "addFee", form);

      if (res.data.status) {
        setMessageSuccess(true);
        setMessageText("Fee structure added successfully!");
        setShowMsg(true);
      } else {
        setMessageSuccess(false);
        setMessageText(
          res.data.message || "Failed to add fee structure."
        );
        setShowMsg(true);
      }
    } catch (error) {
      console.error("Error adding fee structure:", error);

      setMessageSuccess(false);
      setMessageText(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
      setShowMsg(true);
    } finally {
      submittingLock.current = false;
      setSubmitting(false);
    }
  };

  // ================= BACK / CANCEL =================

  const goBack = () => {
    if (submittingLock.current) return;

    window.location.href =
      "/dashboard/FeeComponent/FeeStructure";
  };

  return (
    <div className="add-fee-page">

      {/* ================= MESSAGE OVERLAY ================= */}

      {showMsg && (
        <div className="add-fee-message-overlay">
          <div className="add-fee-message-modal">

            <div
              className={`add-fee-message-icon ${
                messageSuccess ? "success" : "error"
              }`}
            >
              <i
                className={
                  messageSuccess
                    ? "bi bi-check-lg"
                    : "bi bi-x-lg"
                }
              ></i>
            </div>

            <div className="add-fee-message-content">
              <span className="add-fee-message-label">
                {messageSuccess ? "Completed" : "Please check"}
              </span>

              <h2>
                {messageSuccess ? "Success!" : "Unable to Save"}
              </h2>

              <p>{messageText}</p>
            </div>

            <button
              type="button"
              className="add-fee-message-btn"
              onClick={handleContinue}
            >
              {messageSuccess ? "Continue" : "OK"}
              <i className="bi bi-arrow-right"></i>
            </button>

          </div>
        </div>
      )}

      {/* ================= FULL SCREEN LOADER ================= */}

      {submitting && (
        <div className="add-fee-loading-overlay">
          <div className="add-fee-loader-content">

            <div className="add-fee-loader-icon">
              <i className="bi bi-currency-rupee"></i>
            </div>

            <div className="add-fee-loader-spinner"></div>

            <h2>Saving Fee Structure</h2>

            <p>
              Please wait while we save the fee details.
            </p>

            <span>
              Do not close this page or click the button again.
            </span>

          </div>
        </div>
      )}

      {/* ================= PAGE HEADER ================= */}

      <div className="add-fee-header">

        <div className="add-fee-heading-content">
          <div className="add-fee-breadcrumb">
            <span>Fee Management</span>
            <i className="bi bi-chevron-right"></i>
            <strong>Add Structure</strong>
          </div>

          <h1>Create Fee Structure</h1>

          <p>
            Configure class-wise fees and sibling discounts
            for your school.
          </p>
        </div>

        <button
          type="button"
          className="back-fee-btn"
          disabled={submitting}
          onClick={goBack}
        >
          <i className="bi bi-arrow-left"></i>
          Back to Fee Structures
        </button>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="add-fee-layout">

        {/* ================= FORM CARD ================= */}

        <div className="add-fee-card">

          <div className="add-fee-card-header">

            <div className="add-fee-card-heading">
              <div className="form-icon">
                <i className="bi bi-receipt-cutoff"></i>
              </div>

              <div>
                <span className="add-fee-overline">
                  NEW CONFIGURATION
                </span>

                <h2>Fee Details</h2>

                <p>
                  Fill in the details to create a fee structure.
                </p>
              </div>
            </div>

            <span className="add-fee-required-note">
              <span>*</span> Required fields
            </span>

          </div>

          <form onSubmit={submitForm}>

            {/* ================= CLASS INFORMATION ================= */}

            <div className="fee-form-section">

              <div className="fee-section-heading">
                <div className="fee-section-number">01</div>

                <div>
                  <h3>Class Information</h3>
                  <p>Select the class for this fee structure.</p>
                </div>
              </div>

              <div className="fee-form-grid">

                <div className="fee-form-group full-width">

                  <label>
                    Select Class <span>*</span>
                  </label>

                  <div className="fee-select-wrapper">
                    <i className="bi bi-mortarboard"></i>

                    <select
                      name="class"
                      value={form.class}
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    >
                      <option value="">Choose a class</option>

                      {classes.map((c, i) => (
                        <option key={i} value={c.Classname}>
                          {c.Classname}
                        </option>
                      ))}
                    </select>

                    <i className="bi bi-chevron-down fee-select-arrow"></i>
                  </div>

                </div>

              </div>

            </div>

            {/* ================= FEE INFORMATION ================= */}

            <div className="fee-form-section">

              <div className="fee-section-heading">
                <div className="fee-section-number">02</div>

                <div>
                  <h3>Fee Information</h3>
                  <p>
                    Enter the applicable amounts in Indian Rupees.
                  </p>
                </div>
              </div>

              <div className="fee-form-grid">

                {/* ADMISSION FEE */}

                <div className="fee-form-group">

                  <label>
                    Admission Fee <span>*</span>
                  </label>

                  <div className="amount-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="admission_fee"
                      value={form.admission_fee}
                      placeholder="0.00"
                      min="0"
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <small>One-time admission charges</small>

                </div>

                {/* TUITION FEE */}

                <div className="fee-form-group">

                  <label>
                    Tuition Fee <span>*</span>
                  </label>

                  <div className="amount-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="tuition_fee"
                      value={form.tuition_fee}
                      placeholder="0.00"
                      min="0"
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <small>Regular tuition charges</small>

                </div>

                {/* ANNUAL FEE */}

                <div className="fee-form-group">

                  <label>
                    Annual Fee <span>*</span>
                  </label>

                  <div className="amount-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="annual_fee"
                      value={form.annual_fee}
                      placeholder="0.00"
                      min="0"
                      onChange={handleChange}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <small>Annual school charges</small>

                </div>

                {/* SIBLING DISCOUNT */}

                <div className="fee-form-group">

                  <label>
                    Sibling Discount
                    <span className="optional-label">Optional</span>
                  </label>

                  <div className="amount-input discount-input">
                    <span>₹</span>

                    <input
                      type="number"
                      name="sibling_discount"
                      value={form.sibling_discount}
                      placeholder="0.00"
                      min="0"
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  </div>

                  <small>Discount applicable to siblings</small>

                </div>

              </div>

            </div>

            {/* ================= FEE SUMMARY ================= */}

            <div className="fee-summary-section">

              <div className="fee-summary-heading">
                <div className="fee-summary-icon">
                  <i className="bi bi-calculator"></i>
                </div>

                <div>
                  <h3>Fee Summary</h3>
                  <p>Live calculation based on entered amounts.</p>
                </div>
              </div>

              <div className="fee-summary-content">

                <div className="fee-summary-item">
                  <span>Admission Fee</span>
                  <strong>
                    ₹{formatCurrency(form.admission_fee)}
                  </strong>
                </div>

                <div className="fee-summary-item">
                  <span>Tuition Fee</span>
                  <strong>
                    ₹{formatCurrency(form.tuition_fee)}
                  </strong>
                </div>

                <div className="fee-summary-item">
                  <span>Annual Fee</span>
                  <strong>
                    ₹{formatCurrency(form.annual_fee)}
                  </strong>
                </div>

                <div className="fee-summary-item discount-summary">
                  <span>Sibling Discount</span>
                  <strong>
                    - ₹{formatCurrency(form.sibling_discount)}
                  </strong>
                </div>

                <div className="fee-summary-total">
                  <div>
                    <span>Total Fee Amount</span>
                    <small>Before applying sibling discount</small>
                  </div>

                  <strong>
                    ₹{formatCurrency(totalFee)}
                  </strong>
                </div>

              </div>

            </div>

            {/* ================= INFORMATION BOX ================= */}

            <div className="fee-info-box">
              <div className="info-icon">
                <i className="bi bi-info-lg"></i>
              </div>

              <div>
                <strong>Before you save</strong>

                <p>
                  Please verify the selected class and all fee
                  amounts carefully. The fee structure will be
                  saved for the selected class.
                </p>
              </div>
            </div>

            {/* ================= FORM ACTIONS ================= */}

            <div className="fee-form-actions">

              <button
                type="button"
                className="cancel-fee-btn"
                onClick={goBack}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`save-fee-btn ${
                  submitting ? "saving" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="add-fee-button-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle"></i>
                    Save Fee Structure
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

        {/* ================= SIDE INFORMATION ================= */}

        <aside className="add-fee-side-panel">

          <div className="fee-side-card fee-side-highlight">

            <div className="fee-side-icon">
              <i className="bi bi-wallet2"></i>
            </div>

            <span className="fee-side-label">TOTAL FEE AMOUNT</span>

            <h2>₹{formatCurrency(totalFee)}</h2>

            <p>
              Combined admission, tuition and annual fees.
            </p>

            <div className="fee-side-divider"></div>

            <div className="fee-side-class">
              <span>Selected Class</span>
              <strong>{form.class || "Not selected"}</strong>
            </div>

          </div>

          <div className="fee-side-card">

            <div className="fee-side-title">
              <i className="bi bi-lightbulb"></i>
              <h3>Helpful Tips</h3>
            </div>

            <ul className="fee-tips-list">
              <li>
                <i className="bi bi-check-circle-fill"></i>
                Select the correct class before entering fees.
              </li>

              <li>
                <i className="bi bi-check-circle-fill"></i>
                Enter amounts in Indian Rupees.
              </li>

              <li>
                <i className="bi bi-check-circle-fill"></i>
                Sibling discount is optional.
              </li>

              <li>
                <i className="bi bi-check-circle-fill"></i>
                Review the fee summary before saving.
              </li>
            </ul>

          </div>

          <div className="fee-side-note">
            <i className="bi bi-shield-check"></i>

            <p>
              Your fee configuration will be submitted securely
              to the school management system.
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
}
