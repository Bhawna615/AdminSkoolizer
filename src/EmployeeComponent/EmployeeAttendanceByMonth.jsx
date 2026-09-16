
import React, { useState } from "react";
import "./EmployeeAttendanceByMonth.css";
import { useNavigate } from "react-router-dom";

export default function EmployeeAttendanceByMonth() {
  const [month, setMonth] = useState("");
  const navigate = useNavigate();

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

  return (
    <div className="employee-month-attendance-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="employee-month-header">

        <div className="employee-month-header-left">

          <div className="employee-month-header-icon">
            <i className="bi bi-calendar-month-fill"></i>
          </div>

          <div>
            <h2>Monthly Attendance</h2>
            <p>
              Generate and view employee attendance for a selected month
            </p>
          </div>

        </div>

        <div className="employee-month-header-badge">
          <i className="bi bi-file-earmark-text-fill"></i>
          Monthly Report
        </div>

      </div>

      {/* =====================================
          MAIN CARD
      ====================================== */}

      <div className="employee-month-card">

        <div className="employee-month-card-header">

          <div className="employee-month-title-icon">
            <i className="bi bi-calendar3"></i>
          </div>

          <div>
            <h3>Select Attendance Month</h3>
            <p>
              Choose a month to generate the attendance report
            </p>
          </div>

        </div>

        {/* =====================================
            FORM
        ====================================== */}

        <div className="employee-month-form">

          <div className="employee-month-form-group">

            <label htmlFor="attendance-month">
              <i className="bi bi-calendar-event"></i>
              Attendance Month
            </label>

            <div className="employee-month-select-wrapper">

              <i className="bi bi-calendar-month employee-month-input-icon"></i>

              <select
                id="attendance-month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">
                  Select Month
                </option>

                {months.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>

              <i className="bi bi-chevron-down employee-month-select-arrow"></i>

            </div>

          </div>

          {/* =====================================
              SELECTED MONTH PREVIEW
          ====================================== */}

          <div
            className={`employee-month-preview ${
              month ? "active" : ""
            }`}
          >

            <div className="employee-month-preview-icon">
              <i
                className={
                  month
                    ? "bi bi-check-circle-fill"
                    : "bi bi-calendar3"
                }
              ></i>
            </div>

            <div className="employee-month-preview-content">

              <span>Selected Month</span>

              <strong>
                {month
                  ? months[Number(month) - 1]
                  : "No month selected"}
              </strong>

            </div>

          </div>

          {/* =====================================
              BUTTON
          ====================================== */}

          <button
            className="employee-month-view-btn"
            onClick={() => {

              if (!month) {
                alert("Please select month");
                return;
              }

              window.open(
                `/EmployeeComponent/MonthlyAttendancePrint/${month}`,
                "_blank"
              );

            }}
          >
            <i className="bi bi-eye-fill"></i>
            <span>View Attendance Report</span>
            <i className="bi bi-box-arrow-up-right employee-month-external-icon"></i>
          </button>

        </div>

        {/* =====================================
            INFO BOX
        ====================================== */}

        <div className="employee-month-info">

          <div className="employee-month-info-icon">
            <i className="bi bi-info-circle-fill"></i>
          </div>

          <div>
            <strong>Monthly Attendance Report</strong>
            <p>
              Select a month and click "View Attendance Report".
              The attendance report will open in a new tab for viewing
              and printing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
