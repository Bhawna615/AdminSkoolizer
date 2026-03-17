import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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

          setLoading(false);
        }

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
          navigate("/StudentComponent/View-Payments/" + payment.student_id);

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
    return <div className="text-center mt-5">Loading...</div>;
  }


  return (

    <div className="container-fluid p-4">

      <h4 className="mb-4">Update Student Fee</h4>

      <form onSubmit={handleSubmit}>

        <div className="row">

          {/* LEFT COLUMN */}
          <div className="col-md-4">

            <div className="mb-3">
              <label className="form-label">Student Name</label>
              <p>{payment.student_name}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Class</label>
              <p>{payment.student_class}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Roll No</label>
              <p>{payment.rollno}</p>
            </div>

            <div className="mb-3">
              <label className="form-label">Session</label>
              <select
                className="form-control"
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


          {/* MIDDLE COLUMN */}
          <div className="col-md-4">

            <div className="mb-3">
              <label className="form-label">Tuition Fee</label>
              <input
                type="number"
                className="form-control"
                name="tuition_fee"
                value={payment.tuition_fee}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Annual Fee</label>
              <input
                type="number"
                className="form-control"
                name="annual_fee"
                value={payment.annual_fee}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Admission Fee</label>
              <input
                type="number"
                className="form-control"
                name="admission_fee"
                value={payment.admission_fee}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Transport Fee</label>
              <input
                type="number"
                className="form-control"
                name="transport_fee"
                value={payment.transport_fee}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Any Other Fee</label>
              <input
                type="number"
                className="form-control"
                name="late_fee"
                value={payment.late_fee}
                onChange={handleChange}
              />
            </div>

          </div>


          {/* RIGHT COLUMN */}
          <div className="col-md-4">

            <div className="mb-3">
              <label className="form-label">Last Date</label>
              <input
                type="date"
                className="form-control"
                name="last_date"
                value={payment.last_date || ""}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Period</label>
              <input
                type="text"
                className="form-control"
                name="period"
                value={payment.period}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                name="status"
                value={payment.status}
                onChange={handleChange}
              >
                <option value="0">Unpaid</option>
                <option value="1">Paid</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Mode</label>
              <select
                className="form-control"
                name="payment_mode"
                value={payment.payment_mode}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Amount Paid</label>
              <input
                type="number"
                className="form-control"
                name="amount_paid"
                value={payment.amount_paid}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Remarks</label>
              <input
                type="text"
                className="form-control"
                name="remarks"
                value={payment.remarks}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Date</label>
              <input
                type="date"
                className="form-control"
                name="payment_date"
                value={payment.payment_date || ""}
                onChange={handleChange}
              />
            </div>

          </div>

        </div>


        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-primary px-5"
            style={{ background: "#2C56BB", border: "none", fontSize: "18px" }}
          >
            Update
          </button>
        </div>

      </form>

    </div>

  );

};

export default UpdateStudentFee;