import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AttendanceDetails.css";

export default function AttendanceDetails() {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Safe fallback so the page does not crash if state is missing
    const students = state?.students || [];
    const details = state?.details || [];
    const className = state?.className || "";
    const date = state?.date || "";

    // =========================================================
    // GET ATTENDANCE MARK
    // =========================================================
    const getMark = (roll) => {
        let mark = "Present";

        details.forEach((d) => {
            if (String(d.Rollno) === String(roll)) {
                mark = Number(d.onLeave) === 1 ? "On Leave" : "Absent";
            }
        });

        return mark;
    };

    // =========================================================
    // SUMMARY COUNTS
    // =========================================================
    const presentCount = students.filter(
        (student) => getMark(student.Rollno) === "Present"
    ).length;

    const absentCount = students.filter(
        (student) => getMark(student.Rollno) === "Absent"
    ).length;

    const leaveCount = students.filter(
        (student) => getMark(student.Rollno) === "On Leave"
    ).length;

    // =========================================================
    // CSV EXPORT
    // =========================================================
    const escapeCSV = (value) => {
        const stringValue = String(value ?? "");

        if (
            stringValue.includes(",") ||
            stringValue.includes('"') ||
            stringValue.includes("\n")
        ) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
    };

    const exportCSV = () => {
        let csv = "Rollno,Name,Mark\n";

        students.forEach((student) => {
            csv += `${escapeCSV(student.Rollno)},${escapeCSV(
                student.Name
            )},${escapeCSV(getMark(student.Rollno))}\n`;
        });

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance-${className || "class"}-${date || "date"}.csv`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(url);
    };

    // =========================================================
    // BACK
    // =========================================================
    const goBack = () => {
        navigate("/dashboard/AttendanceComponent/ViewAttendance");
    };

    // =========================================================
    // STATUS CLASS
    // =========================================================
    const getStatusClass = (mark) => {
        if (mark === "Present") {
            return "attendance-details-status-present";
        }

        if (mark === "Absent") {
            return "attendance-details-status-absent";
        }

        return "attendance-details-status-leave";
    };

    // =========================================================
    // STATUS ICON
    // =========================================================
    const getStatusIcon = (mark) => {
        if (mark === "Present") {
            return "bi bi-check-circle-fill";
        }

        if (mark === "Absent") {
            return "bi bi-x-circle-fill";
        }

        return "bi bi-calendar-minus-fill";
    };

    return (
        <div className="attendance-details-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}
            <div className="attendance-details-header">

                <div className="attendance-details-header-left">

                    <div className="attendance-details-header-icon">
                        <i className="bi bi-clipboard-check-fill"></i>
                    </div>

                    <div className="attendance-details-header-text">
                        <h2>Attendance Details</h2>
                        <p>
                            View detailed attendance record for the selected
                            class and date
                        </p>
                    </div>

                </div>

                <div className="attendance-details-header-actions">

                    <button
                        type="button"
                        className="attendance-details-back-btn"
                        onClick={goBack}
                    >
                        <i className="bi bi-arrow-left"></i>
                        <span>Back</span>
                    </button>

                    <button
                        type="button"
                        className="attendance-details-export-btn"
                        onClick={exportCSV}
                    >
                        <i className="bi bi-file-earmark-spreadsheet-fill"></i>
                        <span>Export CSV</span>
                    </button>

                </div>

            </div>

            {/* =================================================
                CLASS / DATE INFO
            ================================================= */}
            <div className="attendance-details-info-card">

                <div className="attendance-details-info-item">

                    <div className="attendance-details-info-icon">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div className="attendance-details-info-content">
                        <span>Class</span>
                        <strong>
                            {className ? `Class ${className}` : "—"}
                        </strong>
                    </div>

                </div>

                <div className="attendance-details-info-divider"></div>

                <div className="attendance-details-info-item">

                    <div className="attendance-details-info-icon">
                        <i className="bi bi-calendar3"></i>
                    </div>

                    <div className="attendance-details-info-content">
                        <span>Attendance Date</span>
                        <strong>{date || "—"}</strong>
                    </div>

                </div>

                <div className="attendance-details-info-divider"></div>

                <div className="attendance-details-info-item">

                    <div className="attendance-details-info-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div className="attendance-details-info-content">
                        <span>Total Students</span>
                        <strong>{students.length}</strong>
                    </div>

                </div>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}
            <div className="attendance-details-summary">

                {/* Total */}
                <div className="attendance-details-summary-card">

                    <div className="attendance-details-summary-icon total">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div className="attendance-details-summary-content">
                        <span>Total Students</span>
                        <strong>{students.length}</strong>
                    </div>

                </div>

                {/* Present */}
                <div className="attendance-details-summary-card">

                    <div className="attendance-details-summary-icon present">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <div className="attendance-details-summary-content">
                        <span>Present</span>
                        <strong>{presentCount}</strong>
                    </div>

                </div>

                {/* Absent */}
                <div className="attendance-details-summary-card">

                    <div className="attendance-details-summary-icon absent">
                        <i className="bi bi-x-circle-fill"></i>
                    </div>

                    <div className="attendance-details-summary-content">
                        <span>Absent</span>
                        <strong>{absentCount}</strong>
                    </div>

                </div>

                {/* Leave */}
                <div className="attendance-details-summary-card">

                    <div className="attendance-details-summary-icon leave">
                        <i className="bi bi-calendar-minus-fill"></i>
                    </div>

                    <div className="attendance-details-summary-content">
                        <span>On Leave</span>
                        <strong>{leaveCount}</strong>
                    </div>

                </div>

            </div>

            {/* =================================================
                ATTENDANCE TABLE CARD
            ================================================= */}
            <div className="attendance-details-table-card">

                {/* Table Header */}
                <div className="attendance-details-table-header">

                    <div className="attendance-details-table-title">

                        <div className="attendance-details-table-title-icon">
                            <i className="bi bi-list-check"></i>
                        </div>

                        <div>
                            <h3>Student Attendance</h3>
                            <p>
                                Detailed attendance record of all students
                            </p>
                        </div>

                    </div>

                    <div className="attendance-details-status-guide">

                        <span>
                            <i className="bi bi-circle-fill present-dot"></i>
                            Present
                        </span>

                        <span>
                            <i className="bi bi-circle-fill absent-dot"></i>
                            Absent
                        </span>

                        <span>
                            <i className="bi bi-circle-fill leave-dot"></i>
                            On Leave
                        </span>

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}
                <div className="attendance-details-table-wrapper">

                    {students.length === 0 ? (

                        <div className="attendance-details-empty">

                            <div className="attendance-details-empty-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <h3>No Students Found</h3>

                            <p>
                                No student attendance records are available
                                for this class and date.
                            </p>

                            <button
                                type="button"
                                onClick={goBack}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back to Attendance
                            </button>

                        </div>

                    ) : (

                        <table className="attendance-details-table">

                            <thead>
                                <tr>
                                    <th className="attendance-details-number-column">
                                        #
                                    </th>

                                    <th>
                                        Roll No.
                                    </th>

                                    <th>
                                        Student Name
                                    </th>

                                    <th className="attendance-details-mark-column">
                                        Attendance
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {students.map((student, index) => {

                                    const mark = getMark(student.Rollno);

                                    return (
                                        <tr key={student.id || index}>

                                            {/* Number */}
                                            <td>
                                                <span className="attendance-details-row-number">
                                                    {index + 1}
                                                </span>
                                            </td>

                                            {/* Roll Number */}
                                            <td>
                                                <span className="attendance-details-roll-number">
                                                    {student.Rollno || "—"}
                                                </span>
                                            </td>

                                            {/* Student */}
                                            <td>

                                                <div className="attendance-details-student">

                                                    <div className="attendance-details-avatar">
                                                        {student.Name
                                                            ? student.Name
                                                                .charAt(0)
                                                                .toUpperCase()
                                                            : "S"}
                                                    </div>

                                                    <div className="attendance-details-student-info">

                                                        <strong>
                                                            {student.Name || "Unknown Student"}
                                                        </strong>

                                                        <span>
                                                            Student
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Attendance */}
                                            <td>

                                                <span
                                                    className={`attendance-details-status ${getStatusClass(
                                                        mark
                                                    )}`}
                                                >

                                                    <i
                                                        className={getStatusIcon(
                                                            mark
                                                        )}
                                                    ></i>

                                                    {mark}

                                                </span>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    )}

                </div>

                {/* =================================================
                    TABLE FOOTER
                ================================================= */}
                {students.length > 0 && (

                    <div className="attendance-details-footer">

                        <div className="attendance-details-footer-info">

                            <i className="bi bi-info-circle-fill"></i>

                            <span>
                                Attendance summary is based on the selected
                                class and date.
                            </span>

                        </div>

                        <button
                            type="button"
                            className="attendance-details-footer-export"
                            onClick={exportCSV}
                        >
                            <i className="bi bi-download"></i>
                            Export Attendance
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}