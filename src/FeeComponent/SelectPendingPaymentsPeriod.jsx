import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function SelectPendingPaymentsPeriod() {
  const [periods, setPeriods] = useState([]);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API + "getPeriods").then((res) => {
      const data = res.data.data || [];
      setPeriods(data);
      if (data.length > 0) {
        setSelected(data[0].period);
      }
    });
  }, []);

  const handleClick = () => {
    navigate(`/dashboard/FeeComponent/PendingPayments?period=${selected}`);
  };

  return (
    <div>
      <h2>Select Period</h2>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {periods.map((p, i) => (
          <option key={i} value={p.period}>
            {p.period}
          </option>
        ))}
      </select>

      <button onClick={handleClick}>Go</button>
    </div>
  );
}