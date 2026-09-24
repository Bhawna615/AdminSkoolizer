import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./PendingPayments.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

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
      .get(API + "getPendingPayments", {
        params: { period },
      })
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching pending payments:", err);
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
      const diff = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24),
      );

      return (diff - 1) * 10;
    }

    return 0;
  };

  // ================= CSV EXPORT =================
  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Name",
        "Adm No",
        "Class",
        "Amount",
        "Period",
        "Last Date",
      ],
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
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

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

          navigate("/dashboard/MessageComponent/MessageView");
        } else {
          alert(res.data.message);
        }
      })
      .catch(() => {
        alert("Error sending message ❌");
      });
  };

  const allSelected =
    data.length > 0 && selectedIds.length === data.length;

  return (
    <div className="kk-pending-payments-page">

      {/* ================= HEADER ================= */}
      <div className="kk-pending-payments-header">

        <div>
          <h1>Pending Payments</h1>

          <p>
            Manage pending fee payments and send reminders
            to parents.
          </p>
        </div>

        <div className="kk-pending-payments-period-badge">
          <span>Payment Period</span>
          <strong>{period || "N/A"}</strong>
        </div>

      </div>


      {/* ================= PREVIEW CARD ================= */}
      <div className="kk-pending-payments-preview">

        

        <div className="kk-pending-payments-preview-content">

          <div className="kk-pending-payments-preview-heading">
            <h3>Reminder Message Preview</h3>

            <span>
              SMS / Notification
            </span>
          </div>

          <p>
            Dear Parent, The school fee of your ward is
            pending. You are requested to pay fee before due
            date to avoid late fee charges.
          </p>

        </div>

      </div>


      {/* ================= TABLE CARD ================= */}
      <div className="kk-pending-payments-card">

        {/* TABLE HEADER */}
        <div className="kk-pending-payments-card-header">

          <div>
            <h2>Pending Fee Records</h2>

            <p>
              {data.length} pending payment
              {data.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="kk-pending-payments-header-actions">

            {/* SELECTED COUNT */}
            <div className="kk-pending-payments-selected-count">
              <span>Selected</span>
              <strong>{selectedIds.length}</strong>
            </div>

            {/* EXPORT */}
            <button
              className="kk-pending-payments-export-btn"
              onClick={exportCSV}
            >
              <span>↓</span>
              Export CSV
            </button>

          </div>

        </div>


        {/* SELECT ALL */}
        <div className="kk-pending-payments-select-bar">

          <label className="kk-pending-payments-select-label">

            <input
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAll}
            />

            <span className="kk-pending-payments-custom-check"></span>

            <span>
              Select All Students
            </span>

          </label>

          {selectedIds.length > 0 && (
            <span className="kk-pending-payments-selection-info">
              {selectedIds.length} student
              {selectedIds.length !== 1 ? "s" : ""} selected
            </span>
          )}

        </div>


        {/* ================= TABLE ================= */}
        <div className="kk-pending-payments-table-wrapper">

          <table className="kk-pending-payments-table">

            <thead>
              <tr>
                <th className="kk-pending-payments-select-column">
                  Select
                </th>

                <th>Payment ID</th>

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

              {data.length > 0 ? (
                data.map((p) => {

                  const lateFee = calculateLateFee(p);

                  return (
                    <tr key={p.feeid}>

                      <td className="kk-pending-payments-select-column">

                        <label className="kk-pending-payments-row-checkbox">

                          <input
                            type="checkbox"
                            checked={selectedIds.includes(
                              p.student_id,
                            )}
                            onChange={() =>
                              handleCheckbox(p.student_id)
                            }
                          />

                          <span className="kk-pending-payments-custom-check"></span>

                        </label>

                      </td>

                      <td>
                        <span className="kk-pending-payments-id">
                          #{p.feeid}
                        </span>
                      </td>

                      <td>
                        <span className="kk-pending-payments-student-name">
                          {p.studentname}
                        </span>
                      </td>

                      <td>{p.admission_number}</td>

                      <td>
                        <span className="kk-pending-payments-class-badge">
                          {p.class}
                        </span>
                      </td>

                      <td>
                        <span className="kk-pending-payments-amount">
                          ₹{p.amount}
                        </span>
                      </td>

                      <td>{p.period}</td>

                      <td>{p.lastdate}</td>

                      <td>

                        <span className="kk-pending-payments-status">
                          Pending
                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            lateFee > 0
                              ? "kk-pending-payments-late-fee kk-pending-payments-late-active"
                              : "kk-pending-payments-late-fee"
                          }
                        >
                          ₹{lateFee}
                        </span>

                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="kk-pending-payments-empty-cell"
                  >

                    <div className="kk-pending-payments-empty">

                      <div className="kk-pending-payments-empty-icon">
                        ✓
                      </div>

                      <h3>No Pending Payments</h3>

                      <p>
                        There are no pending payments for
                        the selected period.
                      </p>

                    </div>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ================= FLOAT SEND BUTTON ================= */}
      {selectedIds.length > 0 && (
        <button
          className="kk-pending-payments-send-button"
          onClick={handleSend}
          title="Send Fee Reminder"
        >

          <span className="kk-pending-payments-send-icon">
            ➤
          </span>

          <span className="kk-pending-payments-send-text">
            Send Reminder
          </span>

          <span className="kk-pending-payments-send-count">
            {selectedIds.length}
          </span>

        </button>
      )}

    </div>
  );
}