
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SessionSelect.css";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function SessionSelect() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= CURRENT SESSION =================
  const getCurrentSession = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
  };

  // ================= GENERATE SESSIONS =================
  const generateSessions = () => {
    const currentYear = new Date().getFullYear();
    let arr = [];

    for (let i = 0; i < 8; i++) {
      const start = currentYear - i;
      arr.push(`${start}-${start + 1}`);
    }

    return arr;
  };

  // ================= FETCH SESSIONS =================
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);

        const res = await axios.get(API + "getSessions");

        let data = res.data.data || [];
        let sessionList = data.map((s) => s.session);

        if (sessionList.length === 0) {
          sessionList = generateSessions();
        }

        setSessions(sessionList);
        setSelected(getCurrentSession());
      } catch (err) {
        console.error("Error fetching sessions:", err);

        const fallbackSessions = generateSessions();

        setSessions(fallbackSessions);
        setSelected(getCurrentSession());
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // ================= BUTTON CLICK =================
  const handleClick = () => {
    if (!selected) return;

    navigate(
      `/dashboard/FeeComponent/AdminViewPayment?session=${selected}`
    );
  };

  return (
    <div className="kk-session-select-page">

      {/* BACKGROUND DECORATION */}
      <div className="kk-session-select-decoration kk-session-select-decoration-one"></div>
      <div className="kk-session-select-decoration kk-session-select-decoration-two"></div>
      <div className="kk-session-select-decoration kk-session-select-decoration-three"></div>

      {/* MAIN CARD */}
      <div className="kk-session-select-card">

        {/* TOP ICON */}
        <div className="kk-session-select-icon">
          <i className="bi bi-calendar2-range"></i>
        </div>

        {/* HEADER */}
        <div className="kk-session-select-header">
          <span className="kk-session-select-eyebrow">
            FEE MANAGEMENT
          </span>

          <h1>Select Academic Session</h1>

          <p>
            Choose an academic session to view the corresponding
            student fee and payment records.
          </p>
        </div>

        {/* FORM */}
        <div className="kk-session-select-form">

          <label htmlFor="session">
            <i className="bi bi-calendar3"></i>
            Academic Session
          </label>

          <div className="kk-session-select-input-wrapper">
            <span className="kk-session-select-input-icon">
              <i className="bi bi-calendar-week"></i>
            </span>

            <select
              id="session"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={loading}
            >
              {loading ? (
                <option value="">Loading sessions...</option>
              ) : (
                sessions.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))
              )}
            </select>

            <span className="kk-session-select-arrow">
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>

          {/* SELECTED SESSION */}
          {selected && !loading && (
            <div className="kk-session-select-selected">
              <div className="kk-session-select-selected-left">
                <div className="kk-session-select-selected-icon">
                  <i className="bi bi-check2-circle"></i>
                </div>

                <div>
                  <span>Selected Session</span>
                  <small>Payment records will be filtered by this session</small>
                </div>
              </div>

              <strong>{selected}</strong>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="kk-session-select-loading">
              <span className="kk-session-select-spinner"></span>
              <span>Fetching academic sessions...</span>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="button"
            className="kk-session-select-button"
            onClick={handleClick}
            disabled={!selected || loading}
          >
            <span>
              <i className="bi bi-wallet2"></i>
              View Payments
            </span>

            <span className="kk-session-select-button-arrow">
              <i className="bi bi-arrow-right"></i>
            </span>
          </button>

        </div>

        {/* FOOTER */}
        <div className="kk-session-select-footer">
          <div className="kk-session-select-footer-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <span>
            Payment records will be displayed for the selected academic session.
          </span>
        </div>

      </div>

      {/* BOTTOM INFORMATION */}
      <div className="kk-session-select-bottom">
        <i className="bi bi-mortarboard"></i>
        <span>School Administration · Fee Management</span>
      </div>

    </div>
  );
}
