
import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import {
    FaTrophy,
    FaPlus,
    FaEdit,
    FaTrash,
    FaCalendarAlt,
    FaMedal,
    FaCheckCircle,
    FaExclamationCircle,
    FaTimes
} from "react-icons/fa";
import "./StudentSports.css";

const StudentSports = () => {
    const navigate = useNavigate();

    const BASE_URL =
        "http://localhost/kkblossom/api.php/Adminapi/AdminStudentSports";

    const [events, setEvents] = useState([]);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // =========================================================
    // SHOW MESSAGE
    // =========================================================

    const showMessage = (text, type = "error") => {
        setMessage(text);
        setMessageType(type);
    };

    // =========================================================
    // LOAD SPORTS EVENTS
    // =========================================================

    useEffect(() => {
        axios
            .get(`${BASE_URL}/index`)
            .then((res) => {
                setEvents(res.data || []);
            })
            .catch((err) => {
                console.log(err);
                showMessage("Failed to load sport events", "error");
            });
    }, []);

    // =========================================================
    // AUTO CLOSE SUCCESS MESSAGE
    // =========================================================

    useEffect(() => {
        if (message && messageType === "success") {
            const timer = setTimeout(() => {
                setMessage("");
                setMessageType("");
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [message, messageType]);

    // =========================================================
    // CLOSE MESSAGE
    // =========================================================

    const closeMessage = () => {
        setMessage("");
        setMessageType("");
        setSelectedEventId(null);
    };

    // =========================================================
    // SHOW DELETE CONFIRMATION POPUP
    // =========================================================

    const deleteEvent = (id) => {
        setSelectedEventId(id);
        setMessage("Are you sure you want to delete this sport event?");
        setMessageType("confirm");
    };

    // =========================================================
    // CONFIRM DELETE EVENT
    // =========================================================

    const confirmDeleteEvent = () => {
        if (selectedEventId === null || isDeleting) return;

        setIsDeleting(true);

        axios
            .delete(`${BASE_URL}/delete/${selectedEventId}`)
            .then(() => {
                setEvents((prevEvents) =>
                    prevEvents.filter(
                        (event) => event.id !== selectedEventId
                    )
                );

                setSelectedEventId(null);
                showMessage("Sport event deleted successfully", "success");
            })
            .catch((err) => {
                console.log(err);

                setSelectedEventId(null);
                showMessage("Failed to delete sport event", "error");
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    // =========================================================
    // TABLE COLUMNS
    // =========================================================

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
            center: true
        },
        {
            name: "SPORT EVENT",
            selector: (row) => row.name,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <button
                    type="button"
                    className="student-sports-name-btn"
                    onClick={() =>
                        navigate(
                            `/dashboard/StudentComponent/SportsParticipant/${row.id}`
                        )
                    }
                    title="View participants"
                >
                    {row.name}
                </button>
            )
        },
        {
            name: "DATE",
            selector: (row) => row.date,
            sortable: true,
            grow: 1.4,
            cell: (row) => (
                <div className="student-sports-date">
                    <FaCalendarAlt />
                    <span>
                        {new Date(row.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}
                    </span>
                </div>
            )
        },
        {
            name: "FIRST",
            selector: (row) => row.first,
            sortable: true,
            center: true,
            cell: (row) => (
                <span className="student-sports-medal student-sports-first">
                    {row.first || 0}
                </span>
            )
        },
        {
            name: "SECOND",
            selector: (row) => row.second,
            sortable: true,
            center: true,
            cell: (row) => (
                <span className="student-sports-medal student-sports-second">
                    {row.second || 0}
                </span>
            )
        },
        {
            name: "THIRD",
            selector: (row) => row.third,
            sortable: true,
            center: true,
            cell: (row) => (
                <span className="student-sports-medal student-sports-third">
                    {row.third || 0}
                </span>
            )
        },
        {
            name: "ACTION",
            width: "150px",
            minWidth: "150px",
            center: true,
            cell: (row) => (
                <div className="student-sports-actions">
                    <button
                        type="button"
                        className="student-sports-edit-btn"
                        title="Edit Sport Event"
                        onClick={() =>
                            navigate(
                                `/dashboard/StudentComponent/SportsEdit/${row.id}`
                            )
                        }
                    >
                        <FaEdit />
                    </button>

                    <button
                        type="button"
                        className="student-sports-delete-btn"
                        title="Delete Sport Event"
                        onClick={() => deleteEvent(row.id)}
                    >
                        <FaTrash />
                    </button>
                </div>
            )
        }
    ];

    // =========================================================
    // DATATABLE STYLES
    // =========================================================

    const customStyles = {
        table: {
            style: {
                width: "100%"
            }
        },
        headRow: {
            style: {
                minHeight: "50px",
                backgroundColor: "#5b2c91",
                borderBottom: "none"
            }
        },
        headCells: {
            style: {
                backgroundColor: "#5b2c91",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                paddingLeft: "14px",
                paddingRight: "14px"
            }
        },
        rows: {
            style: {
                minHeight: "60px",
                fontSize: "13px",
                color: "#403747",
                borderBottom: "1px solid #eeeaf1"
            },
            highlightOnHoverStyle: {
                backgroundColor: "#faf7fd",
                borderBottomColor: "#e5d9ed"
            }
        },
        cells: {
            style: {
                paddingLeft: "14px",
                paddingRight: "14px"
            }
        },
        pagination: {
            style: {
                minHeight: "50px",
                borderTop: "1px solid #eeeaf1",
                fontSize: "11px"
            }
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="student-sports-page">

            <div className="student-sports-header">
                <div className="student-sports-header-left">
                    <div className="student-sports-header-icon">
                        <FaTrophy />
                    </div>

                    <div>
                        <h1>Student Sports</h1>
                        <p>
                            Manage student sports events and achievements
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="student-sports-add-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard/StudentComponent/SportsAdd"
                        )
                    }
                >
                    <FaPlus />
                    <span>Add Sport Event</span>
                </button>
            </div>

            <div className="student-sports-card">
                <div className="student-sports-card-header">
                    <div className="student-sports-card-title">
                        <div className="student-sports-small-icon">
                            <FaMedal />
                        </div>

                        <div>
                            <h2>Sports Events</h2>
                            <p>
                                View and manage all student sports events
                            </p>
                        </div>
                    </div>

                    <div className="student-sports-total">
                        {events.length} Events
                    </div>
                </div>

                <div className="student-sports-table">
                    <DataTable
                        columns={columns}
                        data={events}
                        pagination
                        responsive
                        striped
                        highlightOnHover
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="student-sports-no-data">
                                <FaTrophy />
                                <span>No sport events available</span>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* =================================================
                CONFIRMATION / SUCCESS / ERROR POPUP
            ================================================= */}

            {message && (
                <div className="student-sports-modal-overlay">
                    <div
                        className={`student-sports-modal-popup ${
                            messageType === "success"
                                ? "student-sports-modal-success"
                                : messageType === "confirm"
                                ? "student-sports-modal-error"
                                : "student-sports-modal-error"
                        }`}
                        role="alertdialog"
                        aria-modal="true"
                    >
                        <button
                            type="button"
                            className="student-sports-modal-close"
                            onClick={closeMessage}
                            aria-label="Close message"
                            disabled={isDeleting}
                        >
                            <FaTimes />
                        </button>

                        <div className="student-sports-modal-icon">
                            {messageType === "success" ? (
                                <FaCheckCircle />
                            ) : (
                                <FaExclamationCircle />
                            )}
                        </div>

                        <h2>
                            {messageType === "success"
                                ? "Success!"
                                : messageType === "confirm"
                                ? "Confirm Deletion"
                                : "Action Required"}
                        </h2>

                        <p>{message}</p>

                        {messageType === "success" ? (
                            <>
                                <div className="student-sports-modal-status">
                                    Your sports event list has been updated.
                                </div>

                                <div className="student-sports-modal-progress">
                                    <div className="student-sports-modal-progress-bar"></div>
                                </div>
                            </>
                        ) : messageType === "confirm" ? (
                            <div className="student-sports-confirm-actions">
                                <button
                                    type="button"
                                    className="student-sports-modal-cancel-btn"
                                    onClick={closeMessage}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="student-sports-modal-delete-btn"
                                    onClick={confirmDeleteEvent}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="student-sports-modal-ok-btn"
                                onClick={closeMessage}
                            >
                                Okay
                            </button>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default StudentSports;
