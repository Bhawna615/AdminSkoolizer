
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Fee.css";

const API =
  "http://localhost/kkblossom/api.php/AdminApi/AdminPanelFee/";

export default function Discount() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API + "getDiscounts");

      setDiscounts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discount-page">

      {/* =========================
          HEADER
      ========================= */}
      <div className="discount-header">

        <div className="discount-header-left">

          <div className="discount-header-icon">
            <i className="bi bi-percent"></i>
          </div>

          <div>
            <h2>Discount Management</h2>
            <p>
              Manage fee discounts and assign eligible students
            </p>
          </div>

        </div>

        <div className="discount-total">

          <div className="discount-total-icon">
            <i className="bi bi-tags-fill"></i>
          </div>

          <div>
            <span>Total Discounts</span>
            <strong>{discounts.length}</strong>
          </div>

        </div>

      </div>

      {/* =========================
          MAIN CARD
      ========================= */}
      <div className="discount-card">

        {/* =========================
            CARD HEADER
        ========================= */}
        <div className="discount-card-header">

          <div className="discount-title">

            <div className="discount-title-icon">
              <i className="bi bi-ticket-perforated"></i>
            </div>

            <div>
              <h3>Discount List</h3>
              <p>
                View available fee discounts and assign students
              </p>
            </div>

          </div>

          <button
            type="button"
            className="discount-add-btn"
            onClick={() =>
              (window.location.href =
                "/dashboard/FeeComponent/AddDiscount")
            }
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Discount</span>
          </button>

        </div>

        {/* =========================
            TABLE AREA
        ========================= */}
        <div className="discount-table-wrapper">

          {/* LOADING */}
          {loading ? (

            <div className="discount-empty">

              <div className="discount-empty-icon">
                <i className="bi bi-arrow-repeat"></i>
              </div>

              <strong>Loading Discounts...</strong>

              <span>
                Please wait while the discount records are loaded.
              </span>

            </div>

          ) : discounts.length === 0 ? (

            /* EMPTY STATE */
            <div className="discount-empty">

              <div className="discount-empty-icon">
                <i className="bi bi-percent"></i>
              </div>

              <strong>No Discounts Found</strong>

              <span>
                No fee discount has been added yet.
              </span>

              <button
                type="button"
                className="discount-empty-btn"
                onClick={() =>
                  (window.location.href =
                    "/dashboard/FeeComponent/AddDiscount")
                }
              >
                <i className="bi bi-plus-lg"></i>
                Add First Discount
              </button>

            </div>

          ) : (

            /* TABLE */
            <table className="discount-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th className="discount-action-column">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {discounts.map((d) => (

                  <tr key={d.id}>

                    {/* ID */}
                    <td>

                      <span className="discount-id">
                        #{d.id}
                      </span>

                    </td>

                    {/* FEE TYPE */}
                    <td>

                      <div className="discount-type-cell">

                        <div className="discount-type-icon">
                          <i className="bi bi-receipt"></i>
                        </div>

                        <span>
                          {d.fee_type}
                        </span>

                      </div>

                    </td>

                    {/* AMOUNT */}
                    <td>

                      <div className="discount-amount-cell">

                        <span className="discount-currency">
                          ₹
                        </span>

                        <span>
                          {d.amount}
                        </span>

                      </div>

                    </td>

                    {/* ACTION */}
                    <td className="discount-action-column">

                      <button
                        type="button"
                        className="discount-student-btn"
                        onClick={() =>
                          (window.location.href =
                            `/dashboard/FeeComponent/AssignStudents/${d.id}`)
                        }
                        title="Assign Students"
                      >

                        <i className="bi bi-person-plus-fill"></i>

                        <span>
                          Add Students
                        </span>

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* =========================
            FOOTER
        ========================= */}
        {discounts.length > 0 && !loading && (

          <div className="discount-footer">

            <div className="discount-footer-info">

              <i className="bi bi-info-circle"></i>

              <span>
                Showing{" "}
                <strong>{discounts.length}</strong>{" "}
                discount
                {discounts.length !== 1 ? "s" : ""}.
              </span>

            </div>

            <div className="discount-footer-label">

              <i className="bi bi-shield-check"></i>

              Discount Management

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
