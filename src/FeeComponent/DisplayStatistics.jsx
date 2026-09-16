import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

import { Pie } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import "./DisplayStatistics.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const API = "http://localhost/kkblossom/api.php/Adminapi/FeeStatistics/";

export default function DisplayStatistics() {
  const { period } = useParams();

  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(API + "displayStatistics/" + period)
      .then((res) => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [period]);

  const feeChartData = {
    labels: ["Total Paid Fee", "Total Pending Fee"],

    datasets: [
      {
        data: [summary.paidAmount || 0, summary.pendingAmount || 0],

        backgroundColor: ["#2C56BB", "#FFAE10"],
      },
    ],
  };

  const typeChartData = {
    labels: ["Tuition Fee", "Transport Fee", "Annual Fee", "Admission Fee"],

    datasets: [
      {
        data: [
          summary.totalTuitionFee || 0,
          summary.totalTransportFee || 0,
          summary.totalAnnualFee || 0,
          summary.totalAdmissionFee || 0,
        ],

        backgroundColor: ["#2C56BB", "#FFAE10", "#1F1F1F", "#059862"],
      },
    ],
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="statistics-view-container">
      <div className="chart-row">
        <div className="chart-box">
          <Pie data={feeChartData} />
        </div>

        <div className="chart-box">
          <Pie data={typeChartData} />
        </div>
      </div>

      <div className="cards-container">
        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Fee to be Collected : ₹ {summary.totalFeeAmount}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/paid/${period}`}
          className="stats-card"
        >
          Total Paid Fee : ₹ {summary.paidAmount}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/pending/${period}`}
          className="stats-card"
        >
          Total Pending Fee : ₹ {summary.pendingAmount}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Payments :{summary.totalFeeCount}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/paid/${period}`}
          className="stats-card"
        >
          Total Paid Payments :{summary.paidCount}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/pending/${period}`}
          className="stats-card"
        >
          Total Pending Payments :{summary.pendingCount}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Tuition Fee : ₹ {summary.totalTuitionFee}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Transport Fee : ₹ {summary.totalTransportFee}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Annual Fee : ₹ {summary.totalAnnualFee}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Admission Fee : ₹ {summary.totalAdmissionFee}
        </Link>

        <Link
          to={`/FeeComponent/PaymentTable/total/${period}`}
          className="stats-card"
        >
          Total Late Fee : ₹ {summary.totalLateFee}
        </Link>
      </div>
    </div>
  );
}
