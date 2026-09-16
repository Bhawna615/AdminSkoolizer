import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateStudentFee.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminFee/";

const UpdateStudentFee = () => {
  const { feeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [payment, setPayment] = useState({
    id: "",
    student_id: "",
    student_name: "",
    student_class: "",
    rollno: "",
    session: "",
    tuition_fee: "",
    annual_fee: "",
    admission_fee: "",
    transport_fee: "",
    late_fee: 0,
    last_date: "",
    period: "",
    status: 0,
    payment_mode: "",
    amount_paid: "",
    remarks: "",
    payment_date: ""
  });

  // FETCH EXISTING DATA
  useEffect(() => {
    axios
      .get(BASE_URL + "getPaymentById/" + feeId)
      .then((res) => {
        if (res.data.status) {
          const data = res.data.data;

          setPayment({
            id: data.feeid || "",
            student_id: data.student_id || "",
            student_name: data.studentname || "",
            student_class: data.class || "",
            rollno: data.rollno || "",
            session: data.session || "",
            tuition_fee: data.tuition_fee || "",
            annual_fee: data.annual_fee || "",
            admission_fee: data.admission_fee || "",
            transport_fee: data.transport_fee || "",
            late_fee: data.late_fee_paid || 0,
            last_date: data.lastdate || "",
            period: data.period || "",
            status: data.status || 0,
            payment_mode: data.payment_mode || "",
            amount_paid: data.amount_paid || "",
            remarks: data.remarks || "",
            payment_date: data.paidondate || ""
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [feeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayment({
      ...payment,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(payment).forEach((key) => {
      formData.append(key, payment[key]);
    });

    axios
      .post(BASE_URL + "updateStudentFee", formData)
      .then((res) => {
        if (res.data.status) {
          alert("Updated Successfully");

          navigate(
            "/StudentComponent/View-Payments/" + payment.student_id
          );
        } else {
          alert("Update Failed");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server Error");
      });
  };

  if (loading) {
    return (
      <div className="usf-loading-screen">
        <div className="usf-loader"></div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="usf-page">

      {/* HEADER */}
      <div className="usf-header">
        <div>
          <h2 className="usf-title">Update Student Fee</h2>
          <p className="usf-subtitle">
            Update payment and fee information
          </p>
        </div>

        <div className="usf-fee-badge">
          Payment ID: #{payment.id}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="usf-form">

        {/* ================= LEFT COLUMN ================= */}
        <div className="usf-column">

          <div className="usf-section-heading">
            <span className="usf-section-icon">01</span>
            Student Information
          </div>

          {/* Student Name */}
          <div className="usf-field">
            <label className="usf-label">Student Name</label>
            <div className="usf-readonly">
              {payment.student_name || "-"}
            </div>
          </div>

          {/* Class */}
          <div className="usf-field">
            <label className="usf-label">Class</label>
            <div className="usf-readonly">
              {payment.student_class || "-"}
            </div>
          </div>

          {/* Roll No */}
          <div className="usf-field">
            <label className="usf-label">Roll No</label>
            <div className="usf-readonly">
              {payment.rollno || "-"}
            </div>
          </div>

          {/* Session */}
          <div className="usf-field">
            <label className="usf-label">Session</label>

            <select
              className="usf-input"
              name="session"
              value={payment.session}
              onChange={handleChange}
            >
              <option value="">Select Session</option>
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
            </select>
          </div>

        </div>

        {/* ================= MIDDLE COLUMN ================= */}
        <div className="usf-column">

          <div className="usf-section-heading">
            <span className="usf-section-icon">02</span>
            Fee Details
          </div>

          {/* Tuition Fee */}
          <div className="usf-field">
            <label className="usf-label">Tuition Fee</label>

            <div className="usf-input-money">
              <span>₹</span>
              <input
                type="number"
                name="tuition_fee"
                value={payment.tuition_fee}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Annual Fee */}
          <div className="usf-field">
            <label className="usf-label">Annual Fee</label>

            <div className="usf-input-money">
              <span>₹</span>
              <input
                type="number"
                name="annual_fee"
                value={payment.annual_fee}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Admission Fee */}
          <div className="usf-field">
            <label className="usf-label">Admission Fee</label>

            <div className="usf-input-money">
              <span>₹</span>
              <input
                type="number"
                name="admission_fee"
                value={payment.admission_fee}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Transport Fee */}
          <div className="usf-field">
            <label className="usf-label">Transport Fee</label>

            <div className="usf-input-money">
              <span>₹</span>
              <input
                type="number"
                name="transport_fee"
                value={payment.transport_fee}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Other Fee */}
          <div className="usf-field">
            <label className="usf-label">Any Other Fee</label>

            <div className="usf-input-money">
              <span>₹</span>
              <input
                type="number"
                name="late_fee"
                value={payment.late_fee}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="usf-column">

          <div className="usf-section-heading">
            <span className="usf-section-icon">03</span>
            Payment Details
          </div>

          {/* Last Date */}
          <div className="usf-field">
            <label className="usf-label">Last Date</label>

            <input
              type="date"
              className="usf-input"
              name="last_date"
              value={payment.last_date || ""}
              onChange={handleChange}
            />
          </div>

          {/* Period */}
          <div className="usf-field">
            <label className="usf-label">Period</label>

            <input
              type="text"
              className="usf-input"
              name="period"
              value={payment.period}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="usf-field">
            <label className="usf-label">Status</label>

            <select
              className="usf-input"
              name="status"
              value={payment.status}
              onChange={handleChange}
            >
              <option value="0">Unpaid</option>
              <option value="1">Paid</option>
            </select>
          </div>

          {/* Payment Mode */}
          <div className="usf-field">
            <label className="usf-label">Payment Mode</label>

            <select
              className="usf-input"
              name="payment_mode"
              value={payment.payment_mode}
              onChange={handleChange}
            >
              <option value="">Select Payment Mode</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Amount Paid */}
          <div className="usf-field">
            <label className="usf-label">Amount Paid</label>

            <div className="usf-input-money">
              <span>₹</span>
              <input
                type="number"
                name="amount_paid"
                value={payment.amount_paid}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="usf-field">
            <label className="usf-label">Remarks</label>

            <input
              type="text"
              className="usf-input"
              name="remarks"
              value={payment.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
            />
          </div>

          {/* Payment Date */}
          <div className="usf-field">
            <label className="usf-label">Payment Date</label>

            <input
              type="date"
              className="usf-input"
              name="payment_date"
              value={payment.payment_date || ""}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* BUTTON */}
        <div className="usf-action-area">
          <button type="submit" className="usf-update-button">
            <span>Update Payment</span>
          </button>
        </div>

      </form>
    </div>
  );
};

export default UpdateStudentFee;