import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AcceptPayment.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function AcceptPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);

  const [form, setForm] = useState({
    payment_date: "",
    late_fee_paid: "",
    amount_paid: "",
    payment_mode: "cash",
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    axios.get(API + "getPaymentById/" + id).then((res) => {
      const data = res.data.data;

      setPayment(data);

      // ✅ EXACT DB VALUES (NO EXTRA LOGIC)
      setForm({
        payment_date: "",
        late_fee_paid: data.late_fee_paid || "",
        amount_paid: data.amount_paid || "",
        payment_mode: data.payment_mode || "cash",
      });
    });
  }, [id]);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!form.payment_date || !form.amount_paid) {
      alert("Please fill required fields ❌");
      return;
    }

    try {
      await axios.post(API + "acceptPaymentFull", {
        payment_id: id,
        ...form,
      });

      alert("Payment Accepted ✅");
      navigate("/dashboard/FeeComponent/AdminViewPayment", {
        state: { refresh: Date.now() },
      });
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  if (!payment) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Accept Payment</h2>

      {/* TOP DETAILS */}
      <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>
        <div style={{ flex: 1 }}>
          <p>
            <b>Student:</b> {payment.studentname}
          </p>
          <p>
            <b>Class:</b> {payment.class}
          </p>
          <p>
            <b>Roll:</b> {payment.rollno}
          </p>

          <div className="form-group">
            <label className="form-label">Payment Date</label>

            <div className="input-wrapper">
              <span className="input-icon">📅</span>
              <input
                type="date"
                className="form-input"
                value={form.payment_date}
                onChange={(e) =>
                  setForm({ ...form, payment_date: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <p>
            <b>Amount:</b> {payment.amount}
          </p>
          <p>
            <b>Period:</b> {payment.period}
          </p>
          <p>
            <b>Last Date:</b> {payment.lastdate}
          </p>
        </div>
      </div>

      {/* 3 COLUMN ROW */}
      <div className="payment-row">
        {/* Late Fee */}
        <div className="input-group">
          <label>Late Fee</label>
          <div className="input-box">
            <span>₹</span>
            <input
              type="number"
              value={form.late_fee_paid}
              onChange={(e) =>
                setForm({ ...form, late_fee_paid: e.target.value })
              }
              placeholder="Enter late fee"
            />
          </div>
        </div>

        {/* Amount Paid */}
        <div className="input-group">
          <label>Amount Paid</label>
          <div className="input-box highlight">
            <span>₹</span>
            <input
              type="number"
              value={form.amount_paid}
              onChange={(e) =>
                setForm({ ...form, amount_paid: e.target.value })
              }
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div className="input-group">
          <label>Payment Mode</label>
          <select
            className="select-box"
            value={form.payment_mode}
            onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
          >
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="online">Online</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <button onClick={handleSubmit}>Accept Payment</button>
      </div>
    </div>
  );
}
