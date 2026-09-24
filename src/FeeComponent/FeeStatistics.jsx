import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
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
    datasets: [],
  });

  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [date, setDate] = useState("");

  // LOAD PERIODS
  useEffect(() => {
    axios
      .get(API + "getPeriods")
      .then((res) => {
        setPeriods(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // LOAD LAST 7 DAYS CHART
  useEffect(() => {
    axios
      .get(API + "getStatistics")
      .then((res) => {
        const labels = Object.keys(res.data || {});
        const values = Object.values(res.data || {});

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Fee Collection",
              data: values,
              backgroundColor: [
                "#6c4ce8",
                "#8065e8",
                "#927be9",
                "#a38feb",
                "#7355d8",
                "#5b3ed0",
                "#b09bed",
              ],
              borderRadius: 6,
              borderSkipped: false,
              barThickness: 34,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // PERIOD GO BUTTON
  const handlePeriodGo = () => {
    if (!selectedPeriod) {
      alert("Please Select Period");
      return;
    }

    navigate(
      `/dashboard/FeeComponent/DisplayStatistics/${selectedPeriod}`
    );
  };

  // DATE GO BUTTON
  const handleDateGo = () => {
    if (!date) {
      alert("Please Select Date");
      return;
    }

    navigate(`/FeeComponent/ViewPaidPaymentsByDate/${date}`);
  };

  return (
    <div className="kk-fee-statistics-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="kk-fee-statistics-header">

        <div className="kk-fee-statistics-header-content">

          <div className="kk-fee-statistics-title-icon">
            <i class="bi bi-bar-chart-line"></i>
          </div>

          <div>
            <h1>Fee Statistics</h1>

            <p>
              Monitor fee collections and view payment statistics
            </p>
          </div>

        </div>

      </div>


      {/* =====================================================
          FILTER SECTION
      ===================================================== */}

      <div className="kk-fee-statistics-filter-grid">

        {/* PERIOD FILTER */}

        <div className="kk-fee-statistics-filter-card">

          <div className="kk-fee-statistics-filter-icon">
            📅
          </div>

          <div className="kk-fee-statistics-filter-content">

            <div className="kk-fee-statistics-filter-title">
              <h3>Payment Period</h3>

              <span>
                Period
              </span>
            </div>

            <p>
              Select an academic payment period to view detailed
              statistics.
            </p>

            <div className="kk-fee-statistics-control-row">

              <select
                className="kk-fee-statistics-select"
                value={selectedPeriod}
                onChange={(e) =>
                  setSelectedPeriod(e.target.value)
                }
              >
                <option value="">
                  Select Period
                </option>

                {periods.map((p, index) => (
                  <option
                    key={index}
                    value={p.period}
                  >
                    {p.period}
                  </option>
                ))}
              </select>

              <button
                className="kk-fee-statistics-go-btn"
                onClick={handlePeriodGo}
              >
                Go
                <span>→</span>
              </button>

            </div>

          </div>

        </div>


        {/* DATE FILTER */}

        <div className="kk-fee-statistics-filter-card">

          <div className="kk-fee-statistics-filter-icon kk-fee-statistics-date-icon">
            🗓️
          </div>

          <div className="kk-fee-statistics-filter-content">

            <div className="kk-fee-statistics-filter-title">
              <h3>Payment Date</h3>

              <span>
                Date
              </span>
            </div>

            <p>
              Select a specific date to view paid payment records.
            </p>

            <div className="kk-fee-statistics-control-row">

              <input
                type="date"
                className="kk-fee-statistics-date-input"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

              <button
                className="kk-fee-statistics-go-btn"
                onClick={handleDateGo}
              >
                Go
                <span>→</span>
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          CHART CARD
      ===================================================== */}

      <div className="kk-fee-statistics-chart-card">

        <div className="kk-fee-statistics-chart-header">

          <div>

            <div className="kk-fee-statistics-chart-title-row">

              <div className="kk-fee-statistics-chart-icon">
                📈
              </div>

              <div>
                <h2>
                  Fee Collection
                </h2>

                <p>
                  Collection summary for the last 7 days
                </p>
              </div>

            </div>

          </div>

          <div className="kk-fee-statistics-chart-badge">
            Last 7 Days
          </div>

        </div>


        <div className="kk-fee-statistics-chart-wrapper">

          {chartData.datasets.length > 0 ? (

            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                  legend: {
                    display: false,
                  },

                  tooltip: {
                    backgroundColor: "#3f2c78",
                    titleColor: "#ffffff",
                    bodyColor: "#ffffff",
                    padding: 12,
                    cornerRadius: 8,

                    callbacks: {
                      label: function (context) {
                        return ` Fee Collection: ₹${context.raw}`;
                      },
                    },
                  },

                  title: {
                    display: false,
                  },
                },

                scales: {
                  x: {
                    grid: {
                      display: false,
                    },

                    ticks: {
                      color: "#8069b5",
                      font: {
                        size: 11,
                        weight: "500",
                      },
                    },
                  },

                  y: {
                    beginAtZero: true,

                    grid: {
                      color: "#eeeafb",
                    },

                    border: {
                      display: false,
                    },

                    ticks: {
                      color: "#8069b5",
                      font: {
                        size: 10,
                      },

                      callback: function (value) {
                        return "₹" + value;
                      },
                    },
                  },
                },
              }}
            />

          ) : (

            <div className="kk-fee-statistics-chart-empty">

              <div className="kk-fee-statistics-empty-icon">
                📊
              </div>

              <h3>
                No Statistics Available
              </h3>

              <p>
                Fee collection data will appear here once available.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}