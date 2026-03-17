// src/pages/AcceptPayment.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost/yourproject/index.php/fee/";

const AcceptPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}getPayment/${id}`).then((res) => {
      setPayment(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setPayment({
      ...payment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${BASE_URL}update`, payment);
    alert("Payment Accepted");
    navigate("/view-payments");
  };

  if (!payment) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Accept Payment</h2>

      <form onSubmit={handleSubmit}>
        <p>Student: {payment.studentname}</p>
        <p>Amount: {payment.amount}</p>

        <input
          type="date"
          name="payment_date"
          onChange={handleChange}
        />

        <input
          type="number"
          name="late_fee_paid"
          placeholder="Late Fee Paid"
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount_paid"
          placeholder="Amount Paid"
          onChange={handleChange}
        />

        <select name="payment_mode" onChange={handleChange}>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="online">Online</option>
        </select>

        <button type="submit">Accept</button>
      </form>
    </div>
  );
};

export default AcceptPayment;