import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SelectPendingPaymentsPeriod.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function SelectPendingPaymentsPeriod() {
  const [periods, setPeriods] = useState([]);
  const [selected, setSelected] = useState("");
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
      });
  }, []);

  // ================= BUTTON CLICK =================
  const handleClick = () => {
    navigate(
      `/dashboard/FeeComponent/PendingPayments?period=${selected}`,
    );
  };

  return (
    <div className="kk-pending-period-page">

      {/* Background decoration */}
      <div className="kk-pending-period-decoration kk-pending-period-decoration-one"></div>
      <div className="kk-pending-period-decoration kk-pending-period-decoration-two"></div>

      <div className="kk-pending-period-card">

        {/* ICON */}
        <div className="kk-pending-period-icon">
          <i class="bi bi-wallet2"></i>
        </div>

        {/* HEADER */}
        <div className="kk-pending-period-header">
          <h1>Select Payment Period</h1>

          <p>
            Choose a payment period to view all pending
            student payments.
          </p>
        </div>

        {/* FORM */}
        <div className="kk-pending-period-form">

          <label htmlFor="pending-period">
            Payment Period
          </label>

          <div className="kk-pending-period-input-wrapper">

            <span className="kk-pending-period-input-icon">
              📅
            </span>

            <select
              id="pending-period"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {periods.map((p, i) => (
                <option key={i} value={p.period}>
                  {p.period}
                </option>
              ))}
            </select>

            <span className="kk-pending-period-arrow">
              ▼
            </span>

          </div>

          {/* SELECTED PERIOD */}
          {selected && (
            <div className="kk-pending-period-selected">

              <span>Selected Period</span>

              <strong>{selected}</strong>

            </div>
          )}

          {/* BUTTON */}
          <button
            className="kk-pending-period-button"
            onClick={handleClick}
            disabled={!selected}
          >
            <span>View Pending Payments</span>

            <span className="kk-pending-period-button-arrow">
              →
            </span>
          </button>

        </div>

        {/* FOOTER */}
        <div className="kk-pending-period-footer">

          <span className="kk-pending-period-footer-dot"></span>

          Pending payment records will be displayed for
          the selected period

        </div>

      </div>
    </div>
  );
}