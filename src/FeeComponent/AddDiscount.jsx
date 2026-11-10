
import React, { useRef, useState } from "react";
import axios from "axios";
import "./AddDiscount.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function AddDiscount() {
  const [form, setForm] = useState({
    fee_type: "admission_fee",
    amount: "",
  });

  const [showMsg, setShowMsg] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submittingLock = useRef(false);

  const handleChange = (e) => {
    if (submittingLock.current) return;

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const goBack = () => {
    if (submittingLock.current) return;

    window.location.href =
      "/dashboard/FeeComponent/Discounts";
  };

  const handleContinue = () => {
    setShowMsg(false);

    if (messageSuccess) {
      window.location.href =
        "/dashboard/FeeComponent/Discounts";
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (submittingLock.current) return;

    if (!form.amount || Number(form.amount) < 0) {
      setMessageSuccess(false);
      setMessageText("Please enter a valid discount amount.");
      setShowMsg(true);
      return;
    }

    submittingLock.current = true;
    setSubmitting(true);

    try {
      const res = await axios.post(API + "addDiscount", form);

      if (res.data.status) {
        setMessageSuccess(true);
        setMessageText("Discount added successfully!");
        setShowMsg(true);
      } else {
        setMessageSuccess(false);
        setMessageText(
          res.data.message || "Failed to add discount."
        );
        setShowMsg(true);
      }
    } catch (error) {
      console.error("Error adding discount:", error);

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

  const selectedFeeLabel = {
    admission_fee: "Admission Fee",
    annual_fee: "Annual Fee",
    tuition_fee: "Tuition Fee",
    transport_fee: "Transport Fee",
  };

  return (
    <div className="add-discount-page">

      {/* PAGE HEADER */}
      <div className="add-discount-header">

        <div className="add-discount-heading">
          <span className="add-discount-eyebrow">
            FEE MANAGEMENT
          </span>

          <h1>Add Discount</h1>

          <p>
            Create a new fee discount for students
          </p>
        </div>

        <button
          type="button"
          className="back-discount-btn"
          onClick={goBack}
          disabled={submitting}
        >
          <span>←</span>
          Back to Discounts
        </button>

      </div>

      {/* FORM CARD */}
      <div className="add-discount-card">

        {/* CARD HEADER */}
        <div className="add-discount-card-header">

          <div className="discount-form-icon">
            %
          </div>

          <div className="add-discount-card-heading">
            <h2>Discount Details</h2>

            <p>
              Configure the fee category and discount amount.
            </p>
          </div>

          <div className="discount-header-status">
            <span></span>
            New Discount
          </div>

        </div>

        <form onSubmit={submit}>

          {/* FORM SECTION */}
          <div className="discount-form-section">

            <div className="discount-section-heading">
              <div>
                <h3>Discount Information</h3>
                <p>
                  Enter the details required to create a discount.
                </p>
              </div>

              <span className="discount-required-note">
                * Required fields
              </span>
            </div>

            <div className="discount-form-grid">

              {/* FEE TYPE */}
              <div className="discount-form-group">

                <label htmlFor="discount-fee-type">
                  Fee Type <span>*</span>
                </label>

                <div className="discount-select-wrapper">
                  <select
                    id="discount-fee-type"
                    name="fee_type"
                    value={form.fee_type}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  >
                    <option value="admission_fee">
                      Admission Fee
                    </option>

                    <option value="annual_fee">
                      Annual Fee
                    </option>

                    <option value="tuition_fee">
                      Tuition Fee
                    </option>

                    <option value="transport_fee">
                      Transport Fee
                    </option>
                  </select>

                  <span className="discount-select-arrow">
                    ▾
                  </span>
                </div>

                <small>
                  Select the fee category where this discount applies.
                </small>

              </div>

              {/* AMOUNT */}
              <div className="discount-form-group">

                <label htmlFor="discount-amount">
                  Discount Amount <span>*</span>
                </label>

                <div className="discount-amount-input">

                  <span className="discount-currency">
                    ₹
                  </span>

                  <input
                    id="discount-amount"
                    type="number"
                    name="amount"
                    value={form.amount}
                    placeholder="Enter discount amount"
                    min="0"
                    step="0.01"
                    onChange={handleChange}
                    required
                    disabled={submitting}
                  />

                </div>

                <small>
                  Enter the discount value in Indian Rupees.
                </small>

              </div>

            </div>

          </div>

          {/* DISCOUNT PREVIEW */}
          <div className="discount-preview-section">

            <div className="discount-preview-icon">
              %
            </div>

            <div className="discount-preview-content">
              <span>DISCOUNT PREVIEW</span>

              <h3>
                {selectedFeeLabel[form.fee_type]}
              </h3>

              <p>
                Discount amount configured for this fee category
              </p>
            </div>

            <div className="discount-preview-amount">
              <small>Discount Amount</small>
              <strong>
                ₹{form.amount
                  ? Number(form.amount).toLocaleString("en-IN")
                  : "0"}
              </strong>
            </div>

          </div>

          {/* INFO BOX */}
          <div className="discount-info-box">

            <div className="discount-info-icon">
              i
            </div>

            <div className="discount-info-content">
              <strong>Important Information</strong>

              <p>
                Once created, this discount will become available
                in the discount list and can be assigned to students.
              </p>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="discount-form-actions">

            <button
              type="button"
              className="cancel-discount-btn"
              onClick={goBack}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-discount-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="discount-button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <span>✓</span>
                  Add Discount
                </>
              )}
            </button>

          </div>

        </form>

      </div>

      {/* SUCCESS / ERROR MESSAGE OVERLAY */}
      {showMsg && (
        <div className="add-discount-message-overlay">

          <div className="add-discount-message-modal">

            <div
              className={`add-discount-message-icon ${
                messageSuccess ? "success" : "error"
              }`}
            >
              {messageSuccess ? "✓" : "!"}
            </div>

            <h2>
              {messageSuccess
                ? "Discount Created!"
                : "Unable to Complete"}
            </h2>

            <p>{messageText}</p>

            <button
              type="button"
              className="add-discount-message-btn"
              onClick={handleContinue}
            >
              {messageSuccess ? "Continue" : "Okay"}
            </button>

          </div>

        </div>
      )}

      {/* FULL SCREEN LOADER */}
      {submitting && (
        <div className="add-discount-loading-overlay">

          <div className="add-discount-loader-ring">
            <div className="add-discount-loader-inner">
              %
            </div>
          </div>

          <h3>Creating Discount</h3>

          <p>
            Please wait while we save your discount details...
          </p>

          <div className="add-discount-loader-progress">
            <span></span>
          </div>

        </div>
      )}

    </div>
  );
}
