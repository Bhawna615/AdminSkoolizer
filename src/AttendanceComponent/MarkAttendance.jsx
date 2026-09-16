
import React, { useEffect, useState } from "react";
import { getClasses, getRollCall } from "../AttendanceComponent/attendanceApi";
import { useNavigate } from "react-router-dom";
import "./MarkAttendance.css";

export default function MarkAttendance() {
    const [classes, setClasses] = useState([]);
    const [date, setDate] = useState("");
    const [className, setClassName] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getClasses()
            .then((res) => {
                setClasses(res.data);

                if (res.data.length > 0) {
                    setClassName(res.data[0].Classname);
                }
            })
            .catch((err) => {
                console.log("Class fetch error:", err);
            });

        const today = new Date().toISOString().split("T")[0];
        setDate(today);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date || !className) {
            alert("Please select date and class.");
            return;
        }

        try {
            setLoading(true);

            const res = await getRollCall({
                class: className,
                date: date,
            });

            console.log("API RESPONSE:", res.data);

            if (res.data.error) {
                alert(res.data.error);
                return;
            }

            navigate("/dashboard/AttendanceComponent/RollCall", {
                state: res.data,
            });
        } catch (err) {
            console.log(err);
            alert("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mark-attendance-page">

            {/* =========================
                PAGE HEADER
            ========================= */}
            <div className="mark-attendance-header">

                <div className="mark-attendance-header-left">

                    <div className="mark-attendance-header-icon">
                        <i className="bi bi-calendar-check-fill"></i>
                    </div>

                    <div>
                        <h2>Mark Attendance</h2>
                        <p>
                            Select a date and class to mark student attendance
                        </p>
                    </div>

                </div>

                <div className="mark-attendance-header-badge">
                    <i className="bi bi-check2-circle"></i>
                    Attendance
                </div>

            </div>


            {/* =========================
                MAIN CONTENT
            ========================= */}
            <div className="mark-attendance-content">

                {/* =========================
                    FORM CARD
                ========================= */}
                <div className="mark-attendance-card">

                    <div className="mark-attendance-card-header">

                        <div className="mark-attendance-card-title">

                            <div className="mark-attendance-card-icon">
                                <i className="bi bi-pencil-square"></i>
                            </div>

                            <div>
                                <h3>Attendance Details</h3>
                                <p>
                                    Choose the class and date for attendance
                                </p>
                            </div>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="mark-attendance-form"
                    >

                        {/* =========================
                            DATE
                        ========================= */}
                        <div className="mark-attendance-field">

                            <label htmlFor="attendance-date">
                                <i className="bi bi-calendar3"></i>
                                Select Date
                                <span>*</span>
                            </label>

                            <div className="mark-attendance-input-wrapper">

                                <i className="bi bi-calendar-event mark-attendance-input-icon"></i>

                                <input
                                    id="attendance-date"
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                    className="mark-attendance-input"
                                    required
                                />

                            </div>

                            <small>
                                Select the date for which you want to mark
                                attendance.
                            </small>

                        </div>


                        {/* =========================
                            CLASS
                        ========================= */}
                        <div className="mark-attendance-field">

                            <label htmlFor="attendance-class">
                                <i className="bi bi-mortarboard-fill"></i>
                                Select Class
                                <span>*</span>
                            </label>

                            <div className="mark-attendance-input-wrapper">

                                <i className="bi bi-people-fill mark-attendance-input-icon"></i>

                                <select
                                    id="attendance-class"
                                    value={className}
                                    onChange={(e) =>
                                        setClassName(e.target.value)
                                    }
                                    className="mark-attendance-select"
                                    required
                                >

                                    {classes.length === 0 ? (
                                        <option value="">
                                            Loading classes...
                                        </option>
                                    ) : (
                                        classes.map((c, i) => (
                                            <option
                                                key={i}
                                                value={c.Classname}
                                            >
                                                Class {c.Classname}
                                            </option>
                                        ))
                                    )}

                                </select>

                                <i className="bi bi-chevron-down mark-attendance-select-arrow"></i>

                            </div>

                            <small>
                                Select the class whose students will be
                                displayed.
                            </small>

                        </div>


                        {/* =========================
                            INFORMATION BOX
                        ========================= */}
                        <div className="mark-attendance-info">

                            <div className="mark-attendance-info-icon">
                                <i className="bi bi-info-circle-fill"></i>
                            </div>

                            <div className="mark-attendance-info-content">

                                <strong>
                                    Before marking attendance
                                </strong>

                                <p>
                                    Make sure you have selected the correct
                                    date and class. You will be redirected to
                                    the student attendance list.
                                </p>

                            </div>

                        </div>


                        {/* =========================
                            ACTIONS
                        ========================= */}
                        <div className="mark-attendance-actions">

                            <button
                                type="button"
                                className="mark-attendance-cancel-btn"
                                onClick={() =>
                                    navigate("/dashboard")
                                }
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back
                            </button>

                            <button
                                type="submit"
                                className="mark-attendance-submit-btn"
                                disabled={loading || !className}
                            >

                                {loading ? (
                                    <>
                                        <span className="mark-attendance-spinner"></span>
                                        Loading Students...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2-circle"></i>
                                        Mark Attendance
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>


                {/* =========================
                    SIDE INFORMATION
                ========================= */}
                <div className="mark-attendance-side-card">

                    <div className="mark-attendance-side-icon">
                        <i className="bi bi-calendar2-check-fill"></i>
                    </div>

                    <h3>Attendance Management</h3>

                    <p>
                        Manage daily student attendance quickly and
                        efficiently from one place.
                    </p>


                    <div className="mark-attendance-feature">

                        <div className="mark-attendance-feature-icon">
                            <i className="bi bi-calendar-check"></i>
                        </div>

                        <div>
                            <strong>Select Date</strong>
                            <span>
                                Choose the attendance date.
                            </span>
                        </div>

                    </div>


                    <div className="mark-attendance-feature">

                        <div className="mark-attendance-feature-icon">
                            <i className="bi bi-people"></i>
                        </div>

                        <div>
                            <strong>Select Class</strong>
                            <span>
                                Choose the required class.
                            </span>
                        </div>

                    </div>


                    <div className="mark-attendance-feature">

                        <div className="mark-attendance-feature-icon">
                            <i className="bi bi-person-check"></i>
                        </div>

                        <div>
                            <strong>Mark Students</strong>
                            <span>
                                Record present or absent status.
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}