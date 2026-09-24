import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SessionSelect.css";
import { useNavigate } from "react-router-dom";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function SessionSelect() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState("");
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
    axios
      .get(API + "getSessions")
      .then((res) => {
        let data = res.data.data || [];

        let sessionList = data.map((s) => s.session);

        if (sessionList.length === 0) {
          sessionList = generateSessions();
        }

        setSessions(sessionList);
        setSelected(getCurrentSession());
      })
      .catch((err) => {
        console.error("Error fetching sessions:", err);

        const fallbackSessions = generateSessions();

        setSessions(fallbackSessions);
        setSelected(getCurrentSession());
      });
  }, []);

  // ================= BUTTON CLICK =================
  const handleClick = () => {
    navigate(
      `/dashboard/FeeComponent/AdminViewPayment?session=${selected}`,
    );
  };

  return (
    <div className="kk-session-select-page">

      {/* Background decoration */}
      <div className="kk-session-select-decoration kk-session-select-decoration-one"></div>
      <div className="kk-session-select-decoration kk-session-select-decoration-two"></div>

      <div className="kk-session-select-card">

        {/* ICON */}
        <div className="kk-session-select-icon">
          <i class="bi bi-list"></i>
        </div>

        {/* HEADER */}
        <div className="kk-session-select-header">
          <h1>Select Session</h1>

          <p>
            Choose an academic session to view the
            corresponding payment records.
          </p>
        </div>

        {/* FORM */}
        <div className="kk-session-select-form">

          <label htmlFor="session">
            Academic Session
          </label>

          <div className="kk-session-select-input-wrapper">
            <span className="kk-session-select-input-icon">
              🗓️
            </span>

            <select
              id="session"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {sessions.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <span className="kk-session-select-arrow">
              ▼
            </span>
          </div>

          {/* SELECTED SESSION */}
          {selected && (
            <div className="kk-session-select-selected">
              <span>Selected Session</span>
              <strong>{selected}</strong>
            </div>
          )}

          {/* BUTTON */}
          <button
            className="kk-session-select-button"
            onClick={handleClick}
            disabled={!selected}
          >
            <span>View Payments</span>
            <span className="kk-session-select-button-arrow">
              →
            </span>
          </button>

        </div>

        {/* FOOTER */}
        <div className="kk-session-select-footer">
          <span className="kk-session-select-footer-dot"></span>
          Payment records will be displayed for the selected session
        </div>

      </div>
    </div>
  );
}