import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SessionSelect.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function SessionSelect() {
  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  // ✅ CURRENT SESSION
  const getCurrentSession = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
  };

  // ✅ 🔥 YE FUNCTION YAHI ADD KARNA HAI (component ke andar, upar)
  const generateSessions = () => {
    const currentYear = new Date().getFullYear();
    let arr = [];

    for (let i = 0; i < 8; i++) {
      const start = currentYear - i;
      arr.push(`${start}-${start + 1}`);
    }

    return arr;
  };

  // ✅ FETCH
  useEffect(() => {
    axios.get(API + "getSessions").then((res) => {
      let data = res.data.data || [];

      // DB se sessions nikalna
      let sessionList = data.map((s) => s.session);

      // ❗ agar DB empty hai to fallback use karo
      if (sessionList.length === 0) {
        sessionList = generateSessions();
      }

      setSessions(sessionList);
      setSelected(getCurrentSession());
    });
  }, []);

  // ✅ BUTTON CLICK
  const handleClick = () => {
    navigate(`/dashboard/FeeComponent/AdminViewPayment?session=${selected}`);
  };

  return (
    <div className="session-container">
      <h1>Select Session</h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {sessions.map((s, i) => (
          <option key={i} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button onClick={handleClick}>Show Payments</button>
    </div>
  );
}