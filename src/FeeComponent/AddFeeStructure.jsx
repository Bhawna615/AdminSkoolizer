import React, { useEffect, useState } from "react";
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API + "addFee", form);

      if (res.data.status) {
        alert("Fee structure added successfully!");
        window.location.href =
          "/dashboard/FeeComponent/FeeStructure";
      } else {
        alert("Failed to add fee structure.");
      }
    } catch (error) {
      console.error("Error adding fee structure:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="add-fee-page">

      {/* Page Header */}
      <div className="add-fee-header">
        <div>
          <h1>Add Fee Structure</h1>
          <p>Create a new class-wise fee structure</p>
        </div>

        <button
          type="button"
          className="back-fee-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/FeeStructure")
          }
        >
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="add-fee-card">

        <div className="add-fee-card-header">
          <div className="form-icon">
            ₹
          </div>

          <div>
            <h2>Fee Details</h2>
            <p>
              Enter the fee details for the selected class.
            </p>
          </div>
        </div>

        <form onSubmit={submitForm}>

          {/* Class */}
          <div className="fee-form-section">

            <h3>Class Information</h3>

            <div className="fee-form-grid">

              <div className="fee-form-group full-width">
                <label>
                  Select Class <span>*</span>
                </label>

                <select
                  name="class"
                  value={form.class}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>

                  {classes.map((c, i) => (
                    <option key={i} value={c.Classname}>
                      {c.Classname}
                    </option>
                  ))}
                </select>
              </div>

            </div>

          </div>

          {/* Fee Information */}
          <div className="fee-form-section">

            <h3>Fee Information</h3>

            <div className="fee-form-grid">

              {/* Admission */}
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
                    placeholder="Enter admission fee"
                    min="0"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Tuition */}
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
                    placeholder="Enter tuition fee"
                    min="0"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Annual */}
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
                    placeholder="Enter annual fee"
                    min="0"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Sibling */}
              <div className="fee-form-group">
                <label>
                  Sibling Discount
                </label>

                <div className="amount-input">
                  <span>₹</span>

                  <input
                    type="number"
                    name="sibling_discount"
                    value={form.sibling_discount}
                    placeholder="Enter discount"
                    min="0"
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Summary */}
          <div className="fee-info-box">
            <div className="info-icon">i</div>

            <div>
              <strong>Fee Structure</strong>
              <p>
                Make sure the fee amounts are correct before
                saving the structure.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="fee-form-actions">

            <button
              type="button"
              className="cancel-fee-btn"
              onClick={() =>
                (window.location.href =
                  "/dashboard/FeeComponent/FeeStructure")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-fee-btn"
            >
              <span>✓</span>
              Add Fee Structure
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}