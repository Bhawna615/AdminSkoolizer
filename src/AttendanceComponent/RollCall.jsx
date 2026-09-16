
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitAttendance } from "../AttendanceComponent/attendanceApi";
import "./RollCall.css";

export default function RollCall() {
    const location = useLocation();
    const navigate = useNavigate();

    // =========================
    // SAFE DATA
    // =========================
    const students = location.state?.students || [];
    const className = location.state?.className || "";
    const date = location.state?.date || "";

    const [marks, setMarks] = useState(
        students.map(() => "Present")
    );

    const [loading, setLoading] = useState(false);

    // =========================
    // CHANGE ATTENDANCE
    // =========================
    const changeMark = (index, value) => {
        const updated = [...marks];
        updated[index] = value;
        setMarks(updated);
    };

    // =========================
    // COUNTS
    // =========================
    const presentCount = marks.filter(
        (mark) => mark === "Present"
    ).length;

    const absentCount = marks.filter(
        (mark) => mark === "Absent"
    ).length;

    const leaveCount = marks.filter(
        (mark) => mark === "Leave"
    ).length;

    // =========================
    // SUBMIT
    // =========================
    const submit = async () => {
        if (students.length === 0) {
            alert("No students found.");
            return;
        }

        try {
            setLoading(true);

            await submitAttendance({
                students,
                marks,
                class: className,
                date,
            });

            navigate(
                "/dashboard/AttendanceComponent/ViewAttendance",
                {
                    state: {
                        message: "Attendance Marked Successfully ✅",
                    },
                }
            );
        } catch (err) {
            console.log(err);
            alert("Error while submitting attendance");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // BACK
    // =========================
    const goBack = () => {
        navigate("/dashboard/AttendanceComponent/MarkAttendance");
    };

    return (
        <div className="roll-call-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}
            <div className="roll-call-header">

                <div className="roll-call-header-left">

                    <div className="roll-call-header-icon">
                        <i className="bi bi-person-check-fill"></i>
                    </div>

                    <div>
                        <h2>Mark Attendance</h2>
                        <p>
                            Record attendance for the selected class
                        </p>
                    </div>

                </div>

                <div className="roll-call-header-actions">

                    <button
                        type="button"
                        className="roll-call-back-btn"
                        onClick={goBack}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Back
                    </button>

                </div>

            </div>


            {/* =================================================
                CLASS / DATE INFORMATION
            ================================================= */}
            <div className="roll-call-info-bar">

                <div className="roll-call-info-item">

                    <div className="roll-call-info-icon">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div>
                        <span>Class</span>
                        <strong>
                            {className ? `Class ${className}` : "—"}
                        </strong>
                    </div>

                </div>


                <div className="roll-call-info-divider"></div>


                <div className="roll-call-info-item">

                    <div className="roll-call-info-icon">
                        <i className="bi bi-calendar3"></i>
                    </div>

                    <div>
                        <span>Date</span>
                        <strong>
                            {date || "—"}
                        </strong>
                    </div>

                </div>


                <div className="roll-call-info-divider"></div>


                <div className="roll-call-info-item">

                    <div className="roll-call-info-icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div>
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
            <div className="roll-call-summary">

                <div className="roll-call-summary-card">

                    <div className="roll-call-summary-icon total">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div>
                        <span>Total Students</span>
                        <strong>{students.length}</strong>
                    </div>

                </div>


                <div className="roll-call-summary-card">

                    <div className="roll-call-summary-icon present">
                        <i className="bi bi-check-circle-fill"></i>
                    </div>

                    <div>
                        <span>Present</span>
                        <strong>{presentCount}</strong>
                    </div>

                </div>


                <div className="roll-call-summary-card">

                    <div className="roll-call-summary-icon absent">
                        <i className="bi bi-x-circle-fill"></i>
                    </div>

                    <div>
                        <span>Absent</span>
                        <strong>{absentCount}</strong>
                    </div>

                </div>


                <div className="roll-call-summary-card">

                    <div className="roll-call-summary-icon leave">
                        <i className="bi bi-calendar-minus-fill"></i>
                    </div>

                    <div>
                        <span>Leave</span>
                        <strong>{leaveCount}</strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                STUDENT TABLE CARD
            ================================================= */}
            <div className="roll-call-table-card">

                <div className="roll-call-table-header">

                    <div className="roll-call-table-title">

                        <div className="roll-call-table-title-icon">
                            <i className="bi bi-list-check"></i>
                        </div>

                        <div>
                            <h3>Student Attendance</h3>
                            <p>
                                Select the attendance status for each student
                            </p>
                        </div>

                    </div>


                    <div className="roll-call-status-guide">

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
                <div className="roll-call-table-wrapper">

                    {students.length === 0 ? (

                        <div className="roll-call-empty">

                            <div className="roll-call-empty-icon">
                                <i className="bi bi-people"></i>
                            </div>

                            <h3>No Students Found</h3>

                            <p>
                                There are no students available for this
                                class.
                            </p>

                            <button
                                type="button"
                                onClick={goBack}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Select Another Class
                            </button>

                        </div>

                    ) : (

                        <table className="roll-call-table">

                            <thead>
                                <tr>
                                    <th className="roll-call-id-column">
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

                                    <th className="roll-call-status-column">
                                        Attendance
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {students.map((s, i) => (

                                    <tr key={s.id || i}>

                                        <td>
                                            <span className="roll-call-row-number">
                                                {i + 1}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="roll-call-student-id">
                                                {s.id}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="roll-call-roll-number">
                                                {s.Rollno}
                                            </span>
                                        </td>

                                        <td>

                                            <div className="roll-call-student">

                                                <div className="roll-call-avatar">
                                                    {s.Name
                                                        ? s.Name.charAt(0).toUpperCase()
                                                        : "S"}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {s.Name}
                                                    </strong>

                                                    <span>
                                                        Student
                                                    </span>
                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="roll-call-select-wrapper">

                                                <i
                                                    className={
                                                        marks[i] === "Present"
                                                            ? "bi bi-check-circle-fill roll-call-select-icon present"
                                                            : marks[i] === "Absent"
                                                            ? "bi bi-x-circle-fill roll-call-select-icon absent"
                                                            : "bi bi-calendar-minus-fill roll-call-select-icon leave"
                                                    }
                                                ></i>

                                                <select
                                                    className={`roll-call-select ${
                                                        marks[i] === "Present"
                                                            ? "roll-call-select-present"
                                                            : marks[i] === "Absent"
                                                            ? "roll-call-select-absent"
                                                            : "roll-call-select-leave"
                                                    }`}
                                                    value={marks[i]}
                                                    onChange={(e) =>
                                                        changeMark(
                                                            i,
                                                            e.target.value
                                                        )
                                                    }
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

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}
                {students.length > 0 && (

                    <div className="roll-call-footer">

                        <div className="roll-call-footer-message">

                            <i className="bi bi-info-circle-fill"></i>

                            <span>
                                Please verify all students before submitting
                                attendance.
                            </span>

                        </div>


                        <div className="roll-call-footer-actions">

                            <button
                                type="button"
                                className="roll-call-footer-back"
                                onClick={goBack}
                                disabled={loading}
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back
                            </button>

                            <button
                                type="button"
                                className="roll-call-submit"
                                onClick={submit}
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="roll-call-spinner"></span>
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

                    </div>

                )}

            </div>

        </div>
    );
}
