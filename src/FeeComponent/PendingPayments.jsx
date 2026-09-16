import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./PendingPayments.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function PendingPayments() {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const period = params.get("period");
  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    if (!period) return;

    axios
      .get(API + "getPendingPayments", { params: { period } })
      .then((res) => {
        setData(res.data.data || []);
      });
  }, [period]);

  // ================= SELECT ALL =================
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((d) => d.student_id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // ================= SINGLE SELECT =================
  const handleCheckbox = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ================= LATE FEE =================
  const calculateLateFee = (row) => {
    if (row.status) return 0;

    const today = new Date();
    const lastDate = new Date(row.lastdate);

    if (today > lastDate) {
      const diff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      return (diff - 1) * 10;
    }

    return 0;
  };

  // ================= CSV EXPORT =================
  const exportCSV = () => {
    const rows = [
      ["ID", "Name", "Adm No", "Class", "Amount", "Period", "Last Date"],
      ...data.map((p) => [
        p.feeid,
        p.studentname,
        p.admission_number,
        p.class,
        p.amount,
        p.period,
        p.lastdate,
      ]),
    ];

    const csv =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "pending_payments.csv";
    link.click();
  };

  // ================= SEND =================
 const handleSend = () => {
  if (selectedIds.length === 0) {
    alert("Select at least one student");
    return;
  }

  axios
    .post(API + "sendFeeReminder", {
      ids: selectedIds,
    })
    .then((res) => {
      if (res.data.status) {
        alert("Message sent successfully ✅");

        // ✅ NAVIGATE HERE
        navigate("/dashboard/MessageComponent/MessageView");
      } else {
        alert(res.data.message);
      }
    })
    .catch(() => {
      alert("Error sending message ❌");
    });
};

  return (
    <div className="container">
      {/* PREVIEW */}
      <div className="preview-box">
        <p className="preview-title">Preview</p>
        <p>
          Dear Parent, The school fee of your ward is pending. You are requested
          to pay fee before due date to avoid late fee charges.
        </p>
      </div>

      <h2>Pending Payments ({period})</h2>

      {/* SELECT ALL */}
      <div className="select-all">
        <input type="checkbox" onChange={handleSelectAll} className="chkbx" />
        <p>Select All</p>
      </div>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Select</th>
            <th>Payment Id</th>
            <th>Name</th>
            <th>Admission No</th>
            <th>Class</th>
            <th>Amount</th>
            <th>Period</th>
            <th>Last Date</th>
            <th>Status</th>
            <th>Late Fee</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.feeid}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.student_id)}
                  onChange={() => handleCheckbox(p.student_id)}
                />
              </td>
              <td>{p.feeid}</td>
              <td>{p.studentname}</td>
              <td>{p.admission_number}</td>
              <td>{p.class}</td>
              <td>{p.amount}</td>
              <td>{p.period}</td>
              <td>{p.lastdate}</td>
              <td>{p.status ? "Paid" : "Pending"}</td>
              <td>{calculateLateFee(p)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FLOAT BUTTON */}
      <button className="Pndfloat-btn" onClick={handleSend}>
        <span className="material-icons">send</span>
      </button>

      {/* EXPORT */}
      <button className="export-btn" onClick={exportCSV}>
        Export to CSV
      </button>
    </div>
  );
}
