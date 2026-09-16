import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "./ViewAttendance.css";

import {
    getAttendance,
    filterAttendance,
    getClasses,
    getDetails,
    editAttendance,
} from "../AttendanceComponent/attendanceApi";

import { useLocation, useNavigate } from "react-router-dom";

export default function ViewAttendance() {

    const [attendance, setAttendance] = useState([]);
    const [classes, setClasses] = useState([]);

    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(1);
    const [className, setClassName] = useState("");

    const [filterEnabled, setFilterEnabled] = useState(false);
    const [message, setMessage] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    // ================= FLASH MESSAGE =================
    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);

            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [location.state]);

    // ================= INITIAL LOAD =================
    useEffect(() => {
        loadAttendance();
        loadClasses();
    }, []);

    const loadAttendance = async () => {
        try {
            const res = await getAttendance();
            setAttendance(res.data || []);
        } catch (error) {
            console.log("Attendance loading error:", error);
            setAttendance([]);
        }
    };

    const loadClasses = async () => {
        try {
            const res = await getClasses();
            setClasses(res.data || []);
        } catch (error) {
            console.log("Class loading error:", error);
            setClasses([]);
        }
    };

    // ================= FILTER =================
    useEffect(() => {

        if (!filterEnabled) {
            loadAttendance();
            return;
        }

        if (!className) {
            return;
        }

        filterAttendance(year, month, className)
            .then((res) => {
                setAttendance(res.data || []);
            })
            .catch((error) => {
                console.log("Filter error:", error);
                setAttendance([]);
            });

    }, [year, month, className, filterEnabled]);

    // ================= VIEW DETAILS =================
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
            alert("Unable to load attendance details.");
        }
    };

    // ================= EDIT ATTENDANCE =================
    const remarkAttendance = async (row) => {

        const confirmEdit = window.confirm(
            "Already marked attendance will be removed. Continue?"
        );

        if (!confirmEdit) {
            return;
        }

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
            alert("Unable to edit attendance.");
        }
    };

    // ================= TABLE COLUMNS =================
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

    // ================= CUSTOM TABLE STYLES =================
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

    return (
        <div className="view-attendance-page">

            {/* ================= PAGE HEADER ================= */}
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

            {/* ================= SUCCESS MESSAGE ================= */}
            {message && (
                <div className="view-attendance-success-message">

                    <div className="view-attendance-success-icon">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <div className="view-attendance-success-text">
                        {message}
                    </div>

                    <button
                        type="button"
                        className="view-attendance-success-close"
                        onClick={() => setMessage("")}
                        aria-label="Close message"
                    >
                        <i className="bi bi-x"></i>
                    </button>

                </div>
            )}

            {/* ================= FILTER CARD ================= */}
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
                            onChange={() =>
                                setFilterEnabled(!filterEnabled)
                            }
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
                                onChange={(e) =>
                                    setYear(Number(e.target.value))
                                }
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
                                onChange={(e) =>
                                    setMonth(Number(e.target.value))
                                }
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
                                onChange={(e) =>
                                    setClassName(e.target.value)
                                }
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

            {/* ================= TABLE CARD ================= */}
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

                {/* ================= TABLE LEGEND ================= */}
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
                                <i className="bi bi-trash-fill"></i>
                            </span>
                            Edit Attendance
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}