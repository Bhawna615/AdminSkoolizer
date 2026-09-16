import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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

  // ================= LOAD DATA =================
  useEffect(() => {
    axios.get(API + "getPaymentById/" + id).then((res) => {
      const data = res.data.data;

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
    });
  }, [id]);

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      const payload = new FormData();

      // IMPORTANT: backend expects `id`
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
        alert("Updated Successfully ✅");

        navigate("/dashboard/FeeComponent/AdminViewPayment", {
          state: { refresh: Date.now() },
        });
      } else {
        alert("Update Failed ❌");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error ❌");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="edit-container">
      <h2 className="title">Update Student Fee</h2>

      <div className="grid">
        {/* COLUMN 1 */}
        <div className="card">
          <h3>Student Details</h3>

          <label>Student Name</label>
          <input value={form.studentname} disabled />

          <label>Class</label>
          <input value={form.class} disabled />

          <label>Roll No</label>
          <input value={form.rollno} disabled />

          <label>Admission No</label>
          <input value={form.admission_number} disabled />

          <label>Session</label>
          <input
            value={form.session}
            onChange={(e) => setForm({ ...form, session: e.target.value })}
          />
        </div>

        {/* COLUMN 2 */}
        <div className="card">
          <h3>Fee Details</h3>

          <label>Tuition Fee</label>
          <input
            type="number"
            value={form.tuition_fee}
            onChange={(e) => setForm({ ...form, tuition_fee: e.target.value })}
          />

          <label>Annual Fee</label>
          <input
            type="number"
            value={form.annual_fee}
            onChange={(e) => setForm({ ...form, annual_fee: e.target.value })}
          />

          <label>Admission Fee</label>
          <input
            type="number"
            value={form.admission_fee}
            onChange={(e) =>
              setForm({ ...form, admission_fee: e.target.value })
            }
          />

          <label>Transport Fee</label>
          <input
            type="number"
            value={form.transport_fee}
            onChange={(e) =>
              setForm({ ...form, transport_fee: e.target.value })
            }
          />

          <label>Late Fee</label>
          <input
            type="number"
            value={form.late_fee}
            onChange={(e) => setForm({ ...form, late_fee: e.target.value })}
          />
        </div>

        {/* COLUMN 3 */}
        <div className="card">
          <h3>Payment Details</h3>

          <label>Last Date</label>
          <input
            type="date"
            value={form.lastdate}
            onChange={(e) => setForm({ ...form, lastdate: e.target.value })}
          />

          <label>Period</label>
          <input
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
          />

          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="0">Unpaid</option>
            <option value="1">Paid</option>
          </select>

          <label>Payment Mode</label>
          <select
            value={form.payment_mode}
            onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
          >
            <option value="">Select</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="online">Online</option>
          </select>

          <label>Amount Paid</label>
          <input
            type="number"
            value={form.amount_paid}
            onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
          />

          <label>Payment Date</label>
          <input
            type="date"
            value={form.paidondate}
            onChange={(e) => setForm({ ...form, paidondate: e.target.value })}
          />

          <label>Remarks</label>
          <input
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
        </div>
      </div>

      <div className="btn-area">
        <button onClick={handleUpdate} className="updatefee_btn">Update Fee</button>
      </div>
    </div>
  );
}
