import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeAttendance.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

export default function EmployeeAttendance() {
  const [employees, setEmployees] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);

    axios
      .get(API + "getEmployees")
      .then((res) => {
        setEmployees(res.data);

        // Default all Present
        const defaultMarks = res.data.map((emp) => ({
          id: emp.id,
          mark: "Present",
        }));

        setMarks(defaultMarks);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (index, value) => {
    const updated = [...marks];
    updated[index].mark = value;
    setMarks(updated);
  };

  const submitAttendance = () => {
    setSubmitting(true);

    axios
      .post(API + "submitAttendance", marks)
      .then((res) => {
        if (res.data.status === "success") {
          navigate(
            "/dashboard/EmployeeComponent/ViewEmployeeAttendance",
            {
              state: { msg: "success" },
            }
          );
        } else if (res.data.status === "already") {
          navigate(
            "/dashboard/EmployeeComponent/ViewEmployeeAttendance",
            {
              state: { msg: "already" },
            }
          );
        } else {
          navigate(
            "/dashboard/EmployeeComponent/ViewEmployeeAttendance",
            {
              state: { msg: "error" },
            }
          );
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to submit attendance.");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const presentCount = marks.filter(
    (item) => item.mark === "Present"
  ).length;

  const leaveCount = marks.filter(
    (item) => item.mark === "Leave"
  ).length;

  return (
    <div className="employee-attendance-page">

      {/* PAGE HEADER */}
      <div className="employee-attendance-header">
        <div className="employee-attendance-header-left">

          <div className="employee-attendance-header-icon">
            <i className="bi bi-calendar-check-fill"></i>
          </div>

          <div>
            <h2>Employee Attendance</h2>
            <p>Mark today's attendance for all employees</p>
          </div>

        </div>

        <div className="employee-attendance-date">
          <i className="bi bi-calendar3"></i>
          <span>
            {new Date().toLocaleDateString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="employee-attendance-summary">

        <div className="attendance-summary-card">
          <div className="attendance-summary-icon total">
            <i className="bi bi-people-fill"></i>
          </div>

          <div className="attendance-summary-content">
            <span>Total Employees</span>
            <strong>{employees.length}</strong>
          </div>
        </div>

        <div className="attendance-summary-card">
          <div className="attendance-summary-icon present">
            <i className="bi bi-check-circle-fill"></i>
          </div>

          <div className="attendance-summary-content">
            <span>Present</span>
            <strong>{presentCount}</strong>
          </div>
        </div>

        <div className="attendance-summary-card">
          <div className="attendance-summary-icon leave">
            <i className="bi bi-calendar-x-fill"></i>
          </div>

          <div className="attendance-summary-content">
            <span>On Leave</span>
            <strong>{leaveCount}</strong>
          </div>
        </div>

      </div>

      {/* ATTENDANCE CARD */}
      <div className="employee-attendance-card">

        <div className="employee-attendance-card-header">

          <div className="employee-attendance-title">
            <div className="employee-attendance-title-icon">
              <i className="bi bi-person-check-fill"></i>
            </div>

            <div>
              <h3>Attendance List</h3>
              <p>Select the attendance status for each employee</p>
            </div>
          </div>

          <div className="employee-attendance-status">
            <span className="status-dot"></span>
            Today's Attendance
          </div>

        </div>

        {/* TABLE */}
        <div className="employee-attendance-table-wrapper">

          {loading ? (
            <div className="employee-attendance-loader">
              <div className="attendance-spinner"></div>
              <span>Loading employees...</span>
            </div>
          ) : employees.length === 0 ? (
            <div className="employee-attendance-empty">
              <div className="attendance-empty-icon">
                <i className="bi bi-people"></i>
              </div>

              <strong>No Employees Found</strong>

              <span>
                There are no employees available to mark attendance.
              </span>
            </div>
          ) : (
            <table className="employee-attendance-table">

              <thead>
                <tr>
                  <th className="attendance-id-column">ID</th>
                  <th>Employee</th>
                  <th className="attendance-status-column">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp.id}>

                    <td>
                      <span className="employee-attendance-id">
                        {emp.id}
                      </span>
                    </td>

                    <td>
                      <div className="attendance-employee-info">

                        <div className="attendance-employee-avatar">
                          <i className="bi bi-person-fill"></i>
                        </div>

                        <div className="attendance-employee-name">
                          <strong>{emp.empname}</strong>
                          <span>Employee</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="attendance-select-wrapper">

                        <i
                          className={
                            marks[index]?.mark === "Leave"
                              ? "bi bi-calendar-x-fill leave-icon"
                              : "bi bi-check-circle-fill present-icon"
                          }
                        ></i>

                        <select
                          value={
                            marks[index]?.mark || "Present"
                          }
                          className={
                            marks[index]?.mark === "Leave"
                              ? "attendance-select leave-select"
                              : "attendance-select present-select"
                          }
                          onChange={(e) =>
                            handleChange(
                              index,
                              e.target.value
                            )
                          }
                        >
                          <option value="Present">
                            Present
                          </option>

                          <option value="Leave">
                            Leave
                          </option>
                        </select>

                        <i className="bi bi-chevron-down select-arrow"></i>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </div>

        {/* FOOTER */}
        {!loading && employees.length > 0 && (
          <div className="employee-attendance-footer">

            <div className="attendance-footer-info">
              <i className="bi bi-info-circle"></i>

              <span>
                All employees are marked <strong>Present</strong> by
                default. Change the status where required.
              </span>
            </div>

            <button
              className="employee-attendance-submit"
              onClick={submitAttendance}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="attendance-button-spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle"></i>
                  Submit Attendance
                </>
              )}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}