
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import "./ViewAttendance.css";

import {
    getAttendance,
    filterAttendance,
    getClasses,
    getDetails,
    editAttendance,
} from "../AttendanceComponent/attendanceApi";

import { useLocation, useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ViewAttendance() {

    const [attendance, setAttendance] = useState([]);
    const [classes, setClasses] = useState([]);

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(1);
    const [className, setClassName] = useState("");

    const [filterEnabled, setFilterEnabled] = useState(false);
    const [message, setMessage] = useState("");

    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // =====================================================
    // FLASH MESSAGE
    // =====================================================

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);

            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadAttendance();
        loadClasses();
    }, []);

    const loadAttendance = async () => {
        try {
            const res = await getAttendance();
            setAttendance(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Attendance loading error:", error);
            setAttendance([]);
            setMessage("Unable to load attendance records.");
        }
    };

    const loadClasses = async () => {
        try {
            const res = await getClasses();
            setClasses(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Class loading error:", error);
            setClasses([]);
        }
    };

    // =====================================================
    // FILTER ATTENDANCE
    // =====================================================

    useEffect(() => {

        if (!filterEnabled) {
            loadAttendance();
            return;
        }

        if (!className) {
            setAttendance([]);
            return;
        }

        filterAttendance(year, month, className)
            .then((res) => {
                setAttendance(
                    Array.isArray(res.data) ? res.data : []
                );
            })
            .catch((error) => {
                console.log("Filter error:", error);
                setAttendance([]);
                setMessage("Unable to filter attendance records.");
            });

    }, [year, month, className, filterEnabled]);

    // =====================================================
    // ATTENDANCE GRAPH DATA
    // =====================================================

    const attendanceSummary = useMemo(() => {

        return attendance.reduce(
            (total, row) => {

                total.present += Number(row.Present) || 0;
                total.absent += Number(row.Absent) || 0;
                total.leave += Number(row.onLeave) || 0;
                total.strength += Number(row.Strength) || 0;

                return total;
            },
            {
                present: 0,
                absent: 0,
                leave: 0,
                strength: 0,
            }
        );

    }, [attendance]);

    const totalMarkedAttendance =
        attendanceSummary.present +
        attendanceSummary.absent +
        attendanceSummary.leave;

    const getPercentage = (value) => {
        if (totalMarkedAttendance === 0) {
            return 0;
        }

        return Number(
            ((value / totalMarkedAttendance) * 100).toFixed(1)
        );
    };

    const presentPercentage = getPercentage(
        attendanceSummary.present
    );

    const absentPercentage = getPercentage(
        attendanceSummary.absent
    );

    const leavePercentage = getPercentage(
        attendanceSummary.leave
    );

    // =====================================================
    // DOUGHNUT CHART DATA
    // =====================================================

    const attendanceChartData = {
        labels: ["Present", "Absent", "On Leave"],

        datasets: [
            {
                data: [
                    attendanceSummary.present,
                    attendanceSummary.absent,
                    attendanceSummary.leave,
                ],

                backgroundColor: [
                    "#27AE8A",
                    "#EF476F",
                    "#F5A623",
                ],

                hoverBackgroundColor: [
                    "#209A79",
                    "#D93860",
                    "#DF9418",
                ],

                borderWidth: 0,
                spacing: 0,
                borderRadius: 0,
                hoverOffset: 8,
            },
        ],
    };

    // =====================================================
    // CHART OPTIONS - SMOOTH ANIMATION
    // =====================================================

    const attendanceChartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        cutout: "68%",

        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: "easeOutQuart",
        },

        plugins: {
            legend: {
                display: false,
            },

            tooltip: {
                enabled: true,

                backgroundColor: "#302747",
                titleColor: "#ffffff",
                bodyColor: "#ffffff",

                padding: 12,
                cornerRadius: 8,

                callbacks: {
                    label: (context) => {

                        const value = Number(context.raw || 0);

                        const percentage = getPercentage(value);

                        return ` ${context.label}: ${value.toLocaleString("en-IN")} (${percentage}%)`;
                    },
                },
            },
        },
    };

    // =====================================================
    // VIEW ATTENDANCE DETAILS
    // =====================================================

    const viewDetails = async (row) => {

        try {

            const res = await getDetails({
                class: row.Class,
                date: row.Date,
            });

            navigate(
                "/dashboard/AttendanceComponent/AttendanceDetails",
                {
                    state: {
                        students: res.data.students || [],
                        details: res.data.details || [],
                        className: row.Class,
                        date: row.Date,
                    },
                }
            );

        } catch (error) {
            console.log("Attendance details error:", error);
            setMessage("Unable to load attendance details.");
        }
    };

    // =====================================================
    // EDIT ATTENDANCE
    // =====================================================

    const remarkAttendance = (row) => {
        setSelectedAttendance(row);
        setShowEditConfirmation(true);
    };

    const confirmEditAttendance = async () => {

        if (!selectedAttendance) {
            return;
        }

        const row = selectedAttendance;

        setShowEditConfirmation(false);

        try {

            const res = await editAttendance({
                class: row.Class,
                date: row.Date,
            });

            navigate(
                "/dashboard/AttendanceComponent/EditAttendance",
                {
                    state: {
                        students: res.data.students || [],
                        absentees: res.data.absentees || [],
                        className: res.data.class,
                        date: res.data.date,
                    },
                }
            );

        } catch (error) {
            console.log("Edit attendance error:", error);
            setMessage("Unable to edit attendance.");
        }
    };

    // =====================================================
    // TABLE COLUMNS
    // =====================================================

    const columns = [

        {
            name: "Date",
            selector: (row) => row.Date,
            sortable: true,
            grow: 1,
        },

        {
            name: "Class",
            selector: (row) => row.Class,
            sortable: true,
            grow: 1,
        },

        {
            name: "Absent",
            selector: (row) => row.Absent,
            center: true,
            grow: 0.8,
        },

        {
            name: "On Leave",
            selector: (row) => row.onLeave,
            center: true,
            grow: 0.9,
        },

        {
            name: "Present",
            selector: (row) => row.Present,
            center: true,
            grow: 0.8,
        },

        {
            name: "Strength",
            selector: (row) => row.Strength,
            center: true,
            grow: 0.8,
        },

        {
            name: "Actions",
            center: true,
            grow: 1.2,

            cell: (row) => (
                <div className="view-attendance-action-wrapper">

                    <button
                        type="button"
                        className="view-attendance-action-btn view-attendance-view-btn"
                        onClick={() => viewDetails(row)}
                        title="View Attendance Details"
                        aria-label="View Attendance Details"
                    >
                        <i className="bi bi-eye-fill"></i>
                    </button>

                    <button
                        type="button"
                        className="view-attendance-action-btn view-attendance-view-btn"
                        onClick={() => remarkAttendance(row)}
                        title="Edit Attendance"
                        aria-label="Edit Attendance"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>

                </div>
            ),
        },
    ];

    // =====================================================
    // CUSTOM TABLE STYLES
    // =====================================================

    const customTableStyles = {

        table: {
            style: {
                backgroundColor: "#ffffff",
                borderRadius: "14px",
            },
        },

        tableWrapper: {
            style: {
                display: "block",
                borderRadius: "14px",
            },
        },

        header: {
            style: {
                minHeight: "0px",
                padding: "0px",
            },
        },

        headRow: {
            style: {
                minHeight: "56px",
                backgroundColor: "#f3eef9",
                borderBottom: "1px solid #ded3eb",
            },
        },

        headCells: {
            style: {
                color: "#57368a",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.45px",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },

        cells: {
            style: {
                color: "#4b4058",
                fontSize: "14px",
                fontWeight: "500",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },

        rows: {
            style: {
                minHeight: "58px",
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #eeeaf3",
                transition: "all 0.2s ease",
            },

            highlightOnHoverStyle: {
                backgroundColor: "#faf8fd",
                borderBottomColor: "#e2d7ef",
                boxShadow: "inset 3px 0 0 #6f42c1",
                cursor: "default",
            },
        },

        pagination: {
            style: {
                minHeight: "58px",
                padding: "8px 16px",
                backgroundColor: "#ffffff",
                borderTop: "1px solid #eee8f4",
                color: "#574c63",
                fontSize: "13px",
            },

            pageButtonsStyle: {
                borderRadius: "7px",
                height: "34px",
                width: "34px",
                padding: "0",
                margin: "0 2px",
                cursor: "pointer",
                transition: "all 0.2s ease",
            },
        },

        noData: {
            style: {
                minHeight: "160px",
                color: "#766b82",
                fontSize: "14px",
                backgroundColor: "#ffffff",
            },
        },
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="view-attendance-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="view-attendance-page-header">

                <div className="view-attendance-header-left">

                    <div className="view-attendance-header-icon">
                        <i className="bi bi-calendar-check-fill"></i>
                    </div>

                    <div className="view-attendance-header-content">
                        <h2>View Attendance</h2>

                        <p>
                            View, filter and manage student attendance records
                        </p>
                    </div>

                </div>

                <div className="view-attendance-header-badge">
                    <i className="bi bi-clipboard-check-fill"></i>
                    Attendance Records
                </div>

            </div>

            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (
                <div className="view-attendance-message">

                    <i className="bi bi-info-circle-fill"></i>

                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={() => setMessage("")}
                        aria-label="Close message"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>

                </div>
            )}

            {/* =================================================
                FILTER CARD
            ================================================= */}

            <div className="view-attendance-filter-card">

                <div className="view-attendance-filter-header">

                    <div className="view-attendance-filter-title">

                        <div className="view-attendance-filter-title-icon">
                            <i className="bi bi-funnel-fill"></i>
                        </div>

                        <div>
                            <h3>Attendance Filter</h3>

                            <p>
                                Filter attendance records by year, month and class
                            </p>
                        </div>

                    </div>

                    <label className="view-attendance-filter-toggle">

                        <input
                            type="checkbox"
                            checked={filterEnabled}
                            onChange={() => {
                                setFilterEnabled((prev) => !prev);
                            }}
                        />

                        <span className="view-attendance-toggle-slider"></span>

                        <span className="view-attendance-toggle-label">
                            Enable Filter
                        </span>

                    </label>

                </div>

                <div className="view-attendance-filter-fields">

                    {/* YEAR */}

                    <div className="view-attendance-filter-field">

                        <label>
                            <i className="bi bi-calendar3"></i>
                            Year
                        </label>

                        <div className="view-attendance-select-wrapper">

                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                disabled={!filterEnabled}
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

                            <i className="bi bi-chevron-down view-attendance-select-arrow"></i>

                        </div>

                    </div>

                    {/* MONTH */}

                    <div className="view-attendance-filter-field">

                        <label>
                            <i className="bi bi-calendar-month"></i>
                            Month
                        </label>

                        <div className="view-attendance-select-wrapper">

                            <select
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                disabled={!filterEnabled}
                            >

                                {[...Array(12)].map((_, index) => (
                                    <option
                                        key={index}
                                        value={index + 1}
                                    >
                                        {index + 1}
                                    </option>
                                ))}

                            </select>

                            <i className="bi bi-chevron-down view-attendance-select-arrow"></i>

                        </div>

                    </div>

                    {/* CLASS */}

                    <div className="view-attendance-filter-field view-attendance-class-field">

                        <label>
                            <i className="bi bi-mortarboard-fill"></i>
                            Class
                        </label>

                        <div className="view-attendance-select-wrapper">

                            <select
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                disabled={!filterEnabled}
                            >

                                <option value="">
                                    Select Class
                                </option>

                                {classes.map((c, index) => (
                                    <option
                                        key={index}
                                        value={c.Classname}
                                    >
                                        {c.Classname}
                                    </option>
                                ))}

                            </select>

                            <i className="bi bi-chevron-down view-attendance-select-arrow"></i>

                        </div>

                    </div>

                </div>

                {!filterEnabled && (
                    <div className="view-attendance-filter-disabled">

                        <i className="bi bi-info-circle-fill"></i>

                        <span>
                            Enable the filter to search attendance records
                            by year, month and class.
                        </span>

                    </div>
                )}

            </div>

            {/* =================================================
                ATTENDANCE OVERVIEW GRAPH
            ================================================= */}

            <div className="view-attendance-overview-card">

                <div className="view-attendance-overview-header">

                    <div className="view-attendance-overview-title">

                        <div className="view-attendance-overview-icon">
                            <i className="bi bi-pie-chart-fill"></i>
                        </div>

                        <div>
                            <h3>Attendance Overview</h3>

                            <p>
                                Present, absent and leave distribution
                            </p>
                        </div>

                    </div>

                    <div className="view-attendance-overview-badge">
                        <span></span>
                        Live Statistics
                    </div>

                </div>

                <div className="view-attendance-overview-divider"></div>

                {totalMarkedAttendance > 0 ? (

                    <div className="view-attendance-overview-content">

                        {/* DOUGHNUT CHART */}

                        <div className="view-attendance-donut-wrapper">

                            <div className="view-attendance-donut-chart">

                                <Doughnut
                                    key={`${attendanceSummary.present}-${attendanceSummary.absent}-${attendanceSummary.leave}`}
                                    data={attendanceChartData}
                                    options={attendanceChartOptions}
                                />

                                <div className="view-attendance-donut-center">

                                    <strong>
                                        {totalMarkedAttendance.toLocaleString("en-IN")}
                                    </strong>

                                    <span>
                                        Total Marked
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* ATTENDANCE LEGEND */}

                        <div className="view-attendance-overview-details">

                            <div className="view-attendance-overview-detail-heading">
                                <h4>Attendance Breakdown</h4>

                                <p>
                                    Student attendance distribution
                                </p>
                            </div>

                            {/* PRESENT */}

                            <div className="view-attendance-overview-stat present">

                                <div className="view-attendance-overview-stat-left">

                                    <span className="view-attendance-stat-dot"></span>

                                    <div>
                                        <strong>Present</strong>
                                        <small>Students present</small>
                                    </div>

                                </div>

                                <div className="view-attendance-overview-stat-right">

                                    <strong>
                                        {attendanceSummary.present.toLocaleString("en-IN")}
                                    </strong>

                                    <span>
                                        {presentPercentage}%
                                    </span>

                                </div>

                            </div>

                            {/* ABSENT */}

                            <div className="view-attendance-overview-stat absent">

                                <div className="view-attendance-overview-stat-left">

                                    <span className="view-attendance-stat-dot"></span>

                                    <div>
                                        <strong>Absent</strong>
                                        <small>Students absent</small>
                                    </div>

                                </div>

                                <div className="view-attendance-overview-stat-right">

                                    <strong>
                                        {attendanceSummary.absent.toLocaleString("en-IN")}
                                    </strong>

                                    <span>
                                        {absentPercentage}%
                                    </span>

                                </div>

                            </div>

                            {/* ON LEAVE */}

                            <div className="view-attendance-overview-stat leave">

                                <div className="view-attendance-overview-stat-left">

                                    <span className="view-attendance-stat-dot"></span>

                                    <div>
                                        <strong>On Leave</strong>
                                        <small>Students on leave</small>
                                    </div>

                                </div>

                                <div className="view-attendance-overview-stat-right">

                                    <strong>
                                        {attendanceSummary.leave.toLocaleString("en-IN")}
                                    </strong>

                                    <span>
                                        {leavePercentage}%
                                    </span>

                                </div>

                            </div>

                            {/* TOTAL STRENGTH */}

                            <div className="view-attendance-overview-strength">

                                <div>
                                    <i className="bi bi-people-fill"></i>
                                    Total Recorded Strength
                                </div>

                                <strong>
                                    {attendanceSummary.strength.toLocaleString("en-IN")}
                                </strong>

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="view-attendance-overview-empty">

                        <div className="view-attendance-overview-empty-icon">
                            <i className="bi bi-pie-chart"></i>
                        </div>

                        <h3>No Attendance Statistics</h3>

                        <p>
                            Attendance statistics will appear here when
                            attendance records are available.
                        </p>

                    </div>

                )}

            </div>

            {/* =================================================
                ATTENDANCE TABLE
            ================================================= */}

            <div className="view-attendance-table-card">

                <div className="view-attendance-table-header">

                    <div className="view-attendance-table-title">

                        <div className="view-attendance-table-icon">
                            <i className="bi bi-table"></i>
                        </div>

                        <div>
                            <h3>Attendance Records</h3>

                            <p>
                                {attendance.length} attendance record
                                {attendance.length !== 1 ? "s" : ""} found
                            </p>
                        </div>

                    </div>

                    <div className="view-attendance-record-count">
                        <span>Records</span>
                        <strong>{attendance.length}</strong>
                    </div>

                </div>

                <div className="view-attendance-table-container">

                    <DataTable
                        columns={columns}
                        data={attendance}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                        persistTableHead
                        defaultSortFieldId={1}
                        customStyles={customTableStyles}

                        noDataComponent={

                            <div className="view-attendance-no-data">

                                <div className="view-attendance-no-data-icon">
                                    <i className="bi bi-calendar-x"></i>
                                </div>

                                <h3>No Attendance Records</h3>

                                <p>
                                    No attendance records are available for
                                    the selected filter.
                                </p>

                            </div>
                        }
                    />

                </div>

                {/* TABLE LEGEND */}

                <div className="view-attendance-table-footer">

                    <div className="view-attendance-legend">

                        <span className="view-attendance-legend-title">
                            Actions:
                        </span>

                        <span className="view-attendance-legend-item">

                            <span className="view-attendance-legend-icon view-attendance-legend-view">
                                <i className="bi bi-eye-fill"></i>
                            </span>

                            View Details

                        </span>

                        <span className="view-attendance-legend-item">

                            <span className="view-attendance-legend-icon view-attendance-legend-edit">
                                <i className="bi bi-pencil-square"></i>
                            </span>

                            Edit Attendance

                        </span>

                    </div>

                </div>

            </div>

            {/* =================================================
                EDIT ATTENDANCE CONFIRMATION
            ================================================= */}

            {showEditConfirmation && selectedAttendance && (

                <div
                    className="view-attendance-confirm-overlay"
                    onClick={() => setShowEditConfirmation(false)}
                >

                    <div
                        className="view-attendance-confirm-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="view-attendance-confirm-title"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="view-attendance-confirm-icon">
                            <i className="bi bi-pencil-square"></i>
                        </div>

                        <h3 id="view-attendance-confirm-title">
                            Edit Attendance
                        </h3>

                        <p>
                            Do you want to edit the attendance for{" "}
                            <strong>{selectedAttendance.Class}</strong> on{" "}
                            <strong>{selectedAttendance.Date}</strong>?
                            Already marked attendance will be removed.
                        </p>

                        <div className="view-attendance-confirm-actions">

                            <button
                                type="button"
                                className="view-attendance-confirm-cancel"
                                onClick={() => setShowEditConfirmation(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="view-attendance-confirm-proceed"
                                onClick={confirmEditAttendance}
                            >
                                <i className="bi bi-pencil-square"></i>
                                {" "}Continue
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}
