
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

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const backToTimetable = () => {
        navigate("/dashboard/ScheduleComponent/ViewTimeTable");
    };

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
            console.log("Timetable loading error:", err);
            setMessage("Unable to load timetable. Please try again.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    // OPEN DELETE CONFIRMATION
    const handleDelete = (id) => {
        setSelectedPeriod(id);
        setOpenMenu(null);
        setShowDeleteConfirm(true);
    };

    // CONFIRM DELETE
    const confirmDelete = async () => {
        if (!selectedPeriod) return;

        try {
            setDeleting(true);

            await deletePeriod(selectedPeriod);

            setTimetable((prev) =>
                prev.filter(
                    (row) => row.timetableid !== selectedPeriod
                )
            );

            setShowDeleteConfirm(false);
            setSelectedPeriod(null);

            setMessage("Period deleted successfully!");
            setMessageType("success");
        } catch (error) {
            console.log("Delete error:", error);

            setShowDeleteConfirm(false);
            setMessage("Unable to delete period. Please try again.");
            setMessageType("error");
        } finally {
            setDeleting(false);
        }
    };

    // CLOSE MESSAGE
    const closeMessage = () => {
        setMessage("");
        setMessageType("");
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
                <div className="ttr-container">
                    <div className="ttr-empty-selection">
                        <div className="ttr-empty-illustration">
                            <i className="bi bi-calendar-x"></i>
                        </div>

                        <span className="ttr-empty-eyebrow">
                            TIMETABLE MANAGEMENT
                        </span>

                        <h3>No Timetable Selected</h3>

                        <p>
                            Please select a class and day to view the
                            scheduled timetable.
                        </p>

                        <button
                            className="ttr-primary-button"
                            onClick={backToTimetable}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Select Timetable
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ttr-page">
            <div className="ttr-container">

                {/* HEADER */}
                <div className="ttr-header">
                    <div className="ttr-header-left">
                        <div className="ttr-header-icon">
                            <i className="bi bi-calendar3"></i>
                        </div>

                        <div>
                            <span className="ttr-eyebrow">
                                ACADEMIC MANAGEMENT
                            </span>

                            <h2 className="ttr-title">
                                Time Table
                            </h2>

                            <p className="ttr-subtitle">
                                View and manage the daily class schedule
                            </p>
                        </div>
                    </div>

                    <button
                        className="ttr-change-button"
                        onClick={backToTimetable}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Change Selection
                    </button>
                </div>

                {/* HERO CARD */}
                <div className="ttr-hero-card">
                    <div className="ttr-hero-content">
                        <span className="ttr-hero-label">
                            CLASS TIMETABLE
                        </span>

                        <h3>Class {selectedClass}</h3>

                        <div className="ttr-hero-day">
                            <i className="bi bi-calendar-week"></i>
                            <span>{day}</span>
                        </div>
                    </div>

                    <div className="ttr-hero-decoration">
                        <i className="bi bi-calendar2-week"></i>
                    </div>

                    <div className="ttr-hero-stats">
                        <div className="ttr-hero-stat">
                            <div className="ttr-hero-stat-icon">
                                <i className="bi bi-book-half"></i>
                            </div>

                            <div>
                                <span>Total Periods</span>
                                <strong>{timetable.length}</strong>
                            </div>
                        </div>

                        <div className="ttr-hero-stat-divider"></div>

                        <div className="ttr-hero-stat">
                            <div className="ttr-hero-stat-icon">
                                <i className="bi bi-person-workspace"></i>
                            </div>

                            <div>
                                <span>Scheduled Day</span>
                                <strong>{day}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="ttr-loading">
                        <div className="ttr-spinner"></div>
                        <h4>Loading Timetable</h4>
                        <p>Please wait while we fetch the schedule...</p>
                    </div>
                ) : timetable.length === 0 ? (
                    <div className="ttr-empty">
                        <div className="ttr-empty-illustration">
                            <i className="bi bi-calendar2-x"></i>
                        </div>

                        <span className="ttr-empty-eyebrow">
                            NO SCHEDULE AVAILABLE
                        </span>

                        <h3>Timetable Not Yet Added</h3>

                        <p>
                            No timetable has been added for
                            <strong> Class {selectedClass}</strong> on
                            <strong> {day}</strong>.
                        </p>

                        <button
                            className="ttr-primary-button"
                            onClick={backToTimetable}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Go Back
                        </button>
                    </div>
                ) : (
                    <>
                        {/* SECTION HEADING */}
                        <div className="ttr-section-heading">
                            <div>
                                <span className="ttr-section-eyebrow">
                                    DAILY CLASS SCHEDULE
                                </span>

                                <h3>Today's Periods</h3>

                                <p>
                                    Complete subject and teacher details
                                    for Class {selectedClass}
                                </p>
                            </div>

                            <div className="ttr-period-count">
                                <i className="bi bi-grid-fill"></i>

                                {timetable.length}{" "}
                                {timetable.length === 1
                                    ? "Period"
                                    : "Periods"}
                            </div>
                        </div>

                        {/* PERIOD GRID */}
                        <div className="ttr-grid">
                            {timetable.map((row, index) => (
                                <div
                                    key={row.timetableid}
                                    className="ttr-period-card"
                                >
                                    {/* CARD HEADER */}
                                    <div className="ttr-card-top">
                                        <div className="ttr-period-badge">
                                            <span>
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        <div className="ttr-period-heading">
                                            <span>CLASS SCHEDULE</span>
                                            <h4>Period {index + 1}</h4>
                                        </div>

                                        <div className="ttr-menu-wrapper">
                                            <button
                                                type="button"
                                                className="ttr-menu-button"
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === row.timetableid
                                                            ? null
                                                            : row.timetableid
                                                    )
                                                }
                                            >
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </button>

                                            {openMenu === row.timetableid && (
                                                <div className="ttr-dropdown">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(row.timetableid)
                                                        }
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                        Delete Period
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* SUBJECT */}
                                    <div className="ttr-subject-section">
                                        <div className="ttr-subject-icon">
                                            <i className="bi bi-book-half"></i>
                                        </div>

                                        <div>
                                            <span>SUBJECT</span>
                                            <h3>{row.Subjectname}</h3>
                                        </div>
                                    </div>

                                    {/* TIME */}
                                    <div className="ttr-time-box">
                                        <div className="ttr-time-item">
                                            <span>
                                                <i className="bi bi-play-circle"></i>
                                                START TIME
                                            </span>

                                            <strong>
                                                {formatTime(row.Stime)}
                                            </strong>
                                        </div>

                                        <div className="ttr-time-connector">
                                            <span></span>
                                            <i className="bi bi-arrow-right"></i>
                                            <span></span>
                                        </div>

                                        <div className="ttr-time-item ttr-time-end">
                                            <span>
                                                <i className="bi bi-flag"></i>
                                                END TIME
                                            </span>

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

                                        <div className="ttr-teacher-details">
                                            <span>ASSIGNED TEACHER</span>

                                            <strong>
                                                {row.Teachername || "Not Assigned"}
                                            </strong>
                                        </div>

                                        <div className="ttr-teacher-status">
                                            <i className="bi bi-check-circle-fill"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* DELETE CONFIRMATION */}
            {showDeleteConfirm && (
                <div className="ttr-message-overlay">
                    <div className="ttr-message-box">
                        <div className="ttr-message-icon ttr-warning-icon">
                            <i className="bi bi-trash3"></i>
                        </div>

                        <h3>Delete This Period?</h3>

                        <p>
                            Are you sure you want to delete this timetable
                            period? This action cannot be undone.
                        </p>

                        <div className="ttr-message-actions">
                            <button
                                type="button"
                                className="ttr-message-cancel"
                                disabled={deleting}
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setSelectedPeriod(null);
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="ttr-message-delete"
                                disabled={deleting}
                                onClick={confirmDelete}
                            >
                                {deleting ? (
                                    <>
                                        <span className="ttr-button-spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3"></i>
                                        Delete Period
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUCCESS / ERROR MESSAGE */}
            {message && (
                <div className="ttr-message-overlay">
                    <div
                        className={`ttr-message-box ${
                            messageType === "error"
                                ? "ttr-message-error"
                                : ""
                        }`}
                    >
                        <div className="ttr-message-icon">
                            <i
                                className={
                                    messageType === "success"
                                        ? "bi bi-check-lg"
                                        : "bi bi-exclamation-triangle"
                                }
                            ></i>
                        </div>

                        <h3>
                            {messageType === "success"
                                ? "Successfully Completed!"
                                : "Something Went Wrong"}
                        </h3>

                        <p>{message}</p>

                        <button
                            type="button"
                            className="ttr-message-ok"
                            onClick={closeMessage}
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeTableResult;
