
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./PendingPayments.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function PendingPayments() {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const period = params.get("period");

  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    if (!period) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSelectedIds([]);

    axios
      .get(API + "getPendingPayments", {
        params: { period },
      })
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching pending payments:", err);
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [period]);

  // ================= MESSAGE BOX =================
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const closeMessage = () => {
    setMessage("");
    setMessageType("");
  };

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
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((i) => i !== id)
        : [...previous, id]
    );
  };

  // ================= LATE FEE =================
  const calculateLateFee = (row) => {
    if (row.status) return 0;

    const today = new Date();
    const lastDate = new Date(row.lastdate);

    if (today > lastDate) {
      const diff = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
      );

      return (diff - 1) * 10;
    }

    return 0;
  };

  // ================= CSV EXPORT =================
  const exportCSV = () => {
    const escapeCSV = (value) => {
      const text = String(value ?? "");
      return `"${text.replace(/"/g, '""')}"`;
    };

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
      "\uFEFF" +
      rows.map((row) => row.map(escapeCSV).join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "pending_payments.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // ================= SEND REMINDER =================
  const handleSend = () => {
    if (selectedIds.length === 0) {
      showMessage("Please select at least one student.", "error");
      return;
    }

    setSending(true);

    axios
      .post(API + "sendFeeReminder", {
        ids: selectedIds,
      })
      .then((res) => {
        if (res.data.status) {
          showMessage(
            "Fee reminder sent successfully!",
            "success"
          );

          setTimeout(() => {
            navigate("/dashboard/MessageComponent/MessageView");
          }, 1800);
        } else {
          showMessage(
            res.data.message || "Unable to send fee reminder.",
            "error"
          );
        }
      })
      .catch((err) => {
        console.error("Error sending fee reminder:", err);
        showMessage("Error sending fee reminder. Please try again.", "error");
      })
      .finally(() => {
        setSending(false);
      });
  };

  // ================= SELECTION DETAILS =================
  const allSelected =
    data.length > 0 && selectedIds.length === data.length;

  const totalPendingAmount = data.reduce(
    (total, row) => total + (Number(row.amount) || 0),
    0
  );

  const totalLateFee = data.reduce(
    (total, row) => total + calculateLateFee(row),
    0
  );

  // ================= UI =================
  return (
    <div className="kk-pending-payments-page">

      {/* BACKGROUND DECORATION */}
      <div className="kk-pp-bg-shape kk-pp-bg-shape-one"></div>
      <div className="kk-pp-bg-shape kk-pp-bg-shape-two"></div>

      <div className="kk-pp-container">

        {/* ================= PAGE HEADER ================= */}
        <div className="kk-pp-page-header">

          <div className="kk-pp-heading-left">
            <div className="kk-pp-heading-icon">
              <i className="bi bi-wallet2"></i>
            </div>

            <div>
              <div className="kk-pp-breadcrumb">
                FEE MANAGEMENT <i className="bi bi-chevron-right"></i> PENDING PAYMENTS
              </div>

              <h1>Pending Payments</h1>

              <p>
                Track outstanding fee records and send payment reminders
                to parents.
              </p>
            </div>
          </div>

          <div className="kk-pp-period-card">
            <div className="kk-pp-period-icon">
              <i className="bi bi-calendar3"></i>
            </div>

            <div>
              <span>PAYMENT PERIOD</span>
              <strong>{period || "N/A"}</strong>
            </div>
          </div>

        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="kk-pp-summary-grid">

          <div className="kk-pp-summary-card">
            <div className="kk-pp-summary-top">
              <div className="kk-pp-summary-icon purple">
                <i className="bi bi-people"></i>
              </div>
              <span className="kk-pp-summary-label">PENDING STUDENTS</span>
            </div>

            <div className="kk-pp-summary-value">
              {loading ? "—" : data.length}
            </div>

            <div className="kk-pp-summary-description">
              <i className="bi bi-person-lines-fill"></i>
              Students with outstanding fees
            </div>
          </div>

          <div className="kk-pp-summary-card">
            <div className="kk-pp-summary-top">
              <div className="kk-pp-summary-icon blue">
                <i className="bi bi-currency-rupee"></i>
              </div>
              <span className="kk-pp-summary-label">PENDING AMOUNT</span>
            </div>

            <div className="kk-pp-summary-value">
              {loading
                ? "—"
                : `₹${totalPendingAmount.toLocaleString("en-IN")}`}
            </div>

            <div className="kk-pp-summary-description">
              <i className="bi bi-wallet"></i>
              Total listed fee amount
            </div>
          </div>

          <div className="kk-pp-summary-card">
            <div className="kk-pp-summary-top">
              <div className="kk-pp-summary-icon orange">
                <i className="bi bi-clock-history"></i>
              </div>
              <span className="kk-pp-summary-label">TOTAL LATE FEE</span>
            </div>

            <div className="kk-pp-summary-value">
              {loading
                ? "—"
                : `₹${totalLateFee.toLocaleString("en-IN")}`}
            </div>

            <div className="kk-pp-summary-description">
              <i className="bi bi-exclamation-circle"></i>
              Calculated late charges
            </div>
          </div>

          <div className="kk-pp-summary-card">
            <div className="kk-pp-summary-top">
              <div className="kk-pp-summary-icon green">
                <i className="bi bi-check2-square"></i>
              </div>
              <span className="kk-pp-summary-label">SELECTED STUDENTS</span>
            </div>

            <div className="kk-pp-summary-value">
              {selectedIds.length}
            </div>

            <div className="kk-pp-summary-description">
              <i className="bi bi-send"></i>
              Ready for fee reminders
            </div>
          </div>

        </div>

        {/* ================= REMINDER PREVIEW ================= */}
        <div className="kk-pp-reminder-card">

          <div className="kk-pp-reminder-icon">
            <i className="bi bi-chat-left-text"></i>
          </div>

          <div className="kk-pp-reminder-content">
            <div className="kk-pp-reminder-heading">
              <h3>Fee Reminder Message</h3>
              <span>
                <i className="bi bi-bell"></i>
                SMS / Notification
              </span>
            </div>

            <p>
              Dear Parent, The school fee of your ward is pending.
              You are requested to pay fee before due date to avoid
              late fee charges.
            </p>
          </div>

          <div className="kk-pp-reminder-decoration">
            <i className="bi bi-send"></i>
          </div>

        </div>

        {/* ================= TABLE SECTION ================= */}
        <div className="kk-pp-table-card">

          {/* TABLE HEADER */}
          <div className="kk-pp-table-header">

            <div>
              <span className="kk-pp-section-label">
                PAYMENT RECORDS
              </span>

              <h2>Pending Fee Records</h2>

              <p>
                {loading
                  ? "Loading payment records..."
                  : `${data.length} pending payment${data.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            <div className="kk-pp-table-actions">

              <div className="kk-pp-selected-indicator">
                <i className="bi bi-check-circle"></i>
                <span>Selected</span>
                <strong>{selectedIds.length}</strong>
              </div>

              <button
                className="kk-pp-export-button"
                onClick={exportCSV}
                disabled={loading || data.length === 0}
              >
                <i className="bi bi-file-earmark-spreadsheet"></i>
                Export CSV
              </button>

            </div>

          </div>

          {/* SELECT ALL BAR */}
          <div className="kk-pp-select-toolbar">

            <label className="kk-pp-select-all">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                disabled={loading || data.length === 0}
              />

              <span className="kk-pp-checkbox-design">
                <i className="bi bi-check"></i>
              </span>

              <span>Select All Students</span>
            </label>

            <div className="kk-pp-selection-note">
              {selectedIds.length > 0 ? (
                <>
                  <i className="bi bi-people-fill"></i>
                  {selectedIds.length} student
                  {selectedIds.length !== 1 ? "s" : ""} selected
                </>
              ) : (
                <>
                  <i className="bi bi-info-circle"></i>
                  Select students to send reminders
                </>
              )}
            </div>

          </div>

          {/* TABLE */}
          <div className="kk-pp-table-wrapper">

            <table className="kk-pp-table">

              <thead>
                <tr>
                  <th className="kk-pp-check-column">Select</th>
                  <th>Payment ID</th>
                  <th>Student Details</th>
                  <th>Admission No.</th>
                  <th>Class</th>
                  <th>Amount</th>
                  <th>Period</th>
                  <th>Last Date</th>
                  <th>Status</th>
                  <th>Late Fee</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="10" className="kk-pp-empty-cell">
                      <div className="kk-pp-loading-state">
                        <div className="kk-pp-spinner"></div>
                        <h3>Loading Payments</h3>
                        <p>Please wait while we fetch the records.</p>
                      </div>
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((p) => {
                    const lateFee = calculateLateFee(p);

                    return (
                      <tr key={p.feeid}>

                        <td className="kk-pp-check-column">
                          <label className="kk-pp-row-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(p.student_id)}
                              onChange={() =>
                                handleCheckbox(p.student_id)
                              }
                            />

                            <span className="kk-pp-checkbox-design">
                              <i className="bi bi-check"></i>
                            </span>
                          </label>
                        </td>

                        <td>
                          <span className="kk-pp-payment-id">
                            #{p.feeid}
                          </span>
                        </td>

                        <td>
                          <div className="kk-pp-student-cell">
                            <div className="kk-pp-student-avatar">
                              <i className="bi bi-person"></i>
                            </div>

                            <span>{p.studentname}</span>
                          </div>
                        </td>

                        <td>
                          <span className="kk-pp-admission-number">
                            {p.admission_number}
                          </span>
                        </td>

                        <td>
                          <span className="kk-pp-class-badge">
                            {p.class}
                          </span>
                        </td>

                        <td>
                          <span className="kk-pp-amount">
                            ₹{p.amount}
                          </span>
                        </td>

                        <td>
                          <span className="kk-pp-period-text">
                            {p.period}
                          </span>
                        </td>

                        <td>
                          <span className="kk-pp-date">
                            <i className="bi bi-calendar-event"></i>
                            {p.lastdate}
                          </span>
                        </td>

                        <td>
                          <span className="kk-pp-status">
                            <span></span>
                            Pending
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              lateFee > 0
                                ? "kk-pp-late-fee kk-pp-late-active"
                                : "kk-pp-late-fee"
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
                    <td colSpan="10" className="kk-pp-empty-cell">
                      <div className="kk-pp-empty-state">
                        <div className="kk-pp-empty-icon">
                          <i className="bi bi-check2-circle"></i>
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

          {/* TABLE FOOTER */}
          <div className="kk-pp-table-footer">
            <span>
              <i className="bi bi-shield-check"></i>
              Payment records for {period || "the selected period"}
            </span>

            <span>
              {loading ? "Loading..." : `${data.length} record(s)`}
            </span>
          </div>

        </div>

        {/* ================= FLOATING SEND BUTTON ================= */}
        {selectedIds.length > 0 && (
          <div className="kk-pp-floating-action">
            <div className="kk-pp-floating-info">
              <div className="kk-pp-floating-icon">
                <i className="bi bi-people-fill"></i>
              </div>

              <div>
                <strong>{selectedIds.length} Students Selected</strong>
                <span>Ready to receive fee reminders</span>
              </div>
            </div>

            <button
              className="kk-pp-send-button"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? (
                <>
                  <span className="kk-pp-button-spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill"></i>
                  Send Fee Reminder
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* ================= MESSAGE OVERLAY ================= */}
      {message && (
        <div className="kk-pp-message-overlay">
          <div className="kk-pp-message-box">

            <div
              className={
                messageType === "success"
                  ? "kk-pp-message-icon success"
                  : "kk-pp-message-icon error"
              }
            >
              <i
                className={
                  messageType === "success"
                    ? "bi bi-check-lg"
                    : "bi bi-exclamation-lg"
                }
              ></i>
            </div>

            <h3>
              {messageType === "success"
                ? "Successfully Sent!"
                : "Something Went Wrong"}
            </h3>

            <p>{message}</p>

            {messageType !== "success" && (
              <button
                className="kk-pp-message-close"
                onClick={closeMessage}
              >
                Okay
              </button>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
