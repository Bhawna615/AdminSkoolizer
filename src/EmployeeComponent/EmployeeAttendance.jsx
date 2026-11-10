
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeAttendance.css";
import { useNavigate } from "react-router-dom";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const API = "http://localhost/kkblossom/api.php/Adminapi/AdminEmployee/";

export default function EmployeeAttendance() {
    const [employees, setEmployees] = useState([]);
    const [marks, setMarks] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // MESSAGE BOX STATES
    const [showMsg, setShowMsg] = useState(false);
    const [message, setMessage] = useState("");
    const [messageSuccess, setMessageSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEmployees();
        fetchAttendance();
    }, []);

    // FETCH EMPLOYEES
    const fetchEmployees = () => {
        setLoading(true);

        axios
            .get(API + "getEmployees")
            .then((res) => {
                const employeeData = Array.isArray(res.data) ? res.data : [];

                setEmployees(employeeData);

                // Default all Present
                const defaultMarks = employeeData.map((emp) => ({
                    id: emp.id,
                    mark: "Present",
                }));

                setMarks(defaultMarks);
            })
            .catch((err) => {
                console.error(err);
                setEmployees([]);
                setMarks([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // FETCH ACTUAL ATTENDANCE RECORDS FROM DATABASE
    const fetchAttendance = () => {
        axios
            .get(API + "getAttendance")
            .then((res) => {
                const records = Array.isArray(res.data) ? res.data : [];

                setAttendanceRecords(records);
            })
            .catch((err) => {
                console.error("Attendance API Error:", err);
                setAttendanceRecords([]);
            });
    };

    // CHANGE ATTENDANCE STATUS
    const handleChange = (index, value) => {
        setMarks((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, mark: value } : item
            )
        );
    };

    // SUBMIT ATTENDANCE
    const submitAttendance = () => {
        if (submitting || marks.length === 0) return;

        setSubmitting(true);

        axios
            .post(API + "submitAttendance", marks)
            .then((res) => {
                if (res.data.status === "success") {
                    setMessageSuccess(true);
                    setMessage("Attendance Submitted Successfully");
                    setShowMsg(true);

                    // REFRESH HISTORICAL ATTENDANCE DATA
                    fetchAttendance();

                } else if (res.data.status === "already") {
                    setMessageSuccess(false);
                    setMessage("Attendance has already been submitted for today");
                    setShowMsg(true);

                } else {
                    setMessageSuccess(false);
                    setMessage("Failed to submit attendance");
                    setShowMsg(true);
                }
            })
            .catch((err) => {
                console.error(err);

                setMessageSuccess(false);
                setMessage("Failed to submit attendance");
                setShowMsg(true);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    // CONTINUE BUTTON
    const handleContinue = () => {
        setShowMsg(false);

        navigate("/dashboard/EmployeeComponent/ViewEmployeeAttendance");
    };

    // CURRENT FORM COUNTS
    const presentCount = marks.filter(
        (item) => item.mark === "Present"
    ).length;

    const leaveCount = marks.filter(
        (item) => item.mark === "Leave"
    ).length;

    // HISTORICAL ATTENDANCE COUNTS FROM getAttendance API
    const totalPresent = attendanceRecords.reduce(
        (sum, row) => sum + Number(row.Present || 0),
        0
    );

    const totalLeave = attendanceRecords.reduce(
        (sum, row) => sum + Number(row.onLeave || 0),
        0
    );

    const totalStrength = attendanceRecords.reduce(
        (sum, row) => sum + Number(row.Total || 0),
        0
    );

    const presentPercentage = totalStrength
        ? ((totalPresent / totalStrength) * 100).toFixed(1)
        : "0.0";

    const leavePercentage = totalStrength
        ? ((totalLeave / totalStrength) * 100).toFixed(1)
        : "0.0";

    // DOUGHNUT CHART DATA - DATABASE VALUES ONLY
    const attendanceChartData = {
        labels: ["Present", "On Leave"],
        datasets: [
            {
                data: [totalPresent, totalLeave],
                backgroundColor: [
                    "#27ae8a",
                    "#f5a623"
                ],
                hoverBackgroundColor: [
                    "#209b7b",
                    "#e49a1e"
                ],
                borderWidth: 0,
                spacing: 3,
                borderRadius: 5,
                hoverOffset: 7,
            },
        ],
    };

    const attendanceChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
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
                            : "0.0";

                        return ` ${context.label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="employee-attendance-page">

            {/* MESSAGE BOX */}
            {showMsg && (
                <div className="employee-attendance-message-overlay">

                    <div className="employee-attendance-message-box">

                        <div
                            className={`employee-attendance-message-icon ${
                                messageSuccess
                                    ? "employee-attendance-message-success"
                                    : "employee-attendance-message-error"
                            }`}
                        >
                            <i
                                className={
                                    messageSuccess
                                        ? "bi bi-check-lg"
                                        : "bi bi-x-lg"
                                }
                            ></i>
                        </div>

                        <div className="employee-attendance-message-content">
                            <strong>
                                {messageSuccess ? "Success" : "Error"}
                            </strong>

                            <span>{message}</span>
                        </div>

                        <button
                            type="button"
                            className={
                                messageSuccess
                                    ? "employee-attendance-message-continue"
                                    : "employee-attendance-message-close"
                            }
                            onClick={
                                messageSuccess
                                    ? handleContinue
                                    : () => setShowMsg(false)
                            }
                        >
                            {messageSuccess ? (
                                "Continue"
                            ) : (
                                <i className="bi bi-x"></i>
                            )}
                        </button>

                    </div>
                </div>
            )}

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

            {/* ATTENDANCE GRAPH */}
            <div className="employee-attendance-chart-card">

                <div className="employee-attendance-chart-header">

                    <div className="employee-attendance-title">

                        <div className="employee-attendance-chart-title-icon">
                            <i className="bi bi-pie-chart-fill"></i>
                        </div>

                        <div>
                            <h3>Attendance Overview</h3>
                            <p>Historical employee attendance distribution</p>
                        </div>

                    </div>

                    <div className="employee-attendance-chart-badge">
                        <span></span>
                        Database Summary
                    </div>

                </div>

                {loading ? (

                    <div className="employee-attendance-chart-loader">
                        <div className="attendance-spinner"></div>
                        <span>Preparing attendance graph...</span>
                    </div>

                ) : totalStrength === 0 ? (

                    <div className="employee-attendance-chart-empty">
                        <i className="bi bi-pie-chart"></i>
                        <span>No attendance data available</span>
                    </div>

                ) : (

                    <div className="employee-attendance-chart-content">

                        <div className="employee-attendance-doughnut-wrapper">

                            <Doughnut
                                data={attendanceChartData}
                                options={attendanceChartOptions}
                            />

                            <div className="employee-attendance-chart-center">
                                <strong>{totalStrength}</strong>
                                <span>Total Attendance</span>
                            </div>

                        </div>

                        <div className="employee-attendance-chart-details">

                            <div className="employee-attendance-chart-description">
                                <span>Historical Distribution</span>
                                <strong>Attendance Status</strong>
                            </div>

                            {/* PRESENT */}
                            <div className="employee-attendance-chart-stat">

                                <div className="employee-attendance-chart-stat-left">
                                    <span className="attendance-chart-dot present-dot"></span>

                                    <div>
                                        <strong>Present</strong>
                                        <small>{presentPercentage}% of total attendance</small>
                                    </div>
                                </div>

                                <div className="employee-attendance-chart-stat-value">
                                    {totalPresent}
                                </div>

                            </div>

                            {/* ON LEAVE */}
                            <div className="employee-attendance-chart-stat">

                                <div className="employee-attendance-chart-stat-left">
                                    <span className="attendance-chart-dot leave-dot"></span>

                                    <div>
                                        <strong>On Leave</strong>
                                        <small>{leavePercentage}% of total attendance</small>
                                    </div>
                                </div>

                                <div className="employee-attendance-chart-stat-value">
                                    {totalLeave}
                                </div>

                            </div>

                            <div className="employee-attendance-chart-note">
                                <i className="bi bi-info-circle"></i>
                                <span>
                                    Graph values are calculated from historical
                                    attendance records in the database.
                                </span>
                            </div>

                        </div>

                    </div>

                )}

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
                                                    value={marks[index]?.mark || "Present"}
                                                    className={`attendance-select ${
                                                        marks[index]?.mark === "Leave"
                                                            ? "leave-select"
                                                            : "present-select"
                                                    }`}
                                                    onChange={(e) =>
                                                        handleChange(index, e.target.value)
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
