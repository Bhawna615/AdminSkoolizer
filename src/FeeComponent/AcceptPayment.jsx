
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AcceptPayment.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function AcceptPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submittingLock = useRef(false);

  const [showMsg, setShowMsg] = useState(false);
  const [messageType, setMessageType] = useState("success");
  const [messageText, setMessageText] = useState("");

  const [form, setForm] = useState({
    payment_date: "",
    late_fee_paid: "",
    amount_paid: "",
    payment_mode: "cash",
  });

  // ================= MESSAGE BOX =================
  const showMessage = (type, message) => {
    setMessageType(type);
    setMessageText(message);
    setShowMsg(true);
  };

  const closeMessage = () => {
    setShowMsg(false);

    if (messageType === "success") {
      navigate("/dashboard/FeeComponent/AdminViewPayment", {
        state: { refresh: Date.now() },
      });
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    let isMounted = true;

    const fetchPayment = async () => {
      setLoading(true);

      try {
        const res = await axios.get(API + "getPaymentById/" + id);
        const data = res.data?.data;

        if (!data) {
          throw new Error("Payment details were not found.");
        }

        if (!isMounted) return;

        setPayment(data);

        // Preserve exact database values.
        setForm({
          payment_date: "",
          late_fee_paid: data.late_fee_paid || "",
          amount_paid: data.amount_paid || "",
          payment_mode: data.payment_mode || "cash",
        });
      } catch (err) {
        console.error("Error loading payment:", err);

        if (isMounted) {
          showMessage(
            "error",
            err.response?.data?.message ||
              err.message ||
              "Unable to load payment details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPayment();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ================= FORM CHANGE =================
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (submittingLock.current) return;

    if (!form.payment_date || !form.amount_paid) {
      showMessage("error", "Please fill in the payment date and amount paid.");
      return;
    }

    if (Number(form.amount_paid) < 0 || Number(form.late_fee_paid || 0) < 0) {
      showMessage("error", "Payment amounts cannot be negative.");
      return;
    }

    submittingLock.current = true;
    setSubmitting(true);

    try {
      const res = await axios.post(API + "acceptPaymentFull", {
        payment_id: id,
        ...form,
      });

      if (res.data?.status === false) {
        throw new Error(
          res.data?.message || "Unable to accept the payment."
        );
      }

      showMessage(
        "success",
        res.data?.message || "Payment has been accepted successfully."
      );
    } catch (err) {
      console.error("Error accepting payment:", err);

      showMessage(
        "error",
        err.response?.data?.message ||
          err.message ||
          "Something went wrong while accepting the payment."
      );
    } finally {
      submittingLock.current = false;
      setSubmitting(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="accept-payment-loading-page">
        <div className="accept-payment-loading-spinner"></div>
        <h3>Loading Payment Details</h3>
        <p>Please wait while we fetch the payment information.</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="accept-payment-page">
        <div className="accept-payment-not-found">
          <div className="accept-payment-not-found-icon">
            <i className="bi bi-exclamation-circle"></i>
          </div>
          <h2>Payment Details Unavailable</h2>
          <p>We could not find the payment record.</p>
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/FeeComponent/AdminViewPayment")
            }
          >
            Back to Payments
          </button>
        </div>

        {showMsg && (
          <div className="accept-payment-message-overlay">
            <div className={`accept-payment-message-modal ${messageType}`}>
              <div className="accept-payment-message-icon">
                <i
                  className={
                    messageType === "success"
                      ? "bi bi-check-lg"
                      : "bi bi-exclamation-lg"
                  }
                ></i>
              </div>
              <h3>{messageType === "success" ? "Success" : "Unable to Continue"}</h3>
              <p>{messageText}</p>
              <button type="button" onClick={closeMessage}>
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="accept-payment-page">
      {/* ================= PAGE HEADER ================= */}
      <div className="accept-payment-header">
        <div className="accept-payment-header-left">
          <div className="accept-payment-header-icon">
            <i className="bi bi-wallet2"></i>
          </div>

          <div>
            <h1>Accept Payment</h1>
            <p>Record and confirm student fee payment details</p>
          </div>
        </div>

        <button
          type="button"
          className="accept-payment-back-btn"
          onClick={() =>
            navigate("/dashboard/FeeComponent/AdminViewPayment")
          }
        >
          <i className="bi bi-arrow-left"></i>
          Back to Payments
        </button>
      </div>

      {/* ================= PAYMENT REFERENCE ================= */}
      <div className="accept-payment-reference">
        <div className="accept-payment-reference-icon">
          <i className="bi bi-receipt"></i>
        </div>

        <div className="accept-payment-reference-info">
          <span>Payment Reference</span>
          <strong>#{id}</strong>
        </div>

        <div className="accept-payment-reference-status">
          <span className="accept-payment-status-dot"></span>
          Pending Payment
        </div>
      </div>

      {/* ================= STUDENT AND FEE DETAILS ================= */}
      <div className="accept-payment-details-grid">
        <div className="accept-payment-card">
          <div className="accept-payment-card-heading">
            <div className="accept-payment-card-icon purple">
              <i className="bi bi-person-vcard"></i>
            </div>

            <div>
              <h2>Student Information</h2>
              <p>Details of the student making payment</p>
            </div>
          </div>

          <div className="accept-payment-student-profile">
            <div className="accept-payment-avatar">
              {(payment.studentname || "S").charAt(0).toUpperCase()}
            </div>

            <div>
              <h3>{payment.studentname || "Student"}</h3>
              <span>Student Fee Account</span>
            </div>
          </div>

          <div className="accept-payment-info-list">
            <div className="accept-payment-info-item">
              <span>Student Name</span>
              <strong>{payment.studentname || "-"}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Class</span>
              <strong>{payment.class || "-"}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Roll Number</span>
              <strong>{payment.rollno || "-"}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Admission Number</span>
              <strong>{payment.admission_number || "-"}</strong>
            </div>
          </div>
        </div>

        <div className="accept-payment-card">
          <div className="accept-payment-card-heading">
            <div className="accept-payment-card-icon blue">
              <i className="bi bi-cash-stack"></i>
            </div>

            <div>
              <h2>Fee Information</h2>
              <p>Fee details for the selected payment</p>
            </div>
          </div>

          <div className="accept-payment-due-amount">
            <span>Payment Amount</span>
            <strong>
              ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="accept-payment-info-list">
            <div className="accept-payment-info-item">
              <span>Payment Period</span>
              <strong>{payment.period || "-"}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Last Date</span>
              <strong>{payment.lastdate || "-"}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Admission Fee</span>
              <strong>₹{payment.admission_fee || 0}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Annual Fee</span>
              <strong>₹{payment.annual_fee || 0}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Tuition Fee</span>
              <strong>₹{payment.tuition_fee || 0}</strong>
            </div>

            <div className="accept-payment-info-item">
              <span>Transport Fee</span>
              <strong>₹{payment.transport_fee || 0}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PAYMENT FORM ================= */}
      <div className="accept-payment-card accept-payment-form-card">
        <div className="accept-payment-card-heading">
          <div className="accept-payment-card-icon green">
            <i className="bi bi-credit-card"></i>
          </div>

          <div>
            <h2>Payment Entry</h2>
            <p>Enter the details to confirm this payment</p>
          </div>
        </div>

        <div className="accept-payment-form-grid">
          {/* PAYMENT DATE */}
          <div className="accept-payment-form-group">
            <label>
              Payment Date <span>*</span>
            </label>

            <div className="accept-payment-input-wrapper">
              <i className="bi bi-calendar-event"></i>
              <input
                type="date"
                value={form.payment_date}
                onChange={(e) =>
                  handleChange("payment_date", e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* LATE FEE */}
          <div className="accept-payment-form-group">
            <label>Late Fee</label>

            <div className="accept-payment-input-wrapper">
              <span className="accept-payment-currency">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.late_fee_paid}
                onChange={(e) =>
                  handleChange("late_fee_paid", e.target.value)
                }
                placeholder="Enter late fee"
              />
            </div>
          </div>

          {/* AMOUNT PAID */}
          <div className="accept-payment-form-group">
            <label>
              Amount Paid <span>*</span>
            </label>

            <div className="accept-payment-input-wrapper accept-payment-amount-input">
              <span className="accept-payment-currency">₹</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount_paid}
                onChange={(e) =>
                  handleChange("amount_paid", e.target.value)
                }
                placeholder="Enter amount paid"
                required
              />
            </div>
          </div>

          {/* PAYMENT MODE */}
          <div className="accept-payment-form-group">
            <label>Payment Mode</label>

            <div className="accept-payment-input-wrapper">
              <i className="bi bi-wallet"></i>
              <select
                value={form.payment_mode}
                onChange={(e) =>
                  handleChange("payment_mode", e.target.value)
                }
              >
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
        </div>

        <div className="accept-payment-required-note">
          <i className="bi bi-info-circle"></i>
          Fields marked with <span>*</span> are required.
        </div>

        <div className="accept-payment-form-footer">
          <button
            type="button"
            className="accept-payment-cancel-btn"
            onClick={() =>
              navigate("/dashboard/FeeComponent/AdminViewPayment")
            }
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="accept-payment-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="accept-payment-button-spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i>
                Accept Payment
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= LOADING OVERLAY ================= */}
      {submitting && (
        <div className="accept-payment-processing-overlay">
          <div className="accept-payment-processing-spinner"></div>
          <h3>Processing Payment</h3>
          <p>Please wait while the payment is being recorded.</p>
        </div>
      )}

      {/* ================= MESSAGE OVERLAY ================= */}
      {showMsg && (
        <div className="accept-payment-message-overlay">
          <div
            className={`accept-payment-message-modal ${messageType}`}
          >
            <div className="accept-payment-message-icon">
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
                ? "Payment Accepted!"
                : "Payment Not Accepted"}
            </h3>

            <p>{messageText}</p>

            <button type="button" onClick={closeMessage}>
              {messageType === "success" ? "Continue" : "OK"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
