
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./EditStudentFee.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function EditStudentFee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    student_id: "",
    studentname: "",
    class: "",
    rollno: "",
    admission_number: "",
    session: "",
    tuition_fee: "",
    annual_fee: "",
    admission_fee: "",
    transport_fee: "",
    late_fee: 0,
    lastdate: "",
    period: "",
    status: 0,
    payment_mode: "",
    amount_paid: "",
    paidondate: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);

        const res = await axios.get(API + "getPaymentById/" + id);
        const data = res.data.data;

        if (!data) {
          throw new Error("Payment details not found.");
        }

        setForm({
          student_id: data.student_id || "",
          studentname: data.studentname || "",
          class: data.class || "",
          rollno: data.rollno || "",
          admission_number: data.admission_number || "",
          session: data.session || "",
          tuition_fee: data.tuition_fee || "",
          annual_fee: data.annual_fee || "",
          admission_fee: data.admission_fee || "",
          transport_fee: data.transport_fee || "",
          late_fee: data.late_fee || 0,
          lastdate: data.lastdate || "",
          period: data.period || "",
          status: data.status ?? 0,
          payment_mode: data.payment_mode || "",
          amount_paid: data.amount_paid || "",
          paidondate: data.paidondate || "",
          remarks: data.remarks || "",
        });
      } catch (err) {
        console.error("Error loading payment:", err);
        setMessage("Unable to load student fee details.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = new FormData();

      // Backend expects id
      payload.append("id", id);

      Object.keys(form).forEach((key) => {
        payload.append(key, form[key]);
      });

      console.log([...payload.entries()]);

      const res = await axios.post(API + "updateStudentFee", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);

      if (res.data.status) {
        setMessage("Student fee details updated successfully!");
        setMessageType("success");

        setTimeout(() => {
          navigate("/dashboard/FeeComponent/AdminViewPayment", {
            state: { refresh: Date.now() },
          });
        }, 2200);
      } else {
        setMessage("Update failed. Please check the details and try again.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Update error:", err);

      setMessage("Server error! Unable to update student fee.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  // ================= TOTAL FEE =================
  const totalFee =
    Number(form.tuition_fee || 0) +
    Number(form.annual_fee || 0) +
    Number(form.admission_fee || 0) +
    Number(form.transport_fee || 0) +
    Number(form.late_fee || 0);

  return (
    <div className="esf-page">
      <div className="esf-container">

        {/* PAGE HEADER */}
        <div className="esf-page-header">
          <div className="esf-heading-content">
            <div className="esf-heading-icon">
              <i className="bi bi-wallet2"></i>
            </div>

            <div>
              <h2>Edit Student Fee</h2>
              <p>Manage and update student payment information</p>
            </div>
          </div>

          <button
            type="button"
            className="esf-back-btn"
            onClick={() =>
              navigate("/dashboard/FeeComponent/AdminViewPayment")
            }
          >
            <i className="bi bi-arrow-left"></i>
            Back to Payments
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="esf-loading">
            <div className="esf-loader"></div>
            <p>Loading student fee details...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>

            {/* STUDENT SUMMARY */}
            <div className="esf-student-banner">
              <div className="esf-student-avatar">
                <i className="bi bi-person-fill"></i>
              </div>

              <div className="esf-student-info">
                <span>STUDENT INFORMATION</span>
                <h3>{form.studentname || "Student Name"}</h3>
                <p>
                  <span>
                    <i className="bi bi-mortarboard"></i>
                    Class: {form.class || "N/A"}
                  </span>
                  <span>
                    <i className="bi bi-person-badge"></i>
                    Admission No: {form.admission_number || "N/A"}
                  </span>
                </p>
              </div>

              <div className="esf-session-tag">
                <i className="bi bi-calendar3"></i>
                {form.session || "Session"}
              </div>
            </div>

            <div className="esf-grid">

              {/* STUDENT DETAILS */}
              <div className="esf-card">
                <div className="esf-card-header">
                  <div className="esf-card-heading-icon">
                    <i className="bi bi-person-vcard"></i>
                  </div>
                  <div>
                    <h3>Student Details</h3>
                    <p>Basic student information</p>
                  </div>
                </div>

                <div className="esf-card-body">
                  <div className="esf-form-group">
                    <label>Student Name</label>
                    <div className="esf-input-wrap esf-disabled">
                      <i className="bi bi-person"></i>
                      <input
                        value={form.studentname}
                        disabled
                        readOnly
                      />
                      <i className="bi bi-lock esf-lock-icon"></i>
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Class</label>
                    <div className="esf-input-wrap esf-disabled">
                      <i className="bi bi-mortarboard"></i>
                      <input value={form.class} disabled readOnly />
                      <i className="bi bi-lock esf-lock-icon"></i>
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Roll Number</label>
                    <div className="esf-input-wrap esf-disabled">
                      <i className="bi bi-hash"></i>
                      <input value={form.rollno} disabled readOnly />
                      <i className="bi bi-lock esf-lock-icon"></i>
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Admission Number</label>
                    <div className="esf-input-wrap esf-disabled">
                      <i className="bi bi-card-text"></i>
                      <input
                        value={form.admission_number}
                        disabled
                        readOnly
                      />
                      <i className="bi bi-lock esf-lock-icon"></i>
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Academic Session</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-calendar-range"></i>
                      <input
                        name="session"
                        value={form.session}
                        onChange={handleChange}
                        placeholder="Enter academic session"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FEE DETAILS */}
              <div className="esf-card">
                <div className="esf-card-header">
                  <div className="esf-card-heading-icon esf-purple">
                    <i className="bi bi-cash-stack"></i>
                  </div>
                  <div>
                    <h3>Fee Details</h3>
                    <p>Update applicable fee amounts</p>
                  </div>
                </div>

                <div className="esf-card-body">
                  <div className="esf-form-group">
                    <label>Tuition Fee</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-currency-rupee"></i>
                      <input
                        type="number"
                        name="tuition_fee"
                        min="0"
                        value={form.tuition_fee}
                        onChange={handleChange}
                        placeholder="Enter tuition fee"
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Annual Fee</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-calendar-check"></i>
                      <input
                        type="number"
                        name="annual_fee"
                        min="0"
                        value={form.annual_fee}
                        onChange={handleChange}
                        placeholder="Enter annual fee"
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Admission Fee</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-journal-plus"></i>
                      <input
                        type="number"
                        name="admission_fee"
                        min="0"
                        value={form.admission_fee}
                        onChange={handleChange}
                        placeholder="Enter admission fee"
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Transport Fee</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-bus-front"></i>
                      <input
                        type="number"
                        name="transport_fee"
                        min="0"
                        value={form.transport_fee}
                        onChange={handleChange}
                        placeholder="Enter transport fee"
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Late Fee</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-clock-history"></i>
                      <input
                        type="number"
                        name="late_fee"
                        min="0"
                        value={form.late_fee}
                        onChange={handleChange}
                        placeholder="Enter late fee"
                      />
                    </div>
                  </div>

                  <div className="esf-total-preview">
                    <div>
                      <span>
                        <i className="bi bi-calculator"></i>
                        Total Fee Amount
                      </span>
                      <small>Combined fee components</small>
                    </div>
                    <strong>
                      ₹{totalFee.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              </div>

              {/* PAYMENT DETAILS */}
              <div className="esf-card esf-payment-card">
                <div className="esf-card-header">
                  <div className="esf-card-heading-icon esf-green">
                    <i className="bi bi-receipt"></i>
                  </div>
                  <div>
                    <h3>Payment Details</h3>
                    <p>Manage payment status and transaction details</p>
                  </div>
                </div>

                <div className="esf-card-body esf-payment-grid">
                  <div className="esf-form-group">
                    <label>Last Date</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-calendar-event"></i>
                      <input
                        type="date"
                        name="lastdate"
                        value={form.lastdate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Period</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-calendar-month"></i>
                      <input
                        name="period"
                        value={form.period}
                        onChange={handleChange}
                        placeholder="e.g. April"
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Payment Status</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-check-circle"></i>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                      >
                        <option value="0">Unpaid</option>
                        <option value="1">Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Payment Mode</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-credit-card"></i>
                      <select
                        name="payment_mode"
                        value={form.payment_mode}
                        onChange={handleChange}
                      >
                        <option value="">Select Payment Mode</option>
                        <option value="cash">Cash</option>
                        <option value="cheque">Cheque</option>
                        <option value="online">Online</option>
                      </select>
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Amount Paid</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-currency-rupee"></i>
                      <input
                        type="number"
                        name="amount_paid"
                        min="0"
                        value={form.amount_paid}
                        onChange={handleChange}
                        placeholder="Enter amount paid"
                      />
                    </div>
                  </div>

                  <div className="esf-form-group">
                    <label>Payment Date</label>
                    <div className="esf-input-wrap">
                      <i className="bi bi-calendar2-check"></i>
                      <input
                        type="date"
                        name="paidondate"
                        value={form.paidondate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="esf-form-group esf-full-width">
                    <label>Remarks</label>
                    <div className="esf-input-wrap esf-textarea-wrap">
                      <i className="bi bi-chat-left-text"></i>
                      <textarea
                        name="remarks"
                        value={form.remarks}
                        onChange={handleChange}
                        placeholder="Add payment remarks or notes..."
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="esf-action-footer">
              <div className="esf-footer-note">
                <i className="bi bi-info-circle"></i>
                <span>Review the details before updating the fee record.</span>
              </div>

              <div className="esf-actions">
                <button
                  type="button"
                  className="esf-cancel-btn"
                  onClick={() =>
                    navigate("/dashboard/FeeComponent/AdminViewPayment")
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="esf-update-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="esf-button-spinner"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      Update Fee
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* MESSAGE OVERLAY */}
      {message && (
        <div className="esf-message-overlay">
          <div className={`esf-message-box ${messageType}`}>
            <div className="esf-message-icon">
              {messageType === "success" ? (
                <i className="bi bi-check-lg"></i>
              ) : (
                <i className="bi bi-exclamation-lg"></i>
              )}
            </div>

            <h3>
              {messageType === "success" ? "Success!" : "Something Went Wrong"}
            </h3>

            <p>{message}</p>

            <div className="esf-message-progress">
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
