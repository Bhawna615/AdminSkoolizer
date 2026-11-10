
import React, { useEffect, useState } from "react";
import { getClasses, deleteClass } from "../ScheduleComponent/classApi";
import { useNavigate } from "react-router-dom";
import "./Scheduleclass.css";

const ScheduleClass = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [classes, setClasses] = useState([]);
    const [strength, setStrength] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [selectedClass, setSelectedClass] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const loadClasses = async () => {
        try {
            const res = await getClasses();

            setClasses(res.data.classes || []);
            setStrength(res.data.strength || {});
        } catch (error) {
            console.error("Error loading classes:", error);
            setClasses([]);
            setStrength({});
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);
    };

    const handleDelete = (row) => {
        setSelectedClass(row);
        setOpenMenu(null);
    };

    const confirmDelete = async () => {
        if (!selectedClass || deleteLoading) return;

        try {
            setDeleteLoading(true);

            await deleteClass(selectedClass.id);

            setSelectedClass(null);

            showMessage("Class deleted successfully!", "success");

            await loadClasses();
        } catch (error) {
            console.error("Error deleting class:", error);

            setSelectedClass(null);

            showMessage(
                error.response?.data?.message ||
                "Unable to delete class. Please try again.",
                "error"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const totalStudents = Object.values(strength).reduce(
        (total, value) => total + Number(value || 0),
        0
    );

    return (
        <div className="sc-page">

            {/* HEADER */}
            <div className="sc-header">
                <div className="sc-header-left">
                    <div className="sc-header-icon">
                        <i className="bi bi-mortarboard-fill"></i>
                    </div>

                    <div>
                        <h2 className="sc-title">Class Management</h2>
                        <p className="sc-subtitle">
                            Organize your classes and manage student strength
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="sc-add-button"
                    onClick={() =>
                        navigate("/dashboard/ScheduleComponent/AddClass")
                    }
                >
                    <i className="bi bi-plus-lg"></i>
                    <span>Add New Class</span>
                </button>
            </div>

            {/* MESSAGE */}
            {message && (
                <div className={`sc-message sc-message-${messageType}`}>
                    <i className={`bi ${
                        messageType === "success"
                            ? "bi-check-circle-fill"
                            : "bi-exclamation-circle-fill"
                    }`}></i>

                    <span>{message}</span>

                    <button
                        type="button"
                        onClick={() => {
                            setMessage("");
                            setMessageType("");
                        }}
                        aria-label="Close message"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
            )}

            {/* SUMMARY */}
            <div className="sc-summary">

                <div className="sc-summary-card">
                    <div className="sc-summary-icon sc-purple">
                        <i className="bi bi-grid-3x3-gap-fill"></i>
                    </div>

                    <div className="sc-summary-info">
                        <span>Total Classes</span>
                        <h3>{classes.length}</h3>
                        <small>Available class groups</small>
                    </div>

                    <div className="sc-summary-decoration">
                        <i className="bi bi-collection"></i>
                    </div>
                </div>

                <div className="sc-summary-card">
                    <div className="sc-summary-icon sc-blue">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div className="sc-summary-info">
                        <span>Total Students</span>
                        <h3>{totalStudents.toLocaleString("en-IN")}</h3>
                        <small>Across all classes</small>
                    </div>

                    <div className="sc-summary-decoration">
                        <i className="bi bi-person-workspace"></i>
                    </div>
                </div>

                <div className="sc-summary-card">
                    <div className="sc-summary-icon sc-orange">
                        <i className="bi bi-calendar3"></i>
                    </div>

                    <div className="sc-summary-info">
                        <span>Timetable</span>
                        <h3>Manage</h3>
                        <small>View class schedules</small>
                    </div>

                    <div className="sc-summary-decoration">
                        <i className="bi bi-clock-history"></i>
                    </div>
                </div>

            </div>

            {/* SECTION HEADING */}
            <div className="sc-section-heading">
                <div>
                    <h3>All Classes</h3>
                    <p>Choose a class to view its timetable and details.</p>
                </div>

                <div className="sc-class-count">
                    <i className="bi bi-grid-fill"></i>
                    {classes.length} Classes
                </div>
            </div>

            {/* CLASS CARDS */}
            <div className="sc-container">

                {classes.length > 0 ? (

                    classes.map((row, index) => (

                        <div className="sc-class-card" key={row.id}>

                            <div className="sc-card-top">

                                <div className="sc-card-number">
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                    <small>CLASS</small>
                                </div>

                                <div className="sc-menu-wrapper">

                                    <button
                                        type="button"
                                        className="sc-menu-button"
                                        onClick={() =>
                                            setOpenMenu(
                                                openMenu === row.id
                                                    ? null
                                                    : row.id
                                            )
                                        }
                                        aria-label="Class options"
                                    >
                                        <i className="bi bi-three-dots-vertical"></i>
                                    </button>

                                    {openMenu === row.id && (
                                        <div className="sc-dropdown-menu">
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(row)}
                                            >
                                                <i className="bi bi-trash3"></i>
                                                Delete Class
                                            </button>
                                        </div>
                                    )}

                                </div>

                            </div>

                            <div
                                className="sc-class-main"
                                onClick={() =>
                                    navigate(
                                        `/dashboard/ScheduleComponent/ViewByClassName/${row.Classname}`
                                    )
                                }
                            >

                                <div className="sc-class-icon">
                                    <i className="bi bi-mortarboard-fill"></i>
                                </div>

                                <div className="sc-class-details">
                                    <span className="sc-class-label">
                                        ACADEMIC CLASS
                                    </span>

                                    <h3>{row.Classname}</h3>

                                    <span className="sc-class-description">
                                        View class information
                                    </span>
                                </div>

                                <div className="sc-class-arrow">
                                    <i className="bi bi-arrow-up-right"></i>
                                </div>

                            </div>

                            <div className="sc-card-divider"></div>

                            <div className="sc-strength">

                                <div className="sc-strength-left">
                                    <div className="sc-strength-icon">
                                        <i className="bi bi-people-fill"></i>
                                    </div>

                                    <div>
                                        <strong>Student Strength</strong>
                                        <span>Currently enrolled</span>
                                    </div>
                                </div>

                                <div className="sc-strength-value">
                                    <strong>
                                        {Number(strength[row.Classname] || 0).toLocaleString("en-IN")}
                                    </strong>
                                    <span>Students</span>
                                </div>

                            </div>

                            <button
                                type="button"
                                className="sc-view-button"
                                onClick={() =>
                                    navigate(
                                        `/dashboard/ScheduleComponent/ViewByClassName/${row.Classname}`
                                    )
                                }
                            >
                                <span>
                                    <i className="bi bi-calendar-week"></i>
                                    View Timetable
                                </span>

                                <i className="bi bi-arrow-right"></i>
                            </button>

                        </div>

                    ))

                ) : (

                    <div className="sc-empty">

                        <div className="sc-empty-icon">
                            <i className="bi bi-mortarboard"></i>
                        </div>

                        <h3>No Classes Found</h3>

                        <p>
                            You haven't added any classes yet.
                            Create your first class to start managing timetables.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/dashboard/ScheduleComponent/AddClass")
                            }
                        >
                            <i className="bi bi-plus-lg"></i>
                            Add Your First Class
                        </button>

                    </div>

                )}

            </div>

            {/* MOBILE ADD BUTTON */}
            <button
                type="button"
                className="sc-float-button"
                onClick={() =>
                    navigate("/dashboard/ScheduleComponent/AddClass")
                }
                aria-label="Add class"
            >
                <i className="bi bi-plus-lg"></i>
            </button>

            {/* DELETE CONFIRMATION OVERLAY */}
            {selectedClass && (

                <div
                    className="sc-modal-overlay"
                    onClick={() => {
                        if (!deleteLoading) setSelectedClass(null);
                    }}
                >

                    <div
                        className="sc-confirm-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="sc-confirm-icon">
                            <i className="bi bi-trash3-fill"></i>
                        </div>

                        <span className="sc-confirm-label">
                            DELETE CONFIRMATION
                        </span>

                        <h3>Delete Class?</h3>

                        <p>
                            Are you sure you want to delete
                            <strong> {selectedClass.Classname} </strong>
                            class? This action cannot be undone.
                        </p>

                        <div className="sc-confirm-actions">

                            <button
                                type="button"
                                className="sc-cancel-button"
                                onClick={() => setSelectedClass(null)}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="sc-delete-button"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="sc-button-spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3-fill"></i>
                                        Delete Class
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ScheduleClass;
