import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import schoolLogo from "../images/school-logo.png";
import "./FeeReceipt.css";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminPanelFee/";

export default function FeeReceipt() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(API + "receipt", { params: { id } }).then((res) => {
      setData(res.data.data || []);
      setTimeout(() => {
          window.print();
        }, 500);
    });
  }, [id]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="receipt-container">
      {/* SCHOOL HEADER */}
      <div className="school-header">
        <img src={schoolLogo} alt="logo" className="logosch" />
        <div className="schoolss-details">
          <p className="school-name">KK BLOSSOMS SCHOOL</p>
          <p className="school-address">Rabaun, Solan (H.P)</p>
        </div>
      </div>

      <h3 className="title">RECEIPT</h3>

      {data.map((row) => (
        <div key={row.feeid}>
          {/* TOP DETAILS */}
          <div className="top-details">
            <div>
              <p>
                <b>Name:</b> {row.studentname}
              </p>
              <p>
                <b>Date:</b> {today}
              </p>
            </div>

            <div>
              <p>
                <b>Class:</b> {row.class}
              </p>
              <p>
                <b>No:</b> ______
              </p>
            </div>

            <div>
              <p>
                <b>Admission No:</b> {row.admission_number}
              </p>
            </div>
          </div>

          {/* TABLE */}
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Payment Id</th>
                <th>Period</th>
                <th>Amount</th>
                <th>Paid On</th>
                <th>Mode</th>
                <th>Transaction Id</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{row.feeid}</td>
                <td>{row.period}</td>
                <td>{row.amount_paid}</td>
                <td>
                  {new Date(row.paidondate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
                <td>{row.payment_mode}</td>
                <td>{row.razorpay_order_id}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}

      {/* SIGNATURE */}
      <div className="signature">
        <p>Signature and Seal</p>
        <p>__________________</p>
      </div>
    </div>
  );
}
