import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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
    return <div className="text-center mt-5">Loading...</div>;
  }


  return (

    <div className="container mt-4">

      <h4 className="mb-4">Accept Fee Payment</h4>

      <form onSubmit={handleSubmit}>

        <div className="row">

          {/* LEFT */}
          <div className="col-md-4">

            <p><b>Student Name</b></p>
            <p>{payment.studentname}</p>

            <p><b>Class</b></p>
            <p>{payment.class}</p>

            <p><b>Roll No</b></p>
            <p>{payment.rollno}</p>

            <p><b>Payment Date</b></p>
            <input
              type="date"
              name="payment_date"
              className="form-control"
              value={payment.payment_date}
              onChange={handleChange}
              required
            />

          </div>


          {/* MIDDLE */}
          <div className="col-md-4">

            <p><b>Amount</b></p>
            <p>{payment.amount}</p>

            <p><b>Period</b></p>
            <p>{payment.period}</p>

            <p><b>Last Date</b></p>
            <p>{payment.lastdate}</p>

          </div>


          {/* RIGHT */}
          <div className="col-md-4">

            <p><b>Late Fee Paid</b></p>
            <input
              type="number"
              name="late_fee_paid"
              className="form-control"
              value={payment.late_fee_paid}
              onChange={handleChange}
            />

            <p className="mt-3"><b>Amount Paid</b></p>
            <input
              type="number"
              name="amount_paid"
              className="form-control"
              value={payment.amount_paid}
              onChange={handleChange}
              required
            />

            <p className="mt-3"><b>Payment Mode</b></p>
            <select
              name="payment_mode"
              className="form-control"
              value={payment.payment_mode}
              onChange={handleChange}
            >
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>

          </div>

        </div>

        <div className="text-center mt-4">

          <button
            type="submit"
            style={{
              fontSize: "18px",
              width: "30%",
              backgroundColor: "#2C56BB",
              color: "white",
              border: "none",
              padding: "10px 0",
              borderRadius: "5px"
            }}
          >
            Accept
          </button>

        </div>

      </form>

    </div>

  );

};

export default AcceptStudentFee;