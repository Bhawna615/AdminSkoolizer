import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditPaidFee.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function EditPaidFee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentname: "",
    class: "",
    admission_number: "",
    amount_paid: "",
    amount: "",
  });

  const [data, setData] = useState({});

  // ✅ GET DATA
  useEffect(() => {
    axios.get(API + "getPaidPayment", { params: { id } }).then((res) => {
      const d = res.data.data || {};
      setData(d);
      setForm({
        studentname: d.studentname || "",
        class: d.class || "",
        admission_number: d.admission_number || "",
        amount_paid: d.amount_paid || "",
        amount: d.amount || "",
      });
    });
  }, [id]);

  // ✅ HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(API + "updatePaidFee", {
      id,
      ...form,
    }).then((res) => {
      alert("Updated Successfully");
      navigate("/dashboard/FeeComponent/AdminViewPayment");
    });
  };

  return (
    <div className="edit-container">
      <form onSubmit={handleSubmit}>
        <div className="grid">

          {/* LEFT */}
          <div>
            <input type="hidden" value={id} />

            <p>Student Name</p>
            <input name="studentname" value={form.studentname} onChange={handleChange} />

            <p>Class</p>
            <input name="class" value={form.class} onChange={handleChange} />

            <p>Roll No.</p>
            <p className="info">{data.rollno}</p>

            <p>Session</p>
            <p className="info">{data.session}</p>

            <p>Transaction Id</p>
            <p className="info">{data.razorpay_order_id}</p>

            <p>Easepay Id</p>
            <p className="info">{data.easepay_id}</p>

            <p>Student Id</p>
            <p className="info">{data.student_id}</p>
          </div>

          {/* MIDDLE */}
          <div>
            <p>Payment Mode</p>
            <p className="info">{data.payment_mode}</p>

            <p>Late Fee Paid</p>
            <p className="info">{data.late_fee_paid}</p>

            <p>Amount Paid</p>
            <input name="amount_paid" value={form.amount_paid} onChange={handleChange} />

            <p>Payment Date</p>
            <p className="info">{data.paidondate}</p>
          </div>

          {/* RIGHT */}
          <div>
            <p>Admission No</p>
            <input name="admission_number" value={form.admission_number} onChange={handleChange} />

            <p>Tuition Fee</p>
            <p className="info">{data.tuition_fee}</p>

            <p>Annual Fee</p>
            <p className="info">{data.annual_fee}</p>

            <p>Admission Fee</p>
            <p className="info">{data.admission_fee}</p>

            <p>Transport Fee</p>
            <p className="info">{data.transport_fee}</p>

            <p>Amount</p>
            <input name="amount" value={form.amount} onChange={handleChange} />

            <p>Last Date</p>
            <p className="info">{data.lastdate}</p>

            <p>Period</p>
            <p className="info">{data.period}</p>

            <p>Status</p>
            <p className="info">{data.status == 1 ? "Paid" : "Unpaid"}</p>
          </div>

        </div>

        <div className="btn-wrap">
          <button type="submit" className="editpaid_btn">Update</button>
        </div>
      </form>
    </div>
  );
}