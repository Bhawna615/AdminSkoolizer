import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import "./FeeStatistics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const API = "http://localhost/kkblossom/api.php/Adminapi/FeeStatistics/";

export default function FeeStatistics() {

  const navigate = useNavigate();

  const [periods, setPeriods] = useState([]);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [date, setDate] = useState("");

  // ✅ LOAD PERIODS
  useEffect(() => {

    axios.get(API + "getPeriods")
      .then(res => {
        setPeriods(res.data || []);
      })
      .catch(err => {
        console.log(err);
      });

  }, []);

  // ✅ LOAD LAST 7 DAYS CHART
  useEffect(() => {

    axios.get(API + "getStatistics")
      .then(res => {

        const labels = Object.keys(res.data || {});
        const values = Object.values(res.data || {});

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Fee Collection",
              data: values,
              backgroundColor: [
                "green",
                "blue",
                "orange",
                "#282A35",
                "#059862",
                "#2C56BB",
                "#FFAE10"
              ],
              borderRadius: 5
            }
          ]
        });

      })
      .catch(err => {
        console.log(err);
      });

  }, []);

  // ✅ PERIOD GO BUTTON
  const handlePeriodGo = () => {

    if (!selectedPeriod) {
      alert("Please Select Period");
      return;
    }

    navigate(`/dashboard/FeeComponent/DisplayStatistics/${selectedPeriod}`);
  };

  // ✅ DATE GO BUTTON
  const handleDateGo = () => {

    if (!date) {
      alert("Please Select Date");
      return;
    }

    navigate(`/FeeComponent/ViewPaidPaymentsByDate/${date}`);
  };

  return (
    <div className="statistics-container">

      {/* PERIOD FILTER */}
      <div className="filter-bar">

        <div className="filter-card">

          <p className="heading">Period</p>

          <select
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >

            <option value="">Select Period</option>

            {periods.map((p, index) => (
              <option key={index} value={p.period}>
                {p.period}
              </option>
            ))}

          </select>

          <button
            className="form-submit"
            onClick={handlePeriodGo}
          >
            Go
          </button>

        </div>

      </div>

      {/* DATE FILTER */}
      <div className="filter-bar">

        <div className="filter-card">

          <p className="heading">Date</p>

          <input
            type="date"
            className="form-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button
            className="form-submit"
            onClick={handleDateGo}
          >
            Go
          </button>

        </div>

      </div>

      {/* BAR CHART */}
      <div className="chart-card">

        {chartData.datasets.length > 0 && (

          <Bar
            data={chartData}
            options={{
              responsive: true,

              plugins: {
                legend: {
                  display: false
                },

                title: {
                  display: true,
                  text: "Last 7 days Fee Collection"
                }
              },

              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />

        )}

      </div>

    </div>
  );
}