import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AcceptStudentFee.css";
const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminFee/";

const AcceptStudentFee = () => {

  const { feeId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [payment, setPayment] = useState({
    id: "",
    student_id: "",
    studentname: "",
    class: "",
    rollno: "",
    amount: "",
    period: "",
    lastdate: "",
    payment_date: "",
    late_fee_paid: "",
    amount_paid: "",
    payment_mode: "cash"
  });

  // FETCH PAYMENT DATA
  useEffect(() => {

    axios
      .get(BASE_URL + "getPaymentById/" + feeId)
      .then((res) => {

        console.log(res.data); // debug

        if (res.data.status) {

          const data = res.data.data;

          setPayment({
            id: data.feeid || "",
            student_id: data.student_id || "",
            studentname: data.studentname || data.student_name || "",
            class: data.class || data.student_class || "",
            rollno: data.rollno || "",
            amount: data.amount || "",
            period: data.period || "",
            lastdate: data.lastdate || "",
            payment_date: "",
            late_fee_paid: "",
            amount_paid: "",
            payment_mode: "cash"
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

    formData.append("id", payment.id);
    formData.append("late_fee_paid", payment.late_fee_paid);
    formData.append("amount_paid", payment.amount_paid);
    formData.append("payment_mode", payment.payment_mode);
    formData.append("payment_date", payment.payment_date);
    formData.append("status", 1); // mark paid

    axios
      .post(BASE_URL + "updateStudentFee", formData)
      .then((res) => {

        if (res.data.status) {

          alert("Accepted Successfully");

          navigate("/StudentComponent/View-Payments/" + payment.student_id);

        } else {

          alert("Failed to Accept");

        }

      })
      .catch((err) => {

        console.log(err);
        alert("Server Error");

      });

  };


  if (loading) {
  return (
    <div className="asf-loading">
      Loading...
    </div>
  );
}


  return (
  <div className="asf-page">

    <div className="asf-card">

      {/* Header */}
      <div className="asf-header">
        Accept Fee Payment
      </div>

      <form onSubmit={handleSubmit} className="asf-form">

        <div className="asf-columns">

          {/* ================= LEFT COLUMN ================= */}
          <div className="asf-column">

            <div className="asf-field">
              <label className="asf-label">
                Student Name
              </label>

              <div className="asf-value">
                {payment.studentname || "-"}
              </div>
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Class
              </label>

              <div className="asf-value">
                {payment.class || "-"}
              </div>
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Roll No
              </label>

              <div className="asf-value">
                {payment.rollno || "-"}
              </div>
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Payment Date
              </label>

              <input
                type="date"
                name="payment_date"
                className="asf-input"
                value={payment.payment_date}
                onChange={handleChange}
                required
              />
            </div>

          </div>


          {/* ================= MIDDLE COLUMN ================= */}
          <div className="asf-column">

            <div className="asf-field">
              <label className="asf-label">
                Amount
              </label>

              <div className="asf-value">
                ₹ {payment.amount || "0"}
              </div>
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Period
              </label>

              <div className="asf-value">
                {payment.period || "-"}
              </div>
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Last Date
              </label>

              <div className="asf-value">
                {payment.lastdate || "-"}
              </div>
            </div>

          </div>


          {/* ================= RIGHT COLUMN ================= */}
          <div className="asf-column">

            <div className="asf-field">
              <label className="asf-label">
                Late Fee Paid
              </label>

              <input
                type="number"
                name="late_fee_paid"
                className="asf-input"
                value={payment.late_fee_paid}
                onChange={handleChange}
                placeholder="Enter late fee"
              />
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Amount Paid
              </label>

              <input
                type="number"
                name="amount_paid"
                className="asf-input"
                value={payment.amount_paid}
                onChange={handleChange}
                placeholder="Enter amount paid"
                required
              />
            </div>


            <div className="asf-field">
              <label className="asf-label">
                Payment Mode
              </label>

              <select
                name="payment_mode"
                className="asf-select"
                value={payment.payment_mode}
                onChange={handleChange}
              >
                <option value="cash">
                  Cash
                </option>

                <option value="cheque">
                  Cheque
                </option>

                <option value="online">
                  Online
                </option>
              </select>
            </div>

          </div>

        </div>


        {/* Button */}
        <div className="asf-button-area">

          <button
            type="submit"
            className="asf-accept-button"
          >
            Accept Payment
          </button>

        </div>

      </form>

    </div>

  </div>
  );

};

export default AcceptStudentFee;