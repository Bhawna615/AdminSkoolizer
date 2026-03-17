// src/pages/EditStudentFee.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost/yourproject/index.php/fee/";

const EditStudentFee = () => {
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
    await axios.post(`${BASE_URL}updateStudentFee`, payment);
    alert("Updated Successfully");
    navigate("/view-payments");
  };

  if (!payment) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>Edit Payment</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="tuition_fee"
          value={payment.tuition_fee}
          onChange={handleChange}
        />

        <input
          type="number"
          name="annual_fee"
          value={payment.annual_fee}
          onChange={handleChange}
        />

        <input
          type="number"
          name="admission_fee"
          value={payment.admission_fee}
          onChange={handleChange}
        />

        <input
          type="number"
          name="transport_fee"
          value={payment.transport_fee}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount_paid"
          value={payment.amount_paid}
          onChange={handleChange}
        />

        <input
          type="date"
          name="payment_date"
          value={payment.paidondate}
          onChange={handleChange}
        />

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditStudentFee;