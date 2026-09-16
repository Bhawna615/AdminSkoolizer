
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
        state: { message: "Payment created successfully" },
      });
    } catch (error) {
      console.error(error);
      alert("Failed to Add");
    }
  };

  if (!student) {
    return (
      <div className="csp-loading-screen">
        <div className="csp-loader"></div>
        <p>Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="csp-page">

      <div className="csp-main-card">

        {/* HEADER */}
        <div className="csp-header">
          <div>
            <h2><i class="bi bi-currency-rupee"></i> Create Student Payment</h2>
            <p>Add fee and payment details for the student</p>
          </div>

          <div className="csp-header-icon">
            ₹
          </div>
        </div>

        <form onSubmit={handleSubmit} className="csp-form">

          <div className="csp-three-column">

            {/* ================= COLUMN 1 ================= */}
            <div className="csp-column">

              <div className="csp-column-heading">
                <span className="csp-heading-number">01</span>
                <div>
                  <h3>Student Details</h3>
                  <p>Basic student information</p>
                </div>
              </div>

              <div className="csp-info-field">
                <label>Student Name</label>
                <div className="csp-info-value">
                  {student.Name || "N/A"}
                </div>
              </div>

              <div className="csp-info-field">
                <label>Class</label>
                <div className="csp-info-value">
                  {student.Class || "N/A"}
                </div>
              </div>

              <div className="csp-info-field">
                <label>Roll No.</label>
                <div className="csp-info-value">
                  {student.Rollno || "N/A"}
                </div>
              </div>

              <div className="csp-info-field">
                <label>Admission No.</label>
                <div className="csp-info-value">
                  {student.Admno || "N/A"}
                </div>
              </div>

              <div className="csp-form-field">
                <label>Session</label>
                <select
                  name="session"
                  value={formData.session}
                  onChange={handleChange}
                >
                  <option value={currentSession}>
                    {currentSession}
                  </option>
                  <option value={prevSession}>
                    {prevSession}
                  </option>
                </select>
              </div>

            </div>

            {/* ================= COLUMN 2 ================= */}
            <div className="csp-column">

              <div className="csp-column-heading">
                <span className="csp-heading-number">02</span>
                <div>
                  <h3>Fee Details</h3>
                  <p>Enter applicable fees</p>
                </div>
              </div>

              <div className="csp-form-field">
                <label>Tuition Fee</label>
                <input
                  type="number"
                  name="tuition_fee"
                  value={formData.tuition_fee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="csp-form-field">
                <label>Annual Fee</label>
                <input
                  type="number"
                  name="annual_fee"
                  value={formData.annual_fee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="csp-form-field">
                <label>Admission Fee</label>
                <input
                  type="number"
                  name="admission_fee"
                  value={formData.admission_fee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="csp-form-field">
                <label>Transport Fee</label>
                <input
                  type="number"
                  name="transport_fee"
                  value={formData.transport_fee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="csp-form-field">
                <label>Any Other Fee</label>
                <input
                  type="number"
                  name="late_fee"
                  value={formData.late_fee}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="csp-total-box">
                <span>Total Amount</span>
                <strong>
                  ₹
                  {(
                    Number(formData.tuition_fee) +
                    Number(formData.annual_fee) +
                    Number(formData.admission_fee) +
                    Number(formData.transport_fee) +
                    Number(formData.late_fee)
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

            </div>

            {/* ================= COLUMN 3 ================= */}
            <div className="csp-column">

              <div className="csp-column-heading">
                <span className="csp-heading-number">03</span>
                <div>
                  <h3>Payment Details</h3>
                  <p>Payment and due information</p>
                </div>
              </div>

              <div className="csp-form-field">
                <label>Last Date</label>
                <input
                  type="date"
                  name="last_date"
                  value={formData.last_date}
                  onChange={handleChange}
                />
              </div>

              <div className="csp-form-field">
                <label>Period</label>
                <input
                  type="text"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                />
              </div>

              <div className="csp-form-field">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="0">Unpaid</option>
                  <option value="1">Paid</option>
                </select>
              </div>

              <div className="csp-form-field">
                <label>Payment Mode</label>
                <select
                  name="payment_mode"
                  value={formData.payment_mode}
                  onChange={handleChange}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div className="csp-form-field">
                <label>Amount Paid</label>
                <input
                  type="number"
                  name="amount_paid"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="csp-form-field">
                <label>Payment Date</label>
                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                />
              </div>

              <div className="csp-form-field">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks..."
                ></textarea>
              </div>

            </div>

          </div>

          {/* BUTTON */}
          <div className="csp-action-area">
            <button type="submit" className="csp-create-button">
              Create Payment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateStudentPayment;
