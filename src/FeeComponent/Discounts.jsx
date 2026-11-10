
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Discount.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API + "getDiscounts");
      setDiscounts(res.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const filteredDiscounts = discounts.filter((d) =>
    d.fee_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="discount-page">

      {/* PAGE HEADER */}
      <div className="discount-header">
        <div className="discount-heading-content">
          <span className="discount-eyebrow">
            FEE MANAGEMENT
          </span>

          <h1>Discount Management</h1>

          <p>
            Manage fee discounts and assign them to students
          </p>
        </div>

        <button
          className="add-discount-btn"
          onClick={() =>
            (window.location.href =
              "/dashboard/FeeComponent/AddDiscount")
          }
        >
          <span className="discount-add-icon">+</span>
          Add Discount
        </button>
      </div>

      {/* SUMMARY SECTION */}
      <div className="discount-summary">
        <div className="discount-summary-icon">
          %
        </div>

        <div className="discount-summary-content">
          <span>Total Discount Categories</span>
          <h2>{discounts.length}</h2>
          <p>Available discount structures</p>
        </div>

        <div className="discount-summary-decoration">
          %
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="discount-card">

        {/* CARD HEADER */}
        <div className="discount-card-top">

          <div className="discount-card-heading">
            <div className="discount-card-icon">
              <span>%</span>
            </div>

            <div>
              <h2>Discount List</h2>
              <p>
                View and manage all available fee discounts
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="discount-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="discount-search-icon"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="6.8"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              placeholder="Search by fee type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="discount-clear-search"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="discount-table-wrapper">
          <table className="discount-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>FEE TYPE</th>
                <th>DISCOUNT AMOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredDiscounts.length > 0 ? (

                filteredDiscounts.map((d) => (

                  <tr key={d.id}>

                    {/* ID */}
                    <td>
                      <span className="discount-id">
                        #{d.id}
                      </span>
                    </td>

                    {/* FEE TYPE */}
                    <td>
                      <div className="fee-type-cell">

                        <div className="discount-icon">
                          %
                        </div>

                        <div className="discount-fee-details">
                          <span className="discount-fee-name">
                            {d.fee_type}
                          </span>
                          <small>Fee discount category</small>
                        </div>

                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td>
                      <span className="discount-amount">
                        ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td>
                      <button
                        className="assign-student-btn"
                        onClick={() =>
                          (window.location.href =
                            `/dashboard/FeeComponent/AssignStudents/${d.id}`)
                        }
                      >
                        <span>+</span>
                        Add Students
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="discount-button-arrow"
                        >
                          <path
                            d="M5 12H19M13 6L19 12L13 18"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="4">

                    <div className="discount-empty">

                      <div className="empty-discount-icon">
                        %
                      </div>

                      <h3>
                        {search
                          ? "No Matching Discounts"
                          : "No Discounts Available"}
                      </h3>

                      <p>
                        {search
                          ? "Try searching with a different fee type."
                          : "You haven't created any discount structures yet. Add your first discount to get started."}
                      </p>

                      {search ? (
                        <button
                          className="discount-empty-action"
                          onClick={() => setSearch("")}
                        >
                          Clear Search
                        </button>
                      ) : (
                        <button
                          className="discount-empty-action"
                          onClick={() =>
                            (window.location.href =
                              "/dashboard/FeeComponent/AddDiscount")
                          }
                        >
                          + Add Discount
                        </button>
                      )}

                    </div>

                  </td>
                </tr>

              )}

            </tbody>

          </table>
        </div>

        {/* FOOTER */}
        <div className="discount-footer">

          <div className="discount-footer-left">
            <span className="discount-footer-dot"></span>
            Showing <strong>{filteredDiscounts.length}</strong>
            {" "}of <strong>{discounts.length}</strong> discounts
          </div>

          <span className="discount-footer-label">
            Discount Records
          </span>

        </div>

      </div>

    </div>
  );
}
