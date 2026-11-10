
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SelectPendingPaymentsPeriod.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function SelectPendingPaymentsPeriod() {
  const [periods, setPeriods] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= FETCH PERIODS =================
  useEffect(() => {
    axios
      .get(API + "getPeriods")
      .then((res) => {
        const data = res.data.data || [];

        setPeriods(data);

        if (data.length > 0) {
          setSelected(data[0].period);
        }
      })
      .catch((err) => {
        console.error("Error fetching periods:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ================= BUTTON CLICK =================
  const handleClick = () => {
    if (!selected) return;

    navigate(
      `/dashboard/FeeComponent/PendingPayments?period=${selected}`
    );
  };

  return (
    <div className="kk-pending-period-page">

      {/* BACKGROUND DECORATIONS */}
      <div className="kk-pending-period-decoration kk-pending-period-decoration-one"></div>
      <div className="kk-pending-period-decoration kk-pending-period-decoration-two"></div>
      <div className="kk-pending-period-decoration kk-pending-period-decoration-three"></div>

      <div className="kk-pending-period-card">

        {/* TOP ICON */}
        <div className="kk-pending-period-icon">
          <i className="bi bi-wallet2"></i>
        </div>

        {/* HEADER */}
        <div className="kk-pending-period-header">
          <span className="kk-pending-period-subtitle">
            FEE MANAGEMENT
          </span>

          <h1>Select Payment Period</h1>

          <p>
            Choose a payment period to view all pending
            student payments.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="kk-pending-period-divider"></div>

        {/* FORM */}
        <div className="kk-pending-period-form">

          <label htmlFor="pending-period">
            <i className="bi bi-calendar3"></i>
            Payment Period
          </label>

          <div className="kk-pending-period-input-wrapper">

            <span className="kk-pending-period-input-icon">
              <i className="bi bi-calendar-event"></i>
            </span>

            <select
              id="pending-period"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={loading || periods.length === 0}
            >
              {loading ? (
                <option value="">Loading periods...</option>
              ) : periods.length > 0 ? (
                periods.map((p, i) => (
                  <option key={i} value={p.period}>
                    {p.period}
                  </option>
                ))
              ) : (
                <option value="">No periods available</option>
              )}
            </select>

            <span className="kk-pending-period-arrow">
              <i className="bi bi-chevron-down"></i>
            </span>

          </div>

          {/* SELECTED PERIOD */}
          {selected && (
            <div className="kk-pending-period-selected">

              <div className="kk-pending-period-selected-icon">
                <i className="bi bi-check2-circle"></i>
              </div>

              <div className="kk-pending-period-selected-content">
                <span>Selected Payment Period</span>
                <strong>{selected}</strong>
              </div>

              <div className="kk-pending-period-selected-check">
                <i className="bi bi-check-lg"></i>
              </div>

            </div>
          )}

          {/* BUTTON */}
          <button
            className="kk-pending-period-button"
            onClick={handleClick}
            disabled={!selected || loading}
          >
            <span>
              <i className="bi bi-eye"></i>
              View Pending Payments
            </span>

            <i className="bi bi-arrow-right kk-pending-period-button-arrow"></i>
          </button>

        </div>

        {/* FOOTER */}
        <div className="kk-pending-period-footer">

          <div className="kk-pending-period-footer-icon">
            <i className="bi bi-info-circle"></i>
          </div>

          <p>
            Pending payment records will be displayed for
            the selected period.
          </p>

        </div>

      </div>

      {/* BOTTOM LABEL */}
      <div className="kk-pending-period-bottom-label">
        <i className="bi bi-shield-check"></i>
        <span>School Fee Management System</span>
      </div>

    </div>
  );
}
