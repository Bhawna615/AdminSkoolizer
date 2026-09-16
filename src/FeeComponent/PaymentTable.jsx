import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

import $ from "jquery";

import "datatables.net-dt";

import "datatables.net-dt/css/dataTables.dataTables.css";

import "./PaymentTable.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/FeeStatistics/";

export default function PaymentTable() {
  const { type, period, date } = useParams();

  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const tableRef = useRef();

  useEffect(() => {
    let url = "";

    if (date) {
      url = API + "getPaidPaymentsByDate/" + date;
    } else {
      url = API + "getPayments/" + type + "/" + period;
    }

    axios
      .get(url)

      .then((res) => {
        setPayments(res.data || []);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [type, period, date]);

  const handleReceipt = (id) => {
    window.open(`/FeeComponent/FeeReceipt/${id}`, "_blank");
  };

  useEffect(() => {
    if (payments.length > 0) {
      $(tableRef.current).DataTable({
        destroy: true,
        responsive: true,
        pageLength: 10,
        order: [[0, "desc"]],
      });
    }
  }, [payments]);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2 className="page-title">
          {date ? `PAID PAYMENTS OF ${date}` : `${type.toUpperCase()} PAYMENTS`}{" "}
          PAYMENTS
        </h2>
      </div>

      <div className="table-wrapper">
        <table ref={tableRef} className="payment-table display">
          <thead>
            <tr>
              <th>Payment Id</th>
              <th>Transaction Id</th>
              <th>EasePay Id</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Admission No.</th>
              <th>Admission Fee</th>
              <th>Annual Fee</th>
              <th>Tuition Fee</th>
              <th>Transport Fee</th>
              <th>Amount</th>
              <th>Last Date</th>
              <th>Period</th>
              <th>Status</th>
              <th>Payment Mode</th>
              <th>Late Fee Paid</th>
              <th>Amount Paid</th>
              <th>Paid On</th>
              <th>Session</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.length > 0 ? (
              payments.map((row, index) => (
                <tr key={index}>
                  <td>{row.feeid}</td>

                  <td>{row.razorpay_order_id}</td>

                  <td>{row.easepay_id}</td>

                  <td>{row.studentname}</td>

                  <td>{row.class}</td>

                  <td>{row.admission_number}</td>

                  <td>₹ {row.admission_fee}</td>

                  <td>₹ {row.annual_fee}</td>

                  <td>₹ {row.tuition_fee}</td>

                  <td>₹ {row.transport_fee}</td>

                  <td>₹ {row.amount}</td>

                  <td>{row.lastdate}</td>

                  <td>{row.period}</td>

                  <td>
                    <span
                      className={
                        row.status == 1 ? "status-paid" : "status-pending"
                      }
                    >
                      {row.status == 1 ? "Paid" : "Pending"}
                    </span>
                  </td>

                  <td>{row.payment_mode}</td>

                  <td>₹ {row.late_fee_paid}</td>

                  <td>₹ {row.amount_paid}</td>

                  <td>{row.paidondate}</td>

                  <td>{row.session}</td>

                  <td>
                    <div className="action-buttons">
                      {row.status == 1 ? (
                        <button
                          className="receipt-btn"
                          onClick={() => handleReceipt(row.feeid)}
                        >
                          🧾
                        </button>
                      ) : (
                        <>
                          <button
                            className="accept-btn"
                            onClick={() =>
                              navigate(
                                `/dashboard/FeeComponent/AcceptPayment/${row.feeid}`,
                                {
                                  state: { refresh: Date.now() },
                                },
                              )
                            }
                          >
                            💰
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              navigate(
                                `/dashboard/FeeComponent/EditStudentFee/${row.feeid}`,
                              )
                            }
                          >
                            ✏️
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="20" className="no-data">
                  No Payments Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
