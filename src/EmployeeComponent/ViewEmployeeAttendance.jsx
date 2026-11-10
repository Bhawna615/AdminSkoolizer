
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./ViewEmployeeAttendance.css";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

export default function ViewEmployeeAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [filter, setFilter] = useState(false);
  const [showMsg, setShowMsg] = useState(true);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (location.state?.msg) {
      setShowMsg(true);

      const timer = setTimeout(() => {
        setShowMsg(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // FETCH ALL ATTENDANCE
  const fetchAttendance = () => {
    setLoading(true);

    axios
      .get(API + "getAttendance")
      .then((res) => {
        setAttendance(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setAttendance([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // FETCH FILTERED ATTENDANCE
  const fetchFiltered = () => {
    setLoading(true);

    axios
      .get(API + `filter/${year}/${month}`)
      .then((res) => {
        setAttendance(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setAttendance([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFilter = () => {
    if (filter && month !== "") {
      fetchFiltered();
    } else {
      fetchAttendance();
    }
  };

  useEffect(() => {
    handleFilter();
  }, [year, month, filter]);

  // ATTENDANCE TOTALS
  const totalPresent = attendance.reduce(
    (sum, row) => sum + (Number(row.Present) || 0),
    0
  );

  const totalLeave = attendance.reduce(
    (sum, row) => sum + (Number(row.onLeave) || 0),
    0
  );

  const totalStrength = attendance.reduce(
    (sum, row) => sum + (Number(row.Total) || 0),
    0
  );

  // ABSENT = TOTAL - PRESENT - ON LEAVE
  const totalAbsent = Math.max(
    0,
    totalStrength - totalPresent - totalLeave
  );

  // PERCENTAGES
  const presentPercentage = totalStrength
    ? ((totalPresent / totalStrength) * 100).toFixed(1)
    : 0;

  const absentPercentage = totalStrength
    ? ((totalAbsent / totalStrength) * 100).toFixed(1)
    : 0;

  const leavePercentage = totalStrength
    ? ((totalLeave / totalStrength) * 100).toFixed(1)
    : 0;

  // PIE CHART DATA
  const attendanceChartData = {
    labels: ["Present", "Absent", "On Leave"],
    datasets: [
      {
        data: [
          totalPresent,
          totalAbsent,
          totalLeave
        ],
        backgroundColor: [
          "#27ae8a",
          "#ef476f",
          "#f5a623"
        ],
        hoverBackgroundColor: [
          "#209b7b",
          "#dc365e",
          "#e49a1e"
        ],
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const attendanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        enabled: true,
        backgroundColor: "#302650",
        padding: 12,
        cornerRadius: 8,

        titleFont: {
          size: 12,
          weight: "bold",
        },

        bodyFont: {
          size: 11,
        },

        callbacks: {
          label: function (context) {
            const value = context.raw || 0;

            const percentage = totalStrength
              ? ((value / totalStrength) * 100).toFixed(1)
              : 0;

            return ` ${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="view-employee-attendance-page">

      {/* SUCCESS / ERROR MESSAGE */}

      {showMsg && location.state?.msg === "success" && (
        <div className="employee-attendance-alert success">
          <div className="attendance-alert-icon">
            <i className="bi bi-check-lg"></i>
          </div>

          <div className="attendance-alert-content">
            <strong>Attendance Marked</strong>
            <span>Employee attendance was marked successfully.</span>
          </div>

          <button
            onClick={() => setShowMsg(false)}
            className="attendance-alert-close"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {showMsg && location.state?.msg === "error" && (
        <div className="employee-attendance-alert error">
          <div className="attendance-alert-icon">
            <i className="bi bi-exclamation-lg"></i>
          </div>

          <div className="attendance-alert-content">
            <strong>Attendance Failed</strong>
            <span>Failed to mark employee attendance.</span>
          </div>

          <button
            onClick={() => setShowMsg(false)}
            className="attendance-alert-close"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {showMsg && location.state?.msg === "already" && (
        <div className="employee-attendance-alert warning">
          <div className="attendance-alert-icon">
            <i className="bi bi-exclamation-triangle"></i>
          </div>

          <div className="attendance-alert-content">
            <strong>Already Marked</strong>
            <span>Attendance has already been taken for today.</span>
          </div>

          <button
            onClick={() => setShowMsg(false)}
            className="attendance-alert-close"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {/* PAGE HEADER */}

      <div className="view-attendance-header">

        <div className="view-attendance-header-left">

          <div className="view-attendance-header-icon">
            <i className="bi bi-calendar2-week-fill"></i>
          </div>

          <div>
            <h2>Employee Attendance</h2>
            <p>
              View and manage daily employee attendance records
            </p>
          </div>

        </div>

        <div className="view-attendance-date">
          <i className="bi bi-calendar3"></i>

          <div>
            <span>Today</span>
            <strong>
              {new Date().toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
        </div>

      </div>

      {/* SUMMARY */}

      <div className="view-attendance-summary">

        <div className="view-attendance-summary-card">
          <div className="view-attendance-summary-icon records">
            <i className="bi bi-calendar-check"></i>
          </div>

          <div>
            <span>Attendance Records</span>
            <strong>{attendance.length}</strong>
          </div>
        </div>

        <div className="view-attendance-summary-card">
          <div className="view-attendance-summary-icon present">
            <i className="bi bi-person-check-fill"></i>
          </div>

          <div>
            <span>Present</span>
            <strong>{totalPresent}</strong>
          </div>
        </div>

        <div className="view-attendance-summary-card">
          <div className="view-attendance-summary-icon leave">
            <i className="bi bi-person-x-fill"></i>
          </div>

          <div>
            <span>On Leave</span>
            <strong>{totalLeave}</strong>
          </div>
        </div>

        <div className="view-attendance-summary-card">
          <div className="view-attendance-summary-icon strength">
            <i className="bi bi-people-fill"></i>
          </div>

          <div>
            <span>Total Strength</span>
            <strong>{totalStrength}</strong>
          </div>
        </div>

      </div>

      {/* ATTENDANCE PIE CHART */}

      <div className="view-attendance-chart-card">

        <div className="view-attendance-chart-header">

          <div className="view-attendance-card-title">

            <div className="view-attendance-chart-title-icon">
              <i className="bi bi-pie-chart-fill"></i>
            </div>

            <div>
              <h3>Attendance Overview</h3>
              <p>
                Present, absent and leave distribution
              </p>
            </div>

          </div>

          <div className="view-attendance-chart-badge">
            <span></span>
            {filter && month !== ""
              ? `${months[Number(month) - 1]} ${year}`
              : "All Records"}
          </div>

        </div>

        {loading ? (

          <div className="view-attendance-chart-loader">
            <div className="attendance-loader-spinner"></div>
            <span>Loading attendance statistics...</span>
          </div>

        ) : attendance.length === 0 ? (

          <div className="view-attendance-chart-empty">
            <i className="bi bi-pie-chart"></i>
            <span>No attendance data available for this period.</span>
          </div>

        ) : (

          <div className="view-attendance-chart-content">

            {/* PIE CHART */}

            <div className="view-attendance-pie-wrapper">

              <Pie
                data={attendanceChartData}
                options={attendanceChartOptions}
              />

            </div>

            {/* CHART DETAILS */}

            <div className="view-attendance-chart-details">

              <div className="view-attendance-chart-description">
                <span>Attendance Distribution</span>
                <strong>Recorded Attendance Statistics</strong>
              </div>

              {/* PRESENT */}

              <div className="view-attendance-chart-stat">

                <div className="view-attendance-chart-stat-left">

                  <span className="view-attendance-chart-dot present-dot"></span>

                  <div>
                    <strong>Present</strong>
                    <small>{presentPercentage}% of total strength</small>
                  </div>

                </div>

                <div className="view-attendance-chart-stat-value">
                  {totalPresent}
                </div>

              </div>

              {/* ABSENT */}

              <div className="view-attendance-chart-stat">

                <div className="view-attendance-chart-stat-left">

                  <span className="view-attendance-chart-dot absent-dot"></span>

                  <div>
                    <strong>Absent</strong>
                    <small>{absentPercentage}% of total strength</small>
                  </div>

                </div>

                <div className="view-attendance-chart-stat-value">
                  {totalAbsent}
                </div>

              </div>

              {/* ON LEAVE */}

              <div className="view-attendance-chart-stat">

                <div className="view-attendance-chart-stat-left">

                  <span className="view-attendance-chart-dot leave-dot"></span>

                  <div>
                    <strong>On Leave</strong>
                    <small>{leavePercentage}% of total strength</small>
                  </div>

                </div>

                <div className="view-attendance-chart-stat-value">
                  {totalLeave}
                </div>

              </div>

              {/* TOTAL */}

              <div className="view-attendance-chart-total">
                <span>Total Attendance Strength</span>
                <strong>{totalStrength}</strong>
              </div>

              <div className="view-attendance-chart-note">
                <i className="bi bi-info-circle"></i>
                <span>
                  The chart updates automatically according to the selected
                  attendance filter.
                </span>
              </div>

            </div>

          </div>

        )}

      </div>

      {/* MAIN TABLE CARD */}

      <div className="view-attendance-card">

        {/* CARD HEADER */}

        <div className="view-attendance-card-header">

          <div className="view-attendance-card-title">

            <div className="view-attendance-title-icon">
              <i className="bi bi-list-check"></i>
            </div>

            <div>
              <h3>Attendance Records</h3>
              <p>
                Daily employee attendance summary
              </p>
            </div>

          </div>

          {/* FILTER TOGGLE */}

          <div className="attendance-filter-control">

            <div className="attendance-filter-label">
              <i className="bi bi-funnel-fill"></i>

              <div>
                <strong>Enable Filter</strong>
                <span>
                  {filter ? "Filter is enabled" : "Showing all records"}
                </span>
              </div>
            </div>

            <label className="attendance-toggle">

              <input
                type="checkbox"
                checked={filter}
                onChange={(e) => setFilter(e.target.checked)}
              />

              <span className="attendance-toggle-slider"></span>

            </label>

          </div>

        </div>

        {/* FILTER PANEL */}

        <div
          className={`attendance-filter-panel ${
            filter ? "filter-active" : ""
          }`}
        >

          <div className="attendance-filter-heading">
            <div className="attendance-filter-heading-icon">
              <i className="bi bi-funnel"></i>
            </div>

            <div>
              <strong>Filter Attendance</strong>
              <span>Select year and month to view specific records</span>
            </div>
          </div>

          <div className="attendance-filter-fields">

            {/* YEAR */}

            <div className="attendance-filter-field">

              <label>
                <i className="bi bi-calendar3"></i>
                Year
              </label>

              <div className="attendance-select-wrapper">

                <i className="bi bi-calendar-event"></i>

                <select
                  value={year}
                  disabled={!filter}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value={new Date().getFullYear()}>
                    {new Date().getFullYear()}
                  </option>

                  <option value={new Date().getFullYear() - 1}>
                    {new Date().getFullYear() - 1}
                  </option>

                  <option value={new Date().getFullYear() - 2}>
                    {new Date().getFullYear() - 2}
                  </option>
                </select>

                <i className="bi bi-chevron-down attendance-select-arrow"></i>

              </div>

            </div>

            {/* MONTH */}

            <div className="attendance-filter-field">

              <label>
                <i className="bi bi-calendar-month"></i>
                Month
              </label>

              <div className="attendance-select-wrapper">

                <i className="bi bi-calendar3"></i>

                <select
                  value={month}
                  disabled={!filter}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Select Month</option>

                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>

                <i className="bi bi-chevron-down attendance-select-arrow"></i>

              </div>

            </div>

            {/* FILTER STATUS */}

            <div className="attendance-filter-status">

              <div className="attendance-filter-status-icon">
                <i className="bi bi-info-circle"></i>
              </div>

              <div>
                <strong>
                  {filter ? "Filter Enabled" : "Filter Disabled"}
                </strong>

                <span>
                  {filter
                    ? month
                      ? `Showing ${months[Number(month) - 1]} ${year}`
                      : "Select a month"
                    : "All attendance records are displayed"}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="view-attendance-table-wrapper">

          {loading ? (
            <div className="view-attendance-loader">

              <div className="attendance-loader-spinner"></div>

              <strong>Loading attendance...</strong>

              <span>
                Please wait while attendance records are loaded.
              </span>

            </div>
          ) : attendance.length === 0 ? (
            <div className="view-attendance-empty">

              <div className="attendance-empty-icon">
                <i className="bi bi-calendar-x"></i>
              </div>

              <strong>No Attendance Records</strong>

              <span>
                No attendance records were found for the selected period.
              </span>

            </div>
          ) : (
            <table className="view-attendance-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>On Leave</th>
                  <th>Present</th>
                  <th>Strength</th>
                  <th className="attendance-action-heading">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>

                {attendance.map((row, i) => (
                  <tr key={i}>

                    {/* DATE */}

                    <td>
                      <div className="attendance-date-cell">

                        <div className="attendance-date-icon">
                          <i className="bi bi-calendar-event"></i>
                        </div>

                        <div>
                          <strong>{row.Date}</strong>
                          <span>Attendance Date</span>
                        </div>

                      </div>
                    </td>

                    {/* LEAVE */}

                    <td>
                      <span className="attendance-count leave-count">
                        <i className="bi bi-person-x"></i>
                        {row.onLeave}
                      </span>
                    </td>

                    {/* PRESENT */}

                    <td>
                      <span className="attendance-count present-count">
                        <i className="bi bi-person-check"></i>
                        {row.Present}
                      </span>
                    </td>

                    {/* TOTAL */}

                    <td>
                      <span className="attendance-strength">
                        <i className="bi bi-people"></i>
                        {row.Total}
                      </span>
                    </td>

                    {/* ACTION */}

                    <td className="attendance-action-cell">

                      <button
                        className="attendance-view-btn"
                        onClick={() =>
                          (window.location.href = `/dashboard/EmployeeComponent/EmployeeAttendanceDetails/${row.Date}`)
                        }
                      >
                        <i className="bi bi-eye-fill"></i>
                        <span>View Details</span>
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}
