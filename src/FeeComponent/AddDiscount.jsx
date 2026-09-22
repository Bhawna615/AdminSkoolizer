
import React, { useState } from "react";
import axios from "axios";
import "./Fee.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function AddDiscount() {
  const [form, setForm] = useState({
    fee_type: "admission_fee",
    amount: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.fee_type) {
      alert("Please select a fee type.");
      return;
    }

    if (form.amount === "" || Number(form.amount) < 0) {
      alert("Please enter a valid discount amount.");
      return;
    }

    try {
      setLoading(true);

      const discountData = {
        fee_type: form.fee_type,
        amount: Number(form.amount)
      };

      console.log("Discount data:", discountData);

      const res = await axios.post(
        API + "addDiscount",
        discountData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log("API response:", res.data);

      if (res.data.status === true) {
        alert(
          res.data.message ||
            "Discount added successfully."
        );

        window.location.href =
          "/dashboard/FeeComponent/Discounts";
      } else {
        alert(
          res.data.message ||
            "Failed to add discount."
        );
      }

    } catch (error) {
      console.error(
        "Error adding discount:",
        error
      );

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Server error while adding discount."
        );
      } else if (error.request) {
        alert(
          "Unable to connect to the API server."
        );
      } else {
        alert(
          "Failed to add discount. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    window.location.href =
      "/dashboard/FeeComponent/Discounts";
  };

  return (
    <div className="add-discount-page">

      {/* Header */}
      <div className="add-discount-header">

        <div className="add-discount-header-left">

          <div className="add-discount-header-icon">
            <i className="bi bi-percent"></i>
          </div>

          <div>
            <h2>Add Discount</h2>
            <p>
              Create a new fee discount for students
            </p>
          </div>

        </div>

        <button
          type="button"
          className="add-discount-back-btn"
          onClick={goBack}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Discounts</span>
        </button>

      </div>

      {/* Main Card */}
      <div className="add-discount-card">

        {/* Card Header */}
        <div className="add-discount-card-header">

          <div className="add-discount-title">

            <div className="add-discount-title-icon">
              <i className="bi bi-tag-fill"></i>
            </div>

            <div>
              <h3>Discount Information</h3>
              <p>
                Enter the discount type and amount below
              </p>
            </div>

          </div>

          <div className="add-discount-badge">
            <i className="bi bi-pencil-square"></i>
            New Discount
          </div>

        </div>

        {/* Form */}
        <form
          className="add-discount-form"
          onSubmit={submit}
        >

          {/* Fee Type */}
          <div className="add-discount-form-group">

            <label htmlFor="discount-fee-type">
              <i className="bi bi-receipt"></i>
              Fee Type
            </label>

            <div className="add-discount-input-wrapper">

              <i className="bi bi-cash-stack add-discount-input-icon"></i>

              <select
                id="discount-fee-type"
                name="fee_type"
                value={form.fee_type}
                onChange={handleChange}
                required
                disabled={loading}
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

              <i className="bi bi-chevron-down add-discount-select-arrow"></i>

            </div>

            <span className="add-discount-field-hint">
              Select the fee category to which this discount applies.
            </span>

          </div>

          {/* Divider */}
          <div className="add-discount-section-title">

            <div className="add-discount-section-line"></div>

            <span>
              <i className="bi bi-wallet2"></i>
              Discount Details
            </span>

            <div className="add-discount-section-line"></div>

          </div>

          {/* Amount */}
          <div className="add-discount-form-group">

            <label htmlFor="discount-amount">
              <i className="bi bi-currency-rupee"></i>
              Discount Amount
            </label>

            <div className="add-discount-input-wrapper">

              <span className="add-discount-currency">
                ₹
              </span>

              <input
                id="discount-amount"
                type="number"
                name="amount"
                placeholder="Enter discount amount"
                value={form.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                disabled={loading}
              />

            </div>

            <span className="add-discount-field-hint">
              Enter the amount that should be deducted from the selected
              fee.
            </span>

          </div>

          {/* Information Box */}
          <div className="add-discount-info-box">

            <div className="add-discount-info-icon">
              <i className="bi bi-info-circle-fill"></i>
            </div>

            <div>
              <strong>Discount Information</strong>

              <p>
                Make sure the discount amount is correct before saving.
                Students can be assigned to this discount after it has
                been created.
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="add-discount-actions">

            <button
              type="button"
              className="add-discount-cancel-btn"
              onClick={goBack}
              disabled={loading}
            >
              <i className="bi bi-x-lg"></i>
              Cancel
            </button>

            <button
              type="submit"
              className="add-discount-submit-btn"
              disabled={loading}
            >

              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat add-discount-spin"></i>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle"></i>
                  Add Discount
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
