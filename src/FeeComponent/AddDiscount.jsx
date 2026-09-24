import React, { useState } from "react";
import axios from "axios";
import "./AddDiscount.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function AddDiscount() {
  const [form, setForm] = useState({
    fee_type: "admission_fee",
    amount: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(API + "addDiscount", form);

      if (res.data.status) {
        alert("Discount added successfully!");
        window.location.href =
          "/dashboard/FeeComponent/Discounts";
      } else {
        alert("Failed to add discount.");
      }
    } catch (error) {
      console.error("Error adding discount:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="add-discount-page">

      {/* PAGE HEADER */}
      <div className="add-discount-header">

        <div>
          <h1>Add Discount</h1>
          <p>Create a new fee discount for students</p>
        </div>

        <button
          type="button"
          className="back-discount-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/Discounts")
          }
        >
          ← Back
        </button>

      </div>

      {/* FORM CARD */}
      <div className="add-discount-card">

        {/* CARD HEADER */}
        <div className="add-discount-card-header">

          <div className="discount-form-icon">
            %
          </div>

          <div>
            <h2>Discount Details</h2>

            <p>
              Select the fee type and enter the discount amount.
            </p>
          </div>

        </div>

        <form onSubmit={submit}>

          {/* FORM SECTION */}
          <div className="discount-form-section">

            <h3>Discount Information</h3>

            <div className="discount-form-grid">

              {/* FEE TYPE */}
              <div className="discount-form-group">

                <label>
                  Fee Type <span>*</span>
                </label>

                <select
                  name="fee_type"
                  value={form.fee_type}
                  onChange={handleChange}
                  required
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

              </div>

              {/* AMOUNT */}
              <div className="discount-form-group">

                <label>
                  Discount Amount <span>*</span>
                </label>

                <div className="discount-amount-input">

                  <span>₹</span>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    placeholder="Enter discount amount"
                    min="0"
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>

          </div>

          {/* INFO BOX */}
          <div className="discount-info-box">

            <div className="discount-info-icon">
              i
            </div>

            <div>

              <strong>Discount Information</strong>

              <p>
                The discount amount will be available for
                assignment to students after it is created.
              </p>

            </div>

          </div>

          {/* ACTIONS */}
          <div className="discount-form-actions">

            <button
              type="button"
              className="cancel-discount-btn"
              onClick={() =>
                (window.location.href =
                  "/dashboard/FeeComponent/Discounts")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-discount-btn"
            >
              <span>✓</span>
              Add Discount
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}