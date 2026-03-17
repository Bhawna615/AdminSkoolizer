import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreateStudentPayment.css";

const BASE_URL = "http://localhost/kkblossom/api.php/Adminapi/AdminFee/";

const CreateStudentPayment = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  const currentYear = new Date().getFullYear();
  const currentSession = `${currentYear}-${currentYear + 1}`;
  const prevSession = `${currentYear - 1}-${currentYear}`;

  const [formData, setFormData] = useState({
    session: currentSession,
    tuition_fee: 0,
    annual_fee: 0,
    admission_fee: 0,
    transport_fee: 0,
    late_fee: 0,
    last_date: "",
    period: "March",
    status: 0,
    payment_mode: "",
    amount_paid: "",
    payment_date: "",
    remarks: "",
  });

  useEffect(() => {
    axios
      .get(`${BASE_URL}getStudent/${studentId}`)
      .then((res) => {
        if (res.data.status) {
          setStudent(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [studentId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount =
      Number(formData.tuition_fee) +
      Number(formData.annual_fee) +
      Number(formData.admission_fee) +
      Number(formData.transport_fee) +
      Number(formData.late_fee);

    const payload = {
      student_id: student.id,
      student_name: student.Name,
      student_class: student.Class,
      admission_number: student.Admno,
      rollno: student.Rollno,
      ...formData,
      amount: totalAmount,
    };

    try {
      await axios.post(`${BASE_URL}insertStudentFee`, payload);
      alert("Added Successfully");
     navigate(`/StudentComponent/View-Payments/${student.id}`, {
  state: { message: "Payment created successfully" }
});
    } catch (error) {
      alert("Failed to Add");
    }
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div className="payment-container">
      <h2 className="page-title">Create Student Payment</h2>

      <form onSubmit={handleSubmit} className="payment-form">
        {/* LEFT COLUMN */}
        <div className="column">
          <div className="info-group">
            <label>Student Name</label>
            <p>{student.Name}</p>
          </div>

          <div className="info-group">
            <label>Class</label>
            <p>{student.Class}</p>
          </div>

          <div className="info-group">
            <label>Roll No.</label>
            <p>{student.Rollno}</p>
          </div>

          <div className="info-group">
            <label>Admission No.</label>
            <p>{student.Admno}</p>
          </div>

          <div className="form-group">
            <label>Session</label>
            <select name="session" onChange={handleChange}>
              <option value={currentSession}>{currentSession}</option>
              <option value={prevSession}>{prevSession}</option>
            </select>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="column">
          <div className="form-group">
            <label>Tuition Fee</label>
            <input className="Fees-input" type="number" name="tuition_fee" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Annual Fee</label>
            <input className="Fees-input" type="number" name="annual_fee" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Admission Fee</label>
            <input className="Fees-input" type="number" name="admission_fee" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Transport Fee</label>
            <input type="number" name="transport_fee" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Any Other Fee</label>
            <input className="Fees-input" type="number" name="late_fee" onChange={handleChange} />
          </div>
          <div className="button-wrapper">
          <button type="submit" className="create-btn">
            Create
          </button>
        </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="column">
          <div className="form-group">
            <label>Last Date</label>
            <input className="Fees-input" type="date" name="last_date" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Period</label>
            <input type="text" name="period" defaultValue="March" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" onChange={handleChange}>
              <option value="0">Unpaid</option>
              <option value="1">Paid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Payment Mode</label>
            <select name="payment_mode" onChange={handleChange}>
              <option value="">Select</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount Paid</label>
            <input className="Fees-input" type="number" name="amount_paid" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Payment Date</label>
            <input className="Fees-input" type="date" name="payment_date" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <input className="Fees-input" type="text" name="remarks" onChange={handleChange} />
          </div>
        </div>

        
      </form>
    </div>
  );
};

export default CreateStudentPayment;