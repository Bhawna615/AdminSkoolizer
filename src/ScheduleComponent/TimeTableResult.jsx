import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTimeTable, deletePeriod } from "./timetableApi";
import "./TimeTableResult.css";

const TimeTableResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { class: selectedClass, day } = location.state || {};

    const [timetable, setTimetable] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const [loading, setLoading] = useState(true);

    // LOAD DATA
    useEffect(() => {
        if (selectedClass && day) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [selectedClass, day]);

    const loadData = async () => {
        try {
            setLoading(true);

            const res = await getTimeTable({
                class: selectedClass,
                day: day,
            });

            setTimetable(res.data.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this period?")) {
            return;
        }

        try {
            await deletePeriod(id);
            setOpenMenu(null);
            loadData();
        } catch (error) {
            console.log("Delete error:", error);
            alert("Unable to delete period.");
        }
    };

    // FORMAT TIME
    const formatTime = (time) => {
        if (!time) return "--";

        return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // NO CLASS/DAY SELECTED
    if (!selectedClass || !day) {
        return (
            <div className="ttr-page">
                <div className="ttr-empty-selection">
                    <div className="ttr-empty-icon">
                        <i className="bi bi-calendar-x"></i>
                    </div>

                    <h3>No Timetable Selected</h3>

                    <p>
                        Please select a class and day to view the timetable.
                    </p>

                    <button
                        className="ttr-back-button"
                        onClick={() =>
                            navigate("/dashboard/ScheduleComponent/ViewTimeTable")
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Select Timetable
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="ttr-page">

            <div className="ttr-container">

                {/* ================= HEADER ================= */}

                <div className="ttr-header">

                    <div className="ttr-header-left">

                        <div className="ttr-header-icon">
                            <i className="bi bi-calendar3"></i>
                        </div>

                        <div>
                            <h2 className="ttr-title">
                                Time Table
                            </h2>

                            <p className="ttr-subtitle">
                                Class {selectedClass} • {day}
                            </p>
                        </div>

                    </div>

                    <button
                        className="ttr-change-button"
                        onClick={() =>
                            navigate(
                                "/dashboard/ScheduleComponent/ViewTimeTable"
                            )
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        Change
                    </button>

                </div>


                {/* ================= SUMMARY ================= */}

                <div className="ttr-summary">

                    <div className="ttr-summary-item">
                        <div className="ttr-summary-icon">
                            <i className="bi bi-mortarboard-fill"></i>
                        </div>

                        <div>
                            <span>Class</span>
                            <strong>{selectedClass}</strong>
                        </div>
                    </div>


                    <div className="ttr-summary-divider"></div>


                    <div className="ttr-summary-item">
                        <div className="ttr-summary-icon">
                            <i className="bi bi-calendar-day-fill"></i>
                        </div>

                        <div>
                            <span>Day</span>
                            <strong>{day}</strong>
                        </div>
                    </div>


                    <div className="ttr-summary-divider"></div>


                    <div className="ttr-summary-item">
                        <div className="ttr-summary-icon">
                            <i className="bi bi-clock-fill"></i>
                        </div>

                        <div>
                            <span>Total Periods</span>
                            <strong>{timetable.length}</strong>
                        </div>
                    </div>

                </div>


                {/* ================= CONTENT ================= */}

                {loading ? (

                    <div className="ttr-loading">
                        <div className="ttr-spinner"></div>
                        <p>Loading timetable...</p>
                    </div>

                ) : timetable.length === 0 ? (

                    <div className="ttr-empty">

                        <div className="ttr-empty-icon">
                            <i className="bi bi-calendar2-x"></i>
                        </div>

                        <h3>Not Yet Added</h3>

                        <p>
                            No timetable has been added for
                            <strong> Class {selectedClass}</strong> on
                            <strong> {day}</strong>.
                        </p>

                        <button
                            className="ttr-back-button"
                            onClick={() =>
                                navigate(
                                    "/dashboard/ScheduleComponent/ViewTimeTable"
                                )
                            }
                        >
                            <i className="bi bi-arrow-left"></i>
                            Go Back
                        </button>

                    </div>

                ) : (

                    <>

                        {/* SECTION TITLE */}

                        <div className="ttr-section-heading">

                            <div>
                                <h3>Daily Schedule</h3>
                                <p>
                                    Periods scheduled for Class {selectedClass}
                                </p>
                            </div>

                            <div className="ttr-period-count">
                                {timetable.length}{" "}
                                {timetable.length === 1
                                    ? "Period"
                                    : "Periods"}
                            </div>

                        </div>


                        {/* ================= PERIOD GRID ================= */}

                        <div className="ttr-grid">

                            {timetable.map((row, index) => (

                                <div
                                    key={row.timetableid}
                                    className="ttr-period-card"
                                >

                                    {/* TOP */}

                                    <div className="ttr-card-top">

                                        <div className="ttr-period-number">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <span className="ttr-period-label">
                                            Period {index + 1}
                                        </span>

                                        {/* 3 DOT */}

                                        <button
                                            className="ttr-menu-button"
                                            onClick={() =>
                                                setOpenMenu(
                                                    openMenu ===
                                                        row.timetableid
                                                        ? null
                                                        : row.timetableid
                                                )
                                            }
                                        >
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>


                                        {/* MENU */}

                                        {openMenu === row.timetableid && (

                                            <div className="ttr-dropdown">

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            row.timetableid
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash3"></i>
                                                    Delete
                                                </button>

                                            </div>

                                        )}

                                    </div>


                                    {/* SUBJECT */}

                                    <div className="ttr-subject">
                                        <i className="bi bi-book-fill"></i>

                                        <div>
                                            <span>Subject</span>
                                            <h4>
                                                {row.Subjectname}
                                            </h4>
                                        </div>
                                    </div>


                                    {/* TIME */}

                                    <div className="ttr-time-box">

                                        <div className="ttr-time-item">

                                            <span>START</span>

                                            <strong>
                                                {formatTime(row.Stime)}
                                            </strong>

                                        </div>


                                        <div className="ttr-time-arrow">
                                            <i className="bi bi-arrow-right"></i>
                                        </div>


                                        <div className="ttr-time-item ttr-time-end">

                                            <span>END</span>

                                            <strong>
                                                {formatTime(row.Etime)}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* TEACHER */}

                                    <div className="ttr-teacher">

                                        <div className="ttr-teacher-icon">
                                            <i className="bi bi-person-fill"></i>
                                        </div>

                                        <div>
                                            <span>Teacher</span>

                                            <strong>
                                                {row.Teachername || "Not Assigned"}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </>

                )}

            </div>

        </div>
    );
};

export default TimeTableResult;