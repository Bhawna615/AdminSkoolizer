
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitAttendance } from "../AttendanceComponent/attendanceApi";
import "./EditAttendance.css";

export default function EditAttendance() {
    const { state } = useLocation();
    const navigate = useNavigate();

    const students = state?.students || [];
    const absentees = state?.absentees || [];

    // =========================================================
    // INITIAL ATTENDANCE MARKS
    // =========================================================
    const [marks, setMarks] = useState(() =>
        students.map((student) => {
            const found = absentees.find(
                (absent) =>
                    String(absent.Rollno) === String(student.Rollno)
            );

            if (!found) {
                return "Present";
            }

            if (Number(found.onLeave) === 1) {
                return "Leave";
            }

            return "Absent";
        })
    );

    const [loading, setLoading] = useState(false);

    // =========================================================
    // CHANGE ATTENDANCE
    // =========================================================
    const changeMark = (index, value) => {
        const updated = [...marks];

        updated[index] = value;

        setMarks(updated);
    };

    // =========================================================
    // SUMMARY COUNTS
    // =========================================================
    const presentCount = marks.filter(
        (mark) => mark === "Present"
    ).length;

    const absentCount = marks.filter(
        (mark) => mark === "Absent"
    ).length;

    const leaveCount = marks.filter(
        (mark) => mark === "Leave"
    ).length;

    // =========================================================
    // STATUS CLASS
    // =========================================================
    const getStatusClass = (mark) => {
        if (mark === "Present") {
            return "edit-attendance-select-present";
        }

        if (mark === "Absent") {
            return "edit-attendance-select-absent";
        }

        return "edit-attendance-select-leave";
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

    // =========================================================
    // SUBMIT UPDATED ATTENDANCE
    // =========================================================
    const handleSubmit = async () => {
        if (students.length === 0) {
            alert("No students found.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                class: state?.className,
                date: state?.date,
                students: students,
                marks: marks,
            };

            await submitAttendance(payload);

            alert("Attendance Updated Successfully ✅");

            navigate(
                "/dashboard/AttendanceComponent/ViewAttendance",
                {
                    state: {
                        message: "Attendance Updated Successfully",
                    },
                }
            );
        } catch (err) {
            console.log(err);
            alert("Error updating attendance");
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // BACK
    // =========================================================
    const goBack = () => {
        navigate(
            "/dashboard/AttendanceComponent/ViewAttendance"
        );
    };

    return (
        <div className="edit-attendance-page">

            {/* =================================================
                HEADER
            ================================================= */}
            <div className="edit-attendance-header">

                <div className="edit-attendance-header-left">

                    <div className="edit-attendance-header-icon">
                        <i className="bi bi-pencil-square"></i>
                    </div>

                    <div className="edit-attendance-header-text">
                        <h2>Edit Attendance</h2>

                        <p>
                            Update attendance records for the selected
                            class and date
                        </p>
                    </div>

                </div>

                <div className="edit-attendance-header-actions">

                    <button
                        type="button"
                        className="edit-attendance-back-btn"
                        onClick={goBack}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-left"></i>
                        <span>Back</span>
                    </button>

                </div>

            </div>

            {/* =================================================
                CLASS / DATE INFORMATION
            ================================================= */}
            <div className="edit-attendance-info-card">

                <div className="edit-attendance-info-item">

                    <div className="edit-attendance-info-icon">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div className="edit-attendance-info-content">
                        <span>Class</span>

                        <strong>
                            {state?.className
                                ? `Class ${state.className}`
                                : "—"}
                        </strong>
                    </div>

                </div>

                <div className="edit-attendance-info-divider"></div>

                <div className="edit-attendance-info-item">

                    <div className="edit-attendance-info-icon">
                        <i className="bi bi-calendar3"></i>
                    </div>

                    <div className="edit-attendance-info-content">
                        <span>Attendance Date</span>

                        <strong>
                            {state?.date || "—"}
                        </strong>
                    </div>

                </div>

                <div className="edit-attendance-info-divider"></div>

                <div className="edit-attendance-info-item">

                    <div className="edit-attendance-info-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div className="edit-attendance-info-content">
                        <span>Total Students</span>

                        <strong>
                            {students.length}
                        </strong>
                    </div>

                </div>

            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}
            <div className="edit-attendance-summary">

                {/* Total */}
                <div className="edit-attendance-summary-card">

                    <div className="edit-attendance-summary-icon total">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div className="edit-attendance-summary-content">
                        <span>Total Students</span>
                        <strong>{students.length}</strong>
                    </div>

                </div>

                {/* Present */}
                <div className="edit-attendance-summary-card">

                    <div className="edit-attendance-summary-icon present">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <div className="edit-attendance-summary-content">
                        <span>Present</span>
                        <strong>{presentCount}</strong>
                    </div>

                </div>

                {/* Absent */}
                <div className="edit-attendance-summary-card">

                    <div className="edit-attendance-summary-icon absent">
                        <i className="bi bi-x-circle-fill"></i>
                    </div>

                    <div className="edit-attendance-summary-content">
                        <span>Absent</span>
                        <strong>{absentCount}</strong>
                    </div>

                </div>

                {/* Leave */}
                <div className="edit-attendance-summary-card">

                    <div className="edit-attendance-summary-icon leave">
                        <i className="bi bi-calendar-minus-fill"></i>
                    </div>

                    <div className="edit-attendance-summary-content">
                        <span>On Leave</span>
                        <strong>{leaveCount}</strong>
                    </div>

                </div>

            </div>

            {/* =================================================
                MAIN TABLE CARD
            ================================================= */}
            <div className="edit-attendance-table-card">

                {/* Table Header */}
                <div className="edit-attendance-table-header">

                    <div className="edit-attendance-table-title">

                        <div className="edit-attendance-table-title-icon">
                            <i className="bi bi-list-check"></i>
                        </div>

                        <div>
                            <h3>Student Attendance</h3>

                            <p>
                                Change the attendance status of any student
                            </p>
                        </div>

                    </div>

                    {/* Status Guide */}
                    <div className="edit-attendance-status-guide">

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
                            Leave
                        </span>

                    </div>

                </div>

                {/* =================================================
                    TABLE
                ================================================= */}
                <div className="edit-attendance-table-wrapper">

                    {students.length === 0 ? (

                        <div className="edit-attendance-empty">

                            <div className="edit-attendance-empty-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <h3>No Students Found</h3>

                            <p>
                                There are no students available for this
                                attendance record.
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

                        <table className="edit-attendance-table">

                            <thead>
                                <tr>

                                    <th className="edit-attendance-number-column">
                                        #
                                    </th>

                                    <th>
                                        Student ID
                                    </th>

                                    <th>
                                        Roll No.
                                    </th>

                                    <th>
                                        Student Name
                                    </th>

                                    <th className="edit-attendance-mark-column">
                                        Attendance
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {students.map((student, index) => {

                                    const currentMark =
                                        marks[index] || "Present";

                                    return (
                                        <tr
                                            key={
                                                student.id ||
                                                student.Rollno ||
                                                index
                                            }
                                        >

                                            {/* Number */}
                                            <td>
                                                <span className="edit-attendance-row-number">
                                                    {index + 1}
                                                </span>
                                            </td>

                                            {/* ID */}
                                            <td>
                                                <span className="edit-attendance-student-id">
                                                    {student.id || "—"}
                                                </span>
                                            </td>

                                            {/* Roll Number */}
                                            <td>
                                                <span className="edit-attendance-roll-number">
                                                    {student.Rollno || "—"}
                                                </span>
                                            </td>

                                            {/* Name */}
                                            <td>

                                                <div className="edit-attendance-student">

                                                    <div className="edit-attendance-avatar">
                                                        {student.Name
                                                            ? student.Name
                                                                .charAt(0)
                                                                .toUpperCase()
                                                            : "S"}
                                                    </div>

                                                    <div className="edit-attendance-student-info">

                                                        <strong>
                                                            {student.Name ||
                                                                "Unknown Student"}
                                                        </strong>

                                                        <span>
                                                            Student
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* Attendance */}
                                            <td>

                                                <div
                                                    className={`edit-attendance-select-wrapper ${getStatusClass(
                                                        currentMark
                                                    )}`}
                                                >

                                                    <i
                                                        className={`${getStatusIcon(
                                                            currentMark
                                                        )} edit-attendance-select-icon`}
                                                    ></i>

                                                    <select
                                                        className="edit-attendance-select"
                                                        value={currentMark}
                                                        onChange={(e) =>
                                                            changeMark(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={loading}
                                                    >

                                                        <option value="Present">
                                                            Present
                                                        </option>

                                                        <option value="Absent">
                                                            Absent
                                                        </option>

                                                        <option value="Leave">
                                                            Leave
                                                        </option>

                                                    </select>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    )}

                </div>

                {/* =================================================
                    FOOTER
                ================================================= */}
                {students.length > 0 && (

                    <div className="edit-attendance-footer">

                        <div className="edit-attendance-footer-info">

                            <i className="bi bi-info-circle-fill"></i>

                            <span>
                                Please verify all attendance changes before
                                submitting.
                            </span>

                        </div>

                        <div className="edit-attendance-footer-actions">

                            <button
                                type="button"
                                className="edit-attendance-footer-back"
                                onClick={goBack}
                                disabled={loading}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="edit-attendance-submit"
                                onClick={handleSubmit}
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="edit-attendance-spinner"></span>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2-circle"></i>
                                        Update Attendance
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}