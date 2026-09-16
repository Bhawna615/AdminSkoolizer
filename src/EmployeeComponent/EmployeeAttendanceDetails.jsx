import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EmployeeAttendanceDetails.css";

const API =
  "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

export default function EmployeeAttendanceDetails() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      axios.get(API + "getEmployees"),
      axios.get(API + "getAbsentees/" + date),
    ])
      .then(([employeesRes, absenteesRes]) => {
        setEmployees(employeesRes.data);
        setAbsentees(absenteesRes.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [date]);

  const checkMark = (id) => {
    const found = absentees.find((a) => a.empid === id);
    return found ? "Leave" : "Present";
  };

  const presentCount = employees.filter(
    (emp) => checkMark(emp.id) === "Present"
  ).length;

  const leaveCount = employees.filter(
    (emp) => checkMark(emp.id) === "Leave"
  ).length;

  return (
    <div className="employee-attendance-details-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="employee-details-header">

        <div className="employee-details-header-left">

          <div className="employee-details-header-icon">
            <i className="bi bi-calendar2-check-fill"></i>
          </div>

          <div>
            <h2>Attendance Details</h2>
            <p>
              View employee attendance for the selected date
            </p>
          </div>

        </div>

        <button
          className="employee-details-back-btn"
          onClick={() =>
            navigate("/dashboard/EmployeeComponent/ViewEmployeeAttendance")
          }
        >
          <i className="bi bi-arrow-left"></i>
          <span>Back to Attendance</span>
        </button>

      </div>

      {/* =====================================
          DATE CARD
      ====================================== */}

      <div className="employee-details-date-card">

        <div className="employee-details-date-icon">
          <i className="bi bi-calendar-event-fill"></i>
        </div>

        <div className="employee-details-date-content">
          <span>Attendance Date</span>
          <strong>{date}</strong>
        </div>

        <div className="employee-details-date-divider"></div>

        <div className="employee-details-date-info">
          <i className="bi bi-info-circle"></i>
          <span>Employee attendance summary</span>
        </div>

      </div>

      {/* =====================================
          SUMMARY CARDS
      ====================================== */}

      <div className="employee-details-summary">

        <div className="employee-details-summary-card">

          <div className="employee-details-summary-icon total">
            <i className="bi bi-people-fill"></i>
          </div>

          <div>
            <span>Total Employees</span>
            <strong>{employees.length}</strong>
          </div>

        </div>

        <div className="employee-details-summary-card">

          <div className="employee-details-summary-icon present">
            <i className="bi bi-person-check-fill"></i>
          </div>

          <div>
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>

        </div>

        <div className="employee-details-summary-card">

          <div className="employee-details-summary-icon leave">
            <i className="bi bi-person-x-fill"></i>
          </div>

          <div>
            <span>On Leave</span>
            <strong>{leaveCount}</strong>
          </div>

        </div>

      </div>

      {/* =====================================
          TABLE CARD
      ====================================== */}

      <div className="employee-details-table-card">

        <div className="employee-details-table-header">

          <div className="employee-details-table-title">

            <div className="employee-details-title-icon">
              <i className="bi bi-list-check"></i>
            </div>

            <div>
              <h3>Employee Attendance</h3>
              <p>
                Attendance status of all employees
              </p>
            </div>

          </div>

          <button
            className="employee-details-export-btn"
            onClick={() => exportCSV()}
            disabled={loading || employees.length === 0}
          >
            <i className="bi bi-file-earmark-spreadsheet-fill"></i>
            <span>Export CSV</span>
          </button>

        </div>

        {/* =====================================
            TABLE
        ====================================== */}

        <div className="employee-details-table-wrapper">

          {loading ? (
            <div className="employee-details-loader">

              <div className="employee-details-spinner"></div>

              <strong>Loading attendance...</strong>

              <span>
                Please wait while employee records are loaded.
              </span>

            </div>
          ) : employees.length === 0 ? (
            <div className="employee-details-empty">

              <div className="employee-details-empty-icon">
                <i className="bi bi-people"></i>
              </div>

              <strong>No Employees Found</strong>

              <span>
                No employee records are available.
              </span>

            </div>
          ) : (
            <table className="employee-details-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Employee Name</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {employees.map((emp) => {

                  const status = checkMark(emp.id);

                  return (
                    <tr key={emp.id}>

                      {/* ID */}

                      <td>
                        <span className="employee-id-badge">
                          #{emp.id}
                        </span>
                      </td>

                      {/* NAME */}

                      <td>

                        <div className="employee-details-name">

                          <div className="employee-details-avatar">
                            <i className="bi bi-person-fill"></i>
                          </div>

                          <div>
                            <strong>{emp.empname}</strong>
                            <span>Employee</span>
                          </div>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td>

                        {status === "Present" ? (
                          <span className="employee-status present">
                            <i className="bi bi-check-circle-fill"></i>
                            Present
                          </span>
                        ) : (
                          <span className="employee-status leave">
                            <i className="bi bi-x-circle-fill"></i>
                            Leave
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}


/* =====================================
   CSV EXPORT
===================================== */

function exportCSV() {

  let csv = [];

  let rows = document.querySelectorAll(
    ".employee-details-table tr"
  );

  rows.forEach((row) => {

    let cols = row.querySelectorAll("td, th");

    let data = [];

    cols.forEach((col) => {
      data.push(
        `"${col.innerText.replace(/"/g, '""')}"`
      );
    });

    csv.push(data.join(","));
  });

  let blob = new Blob(
    [csv.join("\n")],
    { type: "text/csv;charset=utf-8;" }
  );

  let link = document.createElement("a");

  link.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;

  link.href = window.URL.createObjectURL(blob);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(link.href);
}