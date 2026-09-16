import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddFeeStructure.css";

const API = "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function AddFeeStructure() {
  const [classes, setClasses] = useState([]);

  const [form, setForm] = useState({
    class: "",
    admission_fee: "",
    tuition_fee: "",
    annual_fee: "",
    sibling_discount: ""
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(API + "getClasses");
    setClasses(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    const res = await axios.post(API + "addFee", form);

    if (res.data.status) {
      alert("Added Successfully");
      window.location.href = "/dashboard/FeeComponent/FeeStructure";
    } else {
      alert("Failed");
    }
  };

  return (
    <div className="add-fee-structure-page">

      {/* Page Header */}
      <div className="add-fee-structure-header">
        <div className="add-fee-structure-header-left">

          <div className="add-fee-structure-header-icon">
            <i className="bi bi-receipt-cutoff"></i>
          </div>

          <div>
            <h2>Add Fee Structure</h2>
            <p>
              Create a new fee structure for a school class
            </p>
          </div>

        </div>

        <button
          type="button"
          className="add-fee-structure-back-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/FeeStructure")
          }
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Fee Structure</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="add-fee-structure-card">

        {/* Card Header */}
        <div className="add-fee-structure-card-header">

          <div className="add-fee-structure-card-title">
            <div className="add-fee-structure-title-icon">
              <i className="bi bi-cash-stack"></i>
            </div>

            <div>
              <h3>Fee Information</h3>
              <p>
                Enter the fee details for the selected class
              </p>
            </div>
          </div>

          <div className="add-fee-structure-badge">
            <i className="bi bi-pencil-square"></i>
            New Structure
          </div>

        </div>

        {/* Form */}
        <form
          className="add-fee-structure-form"
          onSubmit={submitForm}
        >

          {/* Class */}
          <div className="add-fee-form-group add-fee-class-group">

            <label htmlFor="fee-class">
              <i className="bi bi-mortarboard-fill"></i>
              Select Class
            </label>

            <div className="add-fee-input-wrapper">

              <i className="bi bi-mortarboard-fill add-fee-input-icon"></i>

              <select
                id="fee-class"
                name="class"
                value={form.class}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>

                {classes.map((c, i) => (
                  <option
                    key={i}
                    value={c.Classname}
                  >
                    {c.Classname}
                  </option>
                ))}
              </select>

              <i className="bi bi-chevron-down add-fee-select-arrow"></i>

            </div>

            <span className="add-fee-field-hint">
              Choose the class for which this fee structure applies.
            </span>

          </div>

          {/* Fee Fields */}
          <div className="add-fee-section-title">
            <div className="add-fee-section-line"></div>

            <span>
              <i className="bi bi-wallet2"></i>
              Fee Details
            </span>

            <div className="add-fee-section-line"></div>
          </div>

          <div className="add-fee-fields-grid">

            {/* Admission Fee */}
            <div className="add-fee-form-group">

              <label htmlFor="admission-fee">
                <i className="bi bi-door-open"></i>
                Admission Fee
              </label>

              <div className="add-fee-input-wrapper">

                <span className="add-fee-currency">₹</span>

                <input
                  id="admission-fee"
                  type="number"
                  name="admission_fee"
                  placeholder="Enter admission fee"
                  value={form.admission_fee}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>

            {/* Tuition Fee */}
            <div className="add-fee-form-group">

              <label htmlFor="tuition-fee">
                <i className="bi bi-book"></i>
                Tuition Fee
              </label>

              <div className="add-fee-input-wrapper">

                <span className="add-fee-currency">₹</span>

                <input
                  id="tuition-fee"
                  type="number"
                  name="tuition_fee"
                  placeholder="Enter tuition fee"
                  value={form.tuition_fee}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>

            {/* Annual Fee */}
            <div className="add-fee-form-group">

              <label htmlFor="annual-fee">
                <i className="bi bi-calendar-event"></i>
                Annual Fee
              </label>

              <div className="add-fee-input-wrapper">

                <span className="add-fee-currency">₹</span>

                <input
                  id="annual-fee"
                  type="number"
                  name="annual_fee"
                  placeholder="Enter annual fee"
                  value={form.annual_fee}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>

            {/* Sibling Discount */}
            <div className="add-fee-form-group">

              <label htmlFor="sibling-discount">
                <i className="bi bi-people"></i>
                Sibling Discount
              </label>

              <div className="add-fee-input-wrapper">

                <span className="add-fee-discount-icon">
                  <i className="bi bi-percent"></i>
                </span>

                <input
                  id="sibling-discount"
                  type="number"
                  name="sibling_discount"
                  placeholder="Enter sibling discount"
                  value={form.sibling_discount}
                  onChange={handleChange}
                  min="0"
                  required
                />

              </div>

            </div>

          </div>

          {/* Information */}
          <div className="add-fee-info-box">

            <div className="add-fee-info-icon">
              <i className="bi bi-info-circle-fill"></i>
            </div>

            <div>
              <strong>Fee Structure Information</strong>

              <p>
                Enter the correct fee amounts for the selected class.
                The sibling discount should be entered according to
                your school's fee policy.
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="add-fee-actions">

            <button
              type="button"
              className="add-fee-cancel-btn"
              onClick={() =>
                (window.location.href =
                  "/dashboard/FeeComponent/FeeStructure")
              }
            >
              <i className="bi bi-x-lg"></i>
              Cancel
            </button>

            <button
              type="submit"
              className="add-fee-submit-btn"
            >
              <i className="bi bi-check2-circle"></i>
              Add Fee Structure
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}